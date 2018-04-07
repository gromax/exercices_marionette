define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/exercices/show/show_view",
	"apps/exercices/show/answers_view"
], function(
	app,
	Marionette,
	AlertView,
	MissingView,
	View,
	AnswersView
){
	// Il faudra envisager un exercice vide
	// Ou un exercice dont le fichier js n'existe pas
	// et éventuellement un chargement

	var Controller = Marionette.Object.extend({
		channelName: "entities",

		show: function(id, params){
			app.trigger("header:loading", true);

			// Envoyé pour un test direct
			// Ou bien pour l'exécution d'un exofiche


			// id permet de trouver l'exercice
			// d'éventuelles options permettent de paraméter l'exécution de l'exercices
			// -> Elles sont fournies lors d'un test par l'interface adhoc ou si l'exercice est lancé par un exofiche
			// Les inputs. sont forcément fournis par une entrée UE, ou bien sont nulls et initialisés par l'exercice
			// Les liens de sauvegardes : Soit c'est un item de note déjà existant, soit ce sont des idEF et idUF pour en créer un, soit rien du tout=> pas de sauvegarde
			// les answers = peuvent être fournis par le UE

			// le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
			// créera la promesse savingUE
			// ajoutera au savingUE le when -> faits.add() le cas échéant
			// retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()

			// le paramètre save est une fonction qui se charge de l'éventuelle sauvegarde
			// La gestion de optionsValues est un peu complexe :
			// - on ne transmet à l'exercice que les valeurs.
			// - L'exercice, en se chargeant, récupère toutes les infos sur les options avec les descriptions...
			// - Et puis pour initialiser l'exercice on doit lui transmettre les valeurs
			// - C'est donc l'exercice (exercice.js) qui se charge de mêler les infos et les valeurs des options et de le renvoyer à la vue
			var exo_default_params = {
				optionsValues:null,
				showOptionsButton:false,
				showReinitButton:false,
				showAnswersButton:false,
				ue: false,
				save:null,
			};
			var exo_params = _.extend( exo_default_params, params);
			var answersData;
			var inputs;
			if (exo_params.ue) {
				inputs = JSON.parse(exo_params.ue.get("inputs"));
				answersData = JSON.parse(exo_params.ue.get("answers"));
			} else {
				inputs = {};
				answersData = {};
			}

			var self = this;
			var channel = this.getChannel();
			require(["entities/exercice"], function(Exercice){
				var fetchingExercice = channel.request("exercice:entity", id, exo_params.optionsValues, inputs);
				$.when(fetchingExercice).done(function(exo){
					var baremeTotal = exo.baremeTotal();
					var pied = new Backbone.Model({ finished:false, note:0 });
					var view = new View({
						model: exo,
						pied:pied,
						showOptionsButton: exo_params.showOptionsButton,
						showReinitButton: exo_params.showReinitButton,
						showAnswersButton: exo_params.showAnswersButton,
					});
					var note = 0;

					// Recherche la brique ayant le focus en activant/désactivant les flags en chemin
					// renvoie la brique ayant le focus ce qui sera utile lorsqu'on lira un exercice sauvegardé
					var MAJ_briques = function(exoview) {
						var briques = exo.getBriquesUntilFocus();
						_.each(briques, function(b){
							exoview.showItems(b);
						});
						var b=briques.pop();
						if (b!==false) {
							exoview.setFocus(b);
						} else {
							pied.set("finished",true);
						}
						return b; // renvoie la brique ayant le focus
					}

					if (exo_params.showReinitButton) {
						view.on("button:reinit", function(){
							// exo_params contient des informations de sauvegarde avec la fonction save
							// il contient aussi, s'il a déjà été enregistré, un objet UE
							// UE contient les inputs
							// En cas de réinit, la fonction de sauvegarde peut être conservée
							// En revanche le ue doit être effacé
							self.show(id, _.omit(exo_params,"ue"));
						});
					}

					if (exo_params.showOptionsButton) {
						view.on("button:options", function(){
							var modelOptions = new Backbone.Model(exo.get("options"));
							view.showOptionsView(modelOptions);
						});

						view.on("options:form:submit", function(submitedDataOptions){
							var new_exo_params = _.extend(exo_params, { optionsValues:submitedDataOptions });
							self.show(id,new_exo_params);
						});
					}

					if (exo_params.showAnswersButton) {
						view.on("button:answers", function(){
							var aView = new AnswersView({answers:answersData});
							aView.on("form:cancel",function(){
								aView.trigger("dialog:close");
							});
							aView.on("form:submit",function(submitedAnswers){
								exo_params.ue.set("answers", JSON.stringify(submitedAnswers))
								aView.trigger("dialog:close");

								channel.once("update:note", function(note){
									app.trigger("header:loading", true);
									var savingUE = exo_params.ue.save();
									$.when(savingUE).fail(function(response){
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/023]");
										}
									}).always(function(){
										app.trigger("header:loading", false);
									});
								});

								self.show(id, exo_params);
							});
							app.regions.getRegion('dialog').show(aView);
						});
					}

					// Traitement après vérif
					// Dans le but d'enchaîner le traitement initial d'un exercice sauvegardé
					// la fonction renvoie le nouveau focus
					var traitement_final = function(bv,m,v){
						// bv = brique_view => La brique d'exercice dans laquelle s'effectue la vérif
						// m = model => le model associé à la brique
						// v = verifs => le résultats des vérifications menées selon les réponse utilisateur aux questions de cette brique

						pied.set("note",Math.ceil(note));
						// Suppression des items d'input
						_.each(v.toTrash, function(item){ bv.removeItem(item); });
						// Ajout des items de correction
						m.get("items").add(v.add);
						// La brique est marquée comme terminée
						m.set({ done: true, focus: false });
						bv.unsetFocus();
						// recherche du prochain focus
						var focusedBrique = MAJ_briques(view);
						// Exécution de traitemens posts typiquement sur un graphique
						bv.execPosts(v.posts);
						return focusedBrique;
					}

					view.on("brique:form:submit", function(data,brique_view){
						var model = brique_view.model;

						var model_validation = model.validation(data);
						var validation_error = _.some(model_validation, function(item){ return _.has(item, "error"); })
						if (validation_error === false) {
							var verifs = model.verification(model_validation);
							// calcul de la note
							note = verifs.note*model.get("bareme")*100/baremeTotal + note;

							answersData = _.extend(answersData, data);

							if (exo_params.save) {
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

								// le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
								// L'objet contient une clé ue qui sera accessible avec le bon contexte (d'où l'utilisation de apply)
								// si c'est un exercice repris, le ue existe tout de suite, sinon il est false au début
								// L'exécution de la function crée ue s'il n'existait déjà
								// ce qui servira notamment pour un exercice en plus de 1 étape
								// la fonction créera la promesse savingUE
								// ajoutera au savingUE le when -> faits.add() le cas échéant
								// retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()
								var savingUE = exo_params.save.apply(exo_params,[note, answersData, exo.get("inputs"), finished]);
								if (savingUE){
									$.when(savingUE).done(function(){
										traitement_final(brique_view, model, verifs);
									}).fail(function(response){
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/023]");
									});
								} else {
									traitement_final(brique_view, model, verifs);
								}
							} else {
								// On ne sauvegarde pas, on exécuter directement le traitement final
								traitement_final(brique_view, model, verifs);
							}
						} else {
							brique_view.onFormDataInvalid(model_validation);
						}
					});

					// Quand la vue est dans le dom, on lance l'affichage des items
					// Ce traitement n'est fait qu'une fois au début
					// Dans le cas d'un exercice sauvegardé, il y a des answers à traiter
					// Alors on cherche le focus, on vérifie d'éventuelles réponses
					// si les réponses sont valides, on les traite et on cherche le nouveau focus.
					// Cela jusqu'à atteindre la fin de l'exercice ou un focus pour lequel answersData ne contient pas de réponses valides
					view.on("render", function(v){
						var model = MAJ_briques(v);
						if ((model!==false) && !_.isEmpty(answersData)){
							// Il s'agit de la lecture d'une sauvegarde d'exercice
							// model est le focus. Normalement, l'exercice contenant au moins une question, model soit être !==false
							var go_on = true;
							while(go_on && (model!==false)){
								// On s'arêtera si une validation renvoie false ou si on arrive à la fin de l'exercice
								//var model = brique_view.model;
								var brique_view = view.listView.children.findByModel(model);

								var model_validation = model.validation(answersData);
								var validation_error = _.some(model_validation, function(item){ return _.has(item, "error"); })
								if (validation_error === false) {
									var verifs = model.verification(model_validation);
									// calcul de la note
									note = verifs.note*model.get("bareme")*100/baremeTotal + note;
									model = traitement_final(brique_view, model, verifs);
								} else {
									// La validation n'ayant pas abouti, on ne va pas plus loin
									go_on = false;
								}
							}
							if (exo_params.ue){
								// Lors d'un refresh avec changement de answers, la note peut avoir changé
								exo_params.ue.set("note",note);
								channel.trigger("update:note");
							}
						}
					});

					app.regions.getRegion('main').show(view);

				}).fail(function(response){
					var view = new MissingView({ message:"Cet exercice n'existe pas !" });
					app.regions.getRegion('main').show(view);
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		},

		execExoForTest:function(id){
			// Fonction pour éviter d'attaquer show depuis l'extérieur
			this.show(id,{ showOptionsButton:true, showReinitButton:true });
		},

		execExoFicheForProf: function(id){
			// Il faut charger le exofiche correspondant à id pour obtenir le idE et data.options
			var channel = this.getChannel();
			var that = this;
			app.trigger("header:loading", true);
			require(["entities/dataManager"], function(){
				var fetchingExoFiches = channel.request("custom:entities", ["exofiches"]);
				$.when(fetchingExoFiches).done(function(exofiches){
					var exofiche = exofiches.get(id);
					if (exofiche){
						var idFiche = exofiche.get('idFiche');
						var liste = exofiches.where({"idFiche":idFiche});
						var index = 1+_.findIndex(liste, function(item){ return item.get("id") == id; });

						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Exercices", e:"devoir:showExercices", data:idFiche, link:"devoir:"+idFiche+"/exercices"},
							{ text:"Exercice "+index, e:"exercice-fiche:run", data:id, link:"exercice-fiche:"+id}
						]);

						var idE = exofiche.get("idE");
						// On ne doit transmettre que des options brutes
						var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
							return val.value;
						});
						that.show(idE, { optionsValues:exoficheOptions, showReinitButton:true });
					} else {
						var view = new MissingView({ message:"Cet exercice n'existe pas !" });
						app.Ariane.add([
							{ text:"Fiche inconnue" }
						]);
						app.regions.getRegion('main').show(view);
					}
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
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
			app.trigger("header:loading", true);
			require(["entities/aUE", "entities/dataManager"], function(ItemUE){
				var fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var exofiche = exofiches.get(idEF);
					var userfiche = userfiches.get(idUF);
					if (exofiche && userfiche){
						// Il faut récupérer le numéro de l'exercice dans le devoir
						var liste = exofiches.where({"idFiche":userfiche.get("idFiche")});
						var index = 1+_.findIndex(liste, function(item){ return item.get("id") == idEF; });
						app.Ariane.add([
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
							{ text:"Exercice "+(index+1)+"/"+liste.length, e:"exercice-fiche:run", data:[idEF, idUF], link:"user-fiche:"+idUF+"/exercice-fiche:" + idEF },
						]);
						var idE = exofiche.get("idE");
						// On ne doit transmettre que des options brutes
						var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
							return val.value;
						});

						// le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
						// L'objet contient une clé ue qui sera accessible avec le bon contexte (d'où l'utilisation de apply)
						// si c'est un exercice repris, le ue existe tout de suite, sinon il est false au début
						// L'exécution de la function crée ue s'il n'existait déjà
						// ce qui servira notamment pour un exercice en plus de 1 étape
						// la fonction créera la promesse savingUE
						// ajoutera au savingUE le when -> faits.add() le cas échéant
						// retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()

						var saveFunction = false;
						if (userfiche.get("actif") && userfiche.get("ficheActive")){
							// La fiche étant active, l'exercice sera sauvegardé
							saveFunction = function(note, answers, inputs, finished){
								var newUE = false;
								var ue = this.ue; // cette commande nécessite que la fonction soit appelée dans le bon contexte
								if (!ue) {
									ue = new ItemUE({
										aEF: Number(idEF),
										aUF: Number(idUF),
										inputs: JSON.stringify(inputs),
									});
									newUE = true;
								}

								var savingUE = ue.save({
									note: Math.ceil(note),
									answers: JSON.stringify(answers),
									finished: finished
								});

								if (newUE) {
									var thisObj = this;
									$.when(savingUE).done(function(){
										faits.add(ue);
										thisObj.ue = ue;
									});
								}

								return savingUE;
							}
						}

						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:true });
					} else {
						var view = new MissingView({ message:"Cet exercice n'existe pas !" });
						app.regions.getRegion('main').show(view);
					}
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		},


		execUEForProf:function(idUE){
			var self = this;
			var channel = this.getChannel();
			app.trigger("header:loading", true);
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var ue = faits.get(idUE);
					if (ue){
						var idEF = ue.get("aEF");
						var idUF = ue.get("aUF");
						var userfiche = userfiches.get(idUF);
						var nomCompletUser = userfiche.get("nomCompletUser");
						var exofiche = exofiches.get(idEF);
						var idFiche = exofiche.get("idFiche");

						var EFs = exofiches.where({idFiche : idFiche});
						var index = _.findIndex(EFs, function(it){
							return it.get("id") == idEF;
						});

						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Fiches élèves", e:"devoir:showUserfiches", data:idFiche, link:"devoir:"+idFiche+"/fiches-eleves"},
							{ text:nomCompletUser+" #"+idUF, e:"devoirs:fiche-eleve:show", data:idUF, link:"devoirs/fiche-eleve:"+idUF },
							{ text:"Exercice "+(index+1), e:"devoirs:fiche-eleve:faits", data:[idUF, idEF], link:"devoirs/fiche-eleve:"+idUF+"/exercice:"+idEF },
							{ text:"Essai #"+idUE, e:"exercice-fait:run", data:idUE, link:"exercice-fait:"+idUE }
						]);


						// debug : prévoir une fenêtre de modif des données

						var idE = exofiche.get("idE");
						// On ne doit transmettre que des options brutes
						var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
							return val.value;
						});

						var saveFunction = false;
						var showReinitButton = false;
						if (userfiche.get("actif") && userfiche.get("ficheActive")){
							// La fiche étant active, l'exercice sera sauvegardé
							// Il parait aussi logique de permettre de poursuivre la fiche en relancçant l'exercice
							showReinitButton = true
							saveFunction = function(note, answers, inputs, finished){
								var ue = this.ue; // cette commande nécessite que la fonction soit appelée dans le bon contexte
								if (ue) {
									var savingUE = ue.save({
										note: Math.ceil(note),
										answers: JSON.stringify(answers),
										finished: finished
									});
									return savingUE;
								} else {
									return false;
								}
							}
						}

						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:showReinitButton, ue:ue, showAnswersButton:true });

					} else {
						app.Ariane.add([
							{ text:"Élément manquant"}
						]);

						var view = new MissingView({ message:"Cette sauvegarde de votre travail n'existe pas !" });
						app.regions.getRegion('main').show(view);
					}
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		},

		execUEForEleve:function(idUE){
			var self = this;
			var channel = this.getChannel();
			app.trigger("header:loading", true);
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var ue = faits.get(idUE);
					if (ue){
						var idEF = ue.get("aEF");
						var idUF = ue.get("aUF");
						var userfiche = userfiches.get(idUF);
						var exofiche = exofiches.get(idEF);
						var idFiche = exofiche.get("idFiche");
						var EFs = exofiches.where({idFiche : idFiche});
						var index = _.findIndex(EFs, function(it){
							return it.get("id") == idEF;
						});

						app.Ariane.add([
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
							{ text:"Exercice "+(index+1), e:"userfiche:exofiche:faits", data:[idUF,idEF], link:"devoir:"+idUF+"/exercice:"+idEF},
							{ text:"Essai #"+idUE },
						]);

						var idE = exofiche.get("idE");
						// On ne doit transmettre que des options brutes
						var exoficheOptions = _.mapObject(exofiche.get("options"), function(val,key){
							return val.value;
						});

						var saveFunction = false;
						var showReinitButton = false;
						if (userfiche.get("actif") && userfiche.get("ficheActive")){
							// La fiche étant active, l'exercice sera sauvegardé
							// Il parait aussi logique de permettre de poursuivre la fiche en relancçant l'exercice
							showReinitButton = true
							saveFunction = function(note, answers, inputs, finished){
								var newUE = false;
								var ue = this.ue; // cette commande nécessite que la fonction soit appelée dans le bon contexte
								if (!ue) {
									ue = new ItemUE({
										aEF: Number(idEF),
										aUF: Number(idUF),
										inputs: JSON.stringify(inputs),
									});
									newUE = true;
								}

								var savingUE = ue.save({
									note: Math.ceil(note),
									answers: JSON.stringify(answers),
									finished: finished
								});

								if (newUE) {
									var thisObj = this;
									$.when(savingUE).done(function(){
										faits.add(ue);
										thisObj.ue = ue;
									});
								}

								return savingUE;
							}
						}

						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:showReinitButton, ue:ue });

					} else {
						var view = new MissingView({ message:"Cette sauvegarde de votre travail n'existe pas !" });
						app.regions.getRegion('main').show(view);
					}
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		}

	});

	return new Controller();
});
