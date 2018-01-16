define(["app","marionette","apps/common/loading_view", "apps/common/missing_item_view", "apps/exercices/show/show_view"], function(app, Marionette, LoadingView, MissingView, View){
	// Il faudra envisager un exercice vide
	// Ou un exercice dont le fichier js n'existe pas
	// et éventuellement un chargement

	var Controller = Marionette.Object.extend({
		channelName: "entities",

		show: function(id, exoDataOptions, exoDataInputs){
			// Cette partie est-elle vraiment utile ? à voir
			//var loadingView = new LoadingView({
			//	title: "Exercice #"+id,
			//	message: "Chargement des données."
			//});
			//app.regions.getRegion('main').show(loadingView);

			var self = this;
			var channel = this.getChannel();
			require(["entities/exercice"], function(Exercice){
				var fetchingExercice = channel.request("exercice:entity", id, exoDataOptions, exoDataInputs);
				$.when(fetchingExercice).done(function(exo){
					var baremeTotal = exo.baremeTotal();
					var pied = new Backbone.Model({ finished:false, note:0 });
					var view = new View({ model: exo, pied:pied, showOptions:true });
					var note = 0;

					var MAJ_briques = function(exoview) {
						var briques = exo.getBriquesUntilFocus();
						for (b of briques) {
							exoview.showItems(b);
						}
						var b=briques.pop();
						if (b!==false) {
							exoview.setFocus(b);
						} else {
							pied.set("finished",true);
						}

					}

					view.on("button:reinit", function(){
						self.show(id,exoDataOptions,exoDataInputs);
					});

					view.on("button:options", function(){
						var modelOptions = new Backbone.Model(exo.get("options"));
						view.showOptionsView(modelOptions);
					});

					view.on("options:form:submit", function(submitedDataOptions){
						self.show(id,submitedDataOptions);
					});

					view.on("brique:form:submit", function(data,brique_view){
						var model = brique_view.model;

						var model_validation = model.validation(data);
						var validation_error = _.some(model_validation, function(item){ return _.has(item, "error"); })
						if (validation_error === false) {
							var verifs = model.verification(model_validation);
							// Il va falloir calculer la note
							note = verifs.note*model.get("bareme")*100/baremeTotal + note;
							pied.set("note",Math.ceil(note));
							// Suppression des items d'input
							_.each(verifs.toTrash, function(item){ brique_view.removeItem(item); });
							// Ajout des items de correction
							model.get("items").add(verifs.add);
							// La brique est marquée comme terminée
							model.set({ done:true, focuser:false });
							brique_view.unsetFocus();
							// recherche du prochain focus
							MAJ_briques(view);
							// Exécution de traitemens posts typiquement sur un graphique
							brique_view.execPosts(verifs.posts);
						} else {
							brique_view.onFormDataInvalid(model_validation);
						}
					});

					// Quand la vue est dans le dom, on lance l'affichage des items
					view.on("render", MAJ_briques);

					app.regions.getRegion('main').show(view);

				}).fail(function(response){
					var view = new MissingView({ message:"Cet exercice n'existe pas !" });
					app.regions.getRegion('main').show(view);
				});
			});
		},

		execExoFicheForTest: function(id){
			// Il faut charger le exofiche correspondant à id pour obtenir le idE et data.options
			var channel = this.getChannel();
			var that = this;
			require(["entities/exofiche"], function(ExoFiche){
				var fetchingExoFiche = channel.request("exofiche:entity", id);
				$.when(fetchingExoFiche).done(function(exofiche){
					var idE = exofiche.get("idE");
					// On ne doit transmettre que des options brutes
					var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
						return val.value;
					});
					that.show(idE, exoficheOptions);
				}).fail(function(){
					var view = new MissingView({ message:"Cet exercice n'existe pas !" });
					app.regions.getRegion('main').show(view);
				});
			});
		},

		execExoFicheForEleve: function(idUF, idEF){
			// Cette partie est-elle vraiment utile ? à voir
			//var loadingView = new LoadingView({
			//	title: "Exercice #"+id,
			//	message: "Chargement des données."
			//});
			//app.regions.getRegion('main').show(loadingView);

			var self = this;
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("eleve:entities");
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var exofiche = exofiches.get(idEF);
					var userfiche = userfiches.get(idUF);
					if (exofiche && userfiche){
						// Il faut récupérer le numéro de l'exercice dans le devoir
						var liste = exofiches.where({"idFiche":userfiche.get("idFiche")});
						var index = _.findIndex(liste, function(item){ return item.get("id") == idEF; });
						app.Ariane.add([
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
							{ text:"Exercice "+(index+1)+"/"+liste.length, e:"exercice-fiche:run", data:[idEF, idUF], link:"user-fiche:"+idUF+"/exercice-fiche:" + idEF },
						]);
						var idE = exofiche.get("idE");
						// On ne doit transmettre que des options brutes
						var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
							return val.value;
						});
						self.execExerciceForEleve(idE, idEF, idUF, faits, exoficheOptions);
					} else {
						var view = new MissingView({ message:"Cet exercice n'existe pas !" });
						app.regions.getRegion('main').show(view);
					}
				});
			});
		},

		execExerciceForEleve: function(idE, idEF, idUF, faits, exoficheOptions, exoDataInputs){
			// Ce qui fait une grande différence ici, c'est la gestion de l'item faits
			// Un objet sauvegarde les données utilisateur au fur et à mesure
			var answersData = {}
			// Un objet pour la note en BDD qui sera initialisé lors de la première validation puis réutilisé plus tard
			var itemUE = null

			var self = this;
			var channel = this.getChannel();
			require(["entities/exercice", "entities/aUE"], function(Exercice,ItemUE){
				var fetchingExercice = channel.request("exercice:entity", idE, exoficheOptions, exoDataInputs);
				$.when(fetchingExercice).done(function(exo){
					var baremeTotal = exo.baremeTotal();
					var pied = new Backbone.Model({ finished:false, note:0 });
					var view = new View({ model: exo, pied:pied, showOptions:false });
					var note = 0;

					var MAJ_briques = function(exoview) {
						var briques = exo.getBriquesUntilFocus();
						for (b of briques) {
							exoview.showItems(b);
						}
						var b=briques.pop();
						if (b!==false) {
							exoview.setFocus(b);
						} else {
							pied.set("finished",true);
						}

					}

					view.on("button:reinit", function(){
						self.execExerciceForEleve(idE, idEF, idUF, faits, exoficheOptions);
					});

					view.on("brique:form:submit", function(data,brique_view){
						var model = brique_view.model;

						// debug : Je n'appelle plus ici go mais le détail des fonctions validation et verification
						var model_validation = model.validation(data);
						var validation_error = _.some(model_validation, function(item){ return _.has(item, "error"); })
						if (validation_error === false) {
							var verifs = model.verification(model_validation);
							note = verifs.note*model.get("bareme")*100/baremeTotal + note;
							// On peut envisager la sauvegarde de la note
							// On doit sauvegarder : inputs + note + answers
							if (itemUE == null) {
								var itemUE = new ItemUE();
								var newUE = true; // flag permettant de savoir si on doit ajouter l'item à la liste
							} else {
								var newUE = false;
							}

							answersData = _.extend(answersData, data);
							// on recherche tous les items de validation qui ne seraient pas éliminés par toTrash
							// S'il n'y en a pas, c'est que l'exercice est terminé
							var finished = _.difference(
								_.flatten(
									_.map(
										exo.get("briquesCollection").models,
										function(item){ return item.get("items").where({type:"validation"}); }
									)
								),
								verifs.toTrash
							).length ==0 ;

							var savingItemUE = itemUE.save({
								aEF: Number(idEF),
								aUF: Number(idUF),
								note: Math.ceil(note),
								answers: JSON.stringify(answersData),
								inputs: JSON.stringify(exo.get("inputs")),
								finished: finished
							});

							$.when(savingItemUE).done(function(){
								// Il faut ajouter le nouvel item à la collection des faits
								if (newUE) {
									faits.add(itemUE);
								}
								pied.set("note",note);
								// Suppression des items d'input
								_.each(verifs.toTrash, function(item){ brique_view.removeItem(item); });
								// Ajout des items de correction
								model.get("items").add(verifs.add);
								// La brique est marquée comme terminée
								model.set({ done: true, focus: false });
								brique_view.unsetFocus();
								// recherche du prochain focus
								MAJ_briques(view);
							}).fail(function(response){
								alert("An unprocessed error happened. Please try again!");
							});

						} else {
							brique_view.onFormDataInvalid(model_validation);
						}
					});

					// Quand la vue est dans le dom, on lance l'affichage des items
					view.on("render", MAJ_briques);

					app.regions.getRegion('main').show(view);

				}).fail(function(response){
					var view = new MissingView({ message:"Cet exercice n'existe pas !" });
					app.regions.getRegion('main').show(view);
				});
			});

		}

	});

	return new Controller();
});
