define(["backbone.radio"], function(Radio){
	// Ce module centralise l'accès aux données
	// afin de mettre en cache et d'empêcher des doublons dans la structure complexe
	// des userfiches, devoirs, exofiches, faits

	// Rappel de structure :
	// - devoir ou fiche, est le parent des devoirs. Il comporte nom, description, date, actif, visible
	// - exofiche est un lien entre fiche et exercice. les exofiches d'un devoir constituent la liste des exercices
	// exofiche contient idFiche, idE, num (nombre minimal de répétition de l'exercice), coeff, options
	// - userfiche est un lien entre fiche et user. La fiche de devoir étant créée, le lien indique quel élève doit faire le devoir.
	// rien n'empêche d'ailleurs qu'un même élève ait plusieurs liens vers le devoir
	// Une première difficulté sera que userfiche générera une note correspondant à la note obtenue par l'élève à ce devoir
	// mais le calcul de cette note dépend de la liste d'exofiches qui est liée au devoir.
	// userfiche contient : idUser, idFiche, date, actif
	// - fait ou aUE : Chaque fois qu'un élève fait un exercice, il crée une entrée en BDD comprenant la note et les paramètres de cette occurence de l'exercice
	// fait est lié à un exofiche qui définit les paramètres, et à un userfiche qui défini dans quel occurence du devoir (et donc l'id de l'élève est dans le usrfiche) se trouve cet exercice

	// Une autre difficulté est que pour l'affichage d'une même page, on aura besoin simultanément de plusieurs éléments
	// par exemple un prof qui charge un devoir et veut visualiser tous les liens userfiche avec les notes,
	// il doit charger le devoir, les userfiches, les exofiches du devoir et les faits.
	// mais on ne peut pas lancer des requêtes séparées car quatre requête simultanées provoquent une réponse 401 ou 403 du serveur
	// de plus, suite à ce chargement, il y a une bonne dose de calcul pour les notes notamment

	// La solution serait alors de charger d'une façon unique, quitte à faire un gros chargement, mais ça ne change pas grand chose
	// à le garder en mémoire ên évitant les doublons.
	// J'ai essayé le plugin de cache backbone-fetch-cache
	// Son défaut est qu'il se contente de sauvegarder le retour de la requête ajax
	// lors d'une requête ultérieure, on évite l'échange avec le serveur mais on reproduit tout le calcul
	// et surtout les données sauvegardées sont potentiellement dépassées...
	// Je vais donc plutôt garder une copie structurée des données, sous forme de collection

	// Plutôt qu'une structuration type devoir, a des enfants exofiche et userfiche, userfiche a des enfants faits et des liens vers les exofiches correspondants
	// je vais plutôt utiliser une grande collection pour chacun des items
	// et si par exemple j'ai besoin des exofiches d'un devoir, je me contente de filtrer parmi tous les exofiches ceux dont j'ai besoin.


	var API = {
		timeout:1500000,
		lastTime:null,
		lastTimeClasses:null,
		lastTimeUsers:null,
		stored_userfiches:null,
		stored_exofiches:null,
		stored_faits:null,
		stored_devoirs:null,
		stored_users:null,
		getEleveEntities: function(){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_userfiches!==null) && (API.stored_exofiches!==null) && (API.stored_faits!==null) && (t-API.lastTime<API.timeout)){
				defer.resolve(API.stored_userfiches, API.stored_exofiches, API.stored_faits);
			} else {
				var request = $.ajax("api/eleveData",{
					method:'GET',
					dataType:'json'
				});

				request.done(function(data){
					require(["entities/userfiches", "entities/exofiches", "entities/aUEs"], function(UF_collec, EF_collec, UE_collec){
						var userfiches = new UF_collec(data.aUFs, { parse:true });
						var exofiches = new EF_collec(data.aEFs, { parse:true });
						var faits = new UE_collec(data.aUEs, { parse:true });
						API.stored_userfiches = userfiches;
						API.stored_exofiches = exofiches;
						API.stored_faits = faits;
						API.lastTime = t;
						defer.resolve(userfiches, exofiches, faits);
					});
				});
			}

			var promise = defer.promise();
			return promise;
		},

		getProfEntities: function(){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_devoirs!==null) && (API.stored_userfiches!==null) && (API.stored_exofiches!==null) && (API.stored_faits!==null) && (t-API.lastTime<API.timeout)){
				defer.resolve(API.stored_devoirs, API.stored_userfiches, API.stored_exofiches, API.stored_faits);
			} else {
				var request = $.ajax("api/profData",{
					method:'GET',
					dataType:'json'
				});

				request.done(function(data){
					require(["entities/devoirs", "entities/userfiches", "entities/exofiches", "entities/aUEs"], function(devoir_collec, UF_collec, EF_collec, UE_collec){
						var devoirs = new devoir_collec(data.fiches, { parse:true });
						var userfiches = new UF_collec(data.aUFs, { parse:true });
						var exofiches = new EF_collec(data.aEFs, { parse:true });
						var faits = new UE_collec(data.aUEs, { parse:true });
						API.stored_devoirs = devoirs;
						API.stored_userfiches = userfiches;
						API.stored_exofiches = exofiches;
						API.stored_faits = faits;
						API.lastTime = t;
						defer.resolve(devoirs, userfiches, exofiches, faits);
					});
				});
			}

			var promise = defer.promise();
			return promise;
		},

		getClasses: function(){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_classes!==null) && (t-API.lastTimeClasses<API.timeout)){
				defer.resolve(API.stored_classes);
			} else {
				require(["entities/classes"], function(classe_collec){
					classes = new classe_collec();
					classes.fetch({
						success: function(data){
							API.stored_classes = data;
							API.lastTimeClasses = t;
							defer.resolve(data);
						},
					});
				});
			}

			var promise = defer.promise();
			return promise;
		},

		getClasse: function(classeId){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_classes!==null) && (t-API.lastTimeClasses<API.timeout)){
				defer.resolve(API.stored_classes.get(classeId));
			} else {
				require(["entities/classes"], function(classe_collec){
					classes = new classe_collec();
					classes.fetch({
						success: function(data){
							API.stored_classes = data;
							API.lastTimeClasses = t;
							defer.resolve(data.get(classeId));
						},
					});
				});
			}

			var promise = defer.promise();
			return promise;
		},

		getUsers: function(){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_users!==null) && (t-API.lastTimeUsers<API.timeout)){
				defer.resolve(API.stored_users);
			} else {
				require(["entities/users"], function(user_collec){
					var users = new user_collec();
					users.fetch({
						success: function(data){
							API.stored_users = data;
							API.lastTimeUsers = t;
							defer.resolve(data);
						}
					});
				});
			}

			var promise = defer.promise();
			return promise;
		},

		getUser: function(userId){
			t= Date.now();
			var defer = $.Deferred();

			if ((API.stored_users!==null) && (t-API.lastTimeUsers<API.timeout)){
				defer.resolve(API.stored_users.get(userId));
			} else {
				require(["entities/users"], function(user_collec){
					var users = new user_collec();
					users.fetch({
						success: function(data){
							API.stored_users = data;
							API.lastTimeUsers = t;
							defer.resolve(data.get(userId));
						}
					});
				});
			}

			var promise = defer.promise();
			return promise;

		},

		purge: function(){
			console.log("purge des données");
			API.stored_devoirs = null;
			API.stored_userfiches = null;
			API.stored_exofiches = null;
			API.stored_faits = null;
			API.stored_classes = null;
			API.stored_users = null;
		},

	};

	var channel = Radio.channel('entities');
	channel.reply('eleve:entities', API.getEleveEntities );
	channel.reply('prof:entities', API.getProfEntities );
	channel.reply('data:purge', API.purge );
	channel.reply('classes:entities', API.getClasses );
	channel.reply('classe:entity', API.getClasse );
	channel.reply('users:entities', API.getUsers );
	channel.reply('user:entity', API.getUser );
});
