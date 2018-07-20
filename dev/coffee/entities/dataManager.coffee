define ["backbone.radio"], (Radio)->
	###
	Ce module centralise l'accès aux données
	afin de mettre en cache et d'empêcher des doublons dans la structure complexe
	des userfiches, devoirs, exofiches, faits

	Rappel de structure :
	 - devoir ou fiche, est le parent des devoirs. Il comporte nom, description, date, actif, visible
	 - exofiche est un lien entre fiche et exercice. les exofiches d'un devoir constituent la liste des exercices
	 exofiche contient idFiche, idE, num (nombre minimal de répétition de l'exercice), coeff, options
	 - userfiche est un lien entre fiche et user. La fiche de devoir étant créée, le lien indique quel élève doit faire le devoir.
	 rien n'empêche d'ailleurs qu'un même élève ait plusieurs liens vers le devoir
	 Une première difficulté sera que userfiche générera une note correspondant à la note obtenue par l'élève à ce devoir
	 mais le calcul de cette note dépend de la liste d'exofiches qui est liée au devoir.
	 userfiche contient : idUser, idFiche, date, actif
	 - fait ou aUE : Chaque fois qu'un élève fait un exercice, il crée une entrée en BDD comprenant la note et les paramètres de cette occurence de l'exercice
	 fait est lié à un exofiche qui définit les paramètres, et à un userfiche qui défini dans quel occurence du devoir (et donc l'id de l'élève est dans le usrfiche) se trouve cet exercice

	 Une autre difficulté est que pour l'affichage d'une même page, on aura besoin simultanément de plusieurs éléments
	 par exemple un prof qui charge un devoir et veut visualiser tous les liens userfiche avec les notes,
	 il doit charger le devoir, les userfiches, les exofiches du devoir et les faits.
	 mais on ne peut pas lancer des requêtes séparées car quatre requête simultanées provoquent une réponse 401 ou 403 du serveur
	 de plus, suite à ce chargement, il y a une bonne dose de calcul pour les notes notamment

	 La solution serait alors de charger d'une façon unique, quitte à faire un gros chargement, mais ça ne change pas grand chose
	 à le garder en mémoire ên évitant les doublons.
	 J'ai essayé le plugin de cache backbone-fetch-cache
	 Son défaut est qu'il se contente de sauvegarder le retour de la requête ajax
	 lors d'une requête ultérieure, on évite l'échange avec le serveur mais on reproduit tout le calcul
	 et surtout les données sauvegardées sont potentiellement dépassées...
	 Je vais donc plutôt garder une copie structurée des données, sous forme de collection

	 Plutôt qu'une structuration type devoir, a des enfants exofiche et userfiche, userfiche a des enfants faits et des liens vers les exofiches correspondants
	 je vais plutôt utiliser une grande collection pour chacun des items
	 et si par exemple j'ai besoin des exofiches d'un devoir, je me contente de filtrer parmi tous les exofiches ceux dont j'ai besoin.
	###

	API = {
		timeout:1500000
		stored_data:{}
		stored_time:{}

		getCustomEntities: (ask) ->
			t= Date.now()
			defer = $.Deferred()
			toFetch = _.filter ask, (item)-> (typeof API.stored_data[item] is "undefined") or (typeof API.stored_time[item] is "undefined") or (t-API.stored_time[item]>API.timeout)
			if toFetch.length is 0
				# Pas de fetch requis => on renvoie les résultats
				defer.resolve.apply(null,_.map(ask, (item)-> API.stored_data[item]))
			else
				request = $.ajax("api/customData/"+toFetch.join("&"),{
					method:'GET'
					dataType:'json'
				})

				request.done( (data)->
					require [
						"entities/devoirs",
						"entities/userfiches",
						"entities/exofiches",
						"entities/aUEs",
						"entities/users",
						"entities/exams",
						"entities/messages"
					], (
						devoir_collec,
						UF_collec,
						EF_collec,
						UE_collec,
						U_collec,
						Ex_collec,
						M_collec
					) ->
						if data.fiches
							API.stored_data.fiches = new devoir_collec(data.fiches, { parse:true })
							API.stored_time.fiches = t
						if data.userfiches
							API.stored_data.userfiches = new UF_collec(data.userfiches, { parse:true })
							API.stored_time.userfiches = t
						if data.exofiches
							API.stored_data.exofiches = new EF_collec(data.exofiches, { parse:true })
							API.stored_time.exofiches = t
						if data.faits
							API.stored_data.faits = new UE_collec(data.faits, { parse:true })
							API.stored_time.faits = t
						if data.users
							API.stored_data.users = new U_collec(data.users, { parse:true })
							API.stored_time.users = t
						if data.exams
							API.stored_data.exams = new Ex_collec(data.exams, { parse:true })
							API.stored_time.exams = t
						if data.messages
							API.stored_data.messages = new M_collec(data.messages, {parse:true})
						defer.resolve.apply(null,_.map(ask, (item)-> API.stored_data[item] ))
				).fail( (response)->
					defer.reject(response)
				);

			return promise = defer.promise();

		getClasses: ->
			t= Date.now()
			defer = $.Deferred()

			if (typeof API.stored_data.classes isnt "undefined") and (typeof API.stored_time.classes isnt "undefined") and (t-API.stored_time.classes<API.timeout)
				defer.resolve(API.stored_data.classes)
			else
				require ["entities/classes"], (classe_collec)->
					classes = new classe_collec()
					classes.fetch {
						success: (data) ->
							API.stored_data.classes = data
							API.stored_time.classes = t
							defer.resolve(data);
					}
			return promise = defer.promise()

		getClasse: (classeId) ->
			defer = $.Deferred()
			fetchingClasses = API.getClasses()
			$.when(fetchingClasses).done( (classes)->
				defer.resolve(classes.get(classeId))
			)

			return promise = defer.promise();

		getUser: (userId) ->
			defer = $.Deferred()
			fetchingUsers = API.getCustomEntities(["users"])
			$.when(fetchingUsers).done( (users)->
				defer.resolve(users.get(userId))
			).fail( (response)->
				defer.reject(response)
			)

			return promise = defer.promise()

		getMe: ->
			defer = $.Deferred()
			t= Date.now()
			if (typeof API.stored_data.me isnt "undefined") and (typeof API.stored_time.me isnt "undefined") and (t-API.stored_time.me<API.timeout)
				defer.resolve(API.stored_data.me)
			else
				request = $.ajax("api/me",{
					method:'GET'
					dataType:'json'
				})

				request.done( (data)->
					require ["entities/user"], (User) ->
						API.stored_data.me = new User(data, {parse:true})
						API.stored_time.me = t
						defer.resolve(API.stored_data.me)
				).fail( (response)->
					defer.reject(response)
				);
			return defer.promise()

		purge: ->
			console.log("purge des données")
			API.stored_data = {}

		userDestroyUpdate: (idUser)->
			# Assure le cache quand un user est supprimé
			if API.stored_data.userfiches
				userfichesToPurge = API.stored_data.userfiches.where({idUser : idUser})
				API.stored_data.userfiches.remove(userfichesToPurge)
			if (API.stored_data.faits)
				delete API.stored_data.faits

		ficheDestroyUpdate: (idFiche) ->
			# Assure le cache quand un user est supprimé
			if API.stored_data.userfiches
				userfichesToPurge = API.stored_data.userfiches.where({idFiche : idFiche})
				API.stored_data.userfiches.remove(userfichesToPurge)
			if API.stored_data.exofiches
				exofichesToPurge = API.stored_data.exofiches.where({idFiche : idFiche})
				API.stored_data.exofiches.remove(exofichesToPurge)
			if API.stored_data.faits
				delete API.stored_data.faits
	}

	channel = Radio.channel('entities')
	channel.reply('custom:entities', API.getCustomEntities )
	channel.reply('data:purge', API.purge )
	channel.reply('classes:entities', API.getClasses )
	channel.reply('classe:entity', API.getClasse )
	channel.reply('user:entity', API.getUser )
	channel.reply('user:me', API.getMe )
	channel.reply('user:destroy:update', API.userDestroyUpdate )
	channel.reply('fiche:destroy:update', API.ficheDestroyUpdate )
