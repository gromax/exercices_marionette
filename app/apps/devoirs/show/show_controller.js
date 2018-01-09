define([
	"app",
	"marionette",
	"apps/common/loading_view",
	"apps/devoirs/show/show_layout",
	"apps/devoirs/show/tabs_panel",
	"apps/devoirs/show/show_view",
	"apps/common/missing_item_view",
	"apps/devoirs/show/exercices_list_view",
	"apps/devoirs/show/exercices_list_panel",
	"apps/exercices/list/list_view",
	"apps/devoirs/show/notes_list_view",
	"apps/devoirs/show/notes_list_panel",
	"apps/devoirs/show/add_eleve_list_view",
	"apps/devoirs/show/add_eleve_panel",
], function(
	app,
	Marionette,
	LoadingView,
	Layout,
	TabsPanel,
	ShowView,
	MissingView,
	ExercicesListView,
	ExercicesPanel,
	AddExerciceView,
	ElevesListView,
	ElevesPanel,
	AddEleveView,
	AddElevePanel
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		show: function(id){
			// vue des paramètres du devoir lui même
			var layout = new Layout();
			var tabs = new TabsPanel({panel:0});

			tabs.on("tab:exercices", function(){
				app.trigger("devoir:showExercices",id);
			});

			tabs.on("tab:notes", function(){
				app.trigger("devoir:showUserfiches",id);
			});

			tabs.on("tab:eleves", function(){
				app.trigger("devoir:addUserfiche",id);
			});

			tabs.on("tab:exams", function(){
				app.trigger("devoir:exams",id);
			});

			var loadingView = new LoadingView({
				title: "Affichage d'un devoir",
				message: "Chargement des données."
			});

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
				layout.getRegion('contentRegion').show(loadingView);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("prof:entities");
				$.when(fetchingData).done(function(fiches, userfiches, exofiches, faits){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						var view = new ShowView({
							model: fiche,
							editMode: false,
						});;

						view.on("devoir:edit", function(view){
							view.goToEdit();
						});

						view.on("form:submit", function(data){
							var updatingItem = fiche.save(data);
							if(updatingItem){
								$.when(updatingItem).done(function(){
									view.goToShow();
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									}
									else{
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								});
							}
							else {
								view.triggerMethod("form:data:invalid", fiche.validationError);
							}
						});

						layout.getRegion('contentRegion').show(view);
					} else{
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
					}
				});
			});
		},

		showExercices: function(id){
			// Vue pour les exercices de la fiche
			var layout = new Layout();
			var tabs = new TabsPanel({panel:1});

			tabs.on("tab:devoir", function(){
				app.trigger("devoir:show",id);
			});

			tabs.on("tab:notes", function(){
				app.trigger("devoir:showUserfiches",id);
			});

			tabs.on("tab:eleves", function(){
				app.trigger("devoir:addUserfiche",id);
			});

			tabs.on("tab:exams", function(){
				app.trigger("devoir:exams",id);
			});

			var loadingView = new LoadingView({
				title: "Affichage des exercices d'un devoir",
				message: "Chargement des données."
			});

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
				layout.getRegion('contentRegion').show(loadingView);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("prof:entities");
				$.when(fetchingData).done(function(fiches, userfiches, exofiches, faits){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						var view = new ExercicesListView({ collection:exofiches, idFiche:fiche.get("id") });
						view.on("childview:exercice:delete", function(childView){
							childView.remove();
						});

						view.on("childview:exercice:edit", function(childView){
							childView.goToEdit();
						});

						view.on("childview:exercice:cancel", function(childView){
							childView.goToShow();
						});

						view.on("childview:exercice:test", function(childView){
							var model = childView.model;
							app.trigger("exercice-fiche:run", model.get("id"));
						});

						view.on("childview:form:submit", function(childView, data){
							var model = childView.model;
							var updatingItem = model.save(data);
							if(updatingItem){
								$.when(updatingItem).done(function(){
									childView.goToShow();
								}).fail(function(response){
									if(response.status == 422){
										childView.triggerMethod("form:data:invalid", response.responseJSON.errors);
									}
									else{
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								});
							}
							else {
								childView.triggerMethod("form:data:invalid", fiche.validationError);
							}
						});

						var panel = new ExercicesPanel();
						panel.on("exercice:new", function(){
							require(["entities/exofiche", "entities/exercices"], function(ExoFiche){
								var collection = channel.request("exercices:entities");

								// debug : réutiliser la vue de l'autre appli n'est peut être pas idéal
								var addExerciceView = new AddExerciceView({
									collection: collection
								});

								addExerciceView.on("childview:exercice:show",function(childView, args){
									var model = childView.model;
									var new_exofiche = new ExoFiche({ idFiche:fiche.get("id") , idE:model.get("id") }, { parse:true});
									var savingItem = new_exofiche.save();
									if (savingItem){
										$.when(savingItem).done(function(){
											exofiches.add(new_exofiche);
											addExerciceView.trigger("dialog:close");
											var newExoFicheView = exercices_view.children.findByModel(new_exofiche);
											if(newExoFicheView){
												newExoFicheView.flash("success");
											}
										}).fail(function(response){
											alert("An unprocessed error happened. Please try again!");
										});
									} else {
										alert("An unprocessed error happened. Please try again!");
									}
								});

								app.regions.getRegion('dialog').show(addExerciceView);
							});
						});

						layout.getRegion('contentRegion').show(view);
						layout.getRegion('panelRegion').show(panel);
					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
					}
				});
			});
		},

		showUserfiches: function(id){
			// Vue pour les userfiches de la fiche
			var layout = new Layout();
			var tabs = new TabsPanel({panel:2});

			tabs.on("tab:devoir", function(){
				app.trigger("devoir:show",id);
			});

			tabs.on("tab:exercices", function(){
				app.trigger("devoir:showExercices",id);
			});

			tabs.on("tab:eleves", function(){
				app.trigger("devoir:addUserfiche",id);
			});

			tabs.on("tab:exams", function(){
				app.trigger("devoir:exams",id);
			});

			var loadingView = new LoadingView({
				title: "Affichage des fiches élèves d'un devoir",
				message: "Chargement des données."
			});

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
				layout.getRegion('contentRegion').show(loadingView);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("prof:entities");
				$.when(fetchingData).done(function(fiches, userfiches, exofiches, faits){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						var view = new ElevesListView({ collection: userfiches, idFiche:fiche.get("id"), exofiches:exofiches, faits:faits});
						view.on("childview:note:delete", function(childView){
							childView.remove();
						});

						view.on("childview:note:activate", function(childView){
							var model=childView.model;
							model.set("actif", !model.get("actif"));
							var updatingItem = model.save();
							if (updatingItem) {
								$.when(updatingItem).done(function(){
									childView.render();
									childView.flash("success");
								}).fail(function(response){
									alert("Une erreur inconnue s'est produite. Réessayez !");
								});
							} else {
								childView.flash("danger");
								alert("Une erreur inconnue s'est produite. Réessayez !");
							}
						});


						layout.getRegion('contentRegion').show(view);
					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
					}
				});
			});
		},

		showAddUserfiche: function(id){
			// Vue pour l'ajout de fiches élèves
			var layout = new Layout();
			var tabs = new TabsPanel({panel:3});

			tabs.on("tab:devoir", function(){
				app.trigger("devoir:show",id);
			});

			tabs.on("tab:exercices", function(){
				app.trigger("devoir:showExercices",id);
			});

			tabs.on("tab:notes", function(){
				app.trigger("devoir:showUserfiches",id);
			});

			tabs.on("tab:exams", function(){
				app.trigger("devoir:exams",id);
			});

			var loadingView = new LoadingView({
				title: "Affichage des exercices d'un devoir",
				message: "Chargement des données."
			});

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
				layout.getRegion('contentRegion').show(loadingView);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager", "entities/users"], function(){
				var fetchingData = channel.request("prof:entities");
				$.when(fetchingData).done(function(fiches, userfiches, exofiches, faits){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						// Ici se cascade un deuxième chargement
						// Lancer les deux d'un coup peut poser des problèmes
						// d'erreur 403 quand les deux requtes sont trop proches sur le serveur
						var fetchingUsers = channel.request("users:entities");
						$.when(fetchingUsers).done(function(users){
							var view = new AddEleveView({
								collection: users,
								filterCriterion: "",
								idFiche: fiche.get("id"),
								userfiches: userfiches
							});

							view.on("item:add", function(childView){
								var model = childView.model;
								require(["entities/userfiche"], function(UserFiche){
									var new_userfiche = new UserFiche({
										idUser: model.get("id"),
										idFiche: fiche.get("id"),
										actif:true
									});
									console.log(new_userfiche);

									var savingItem = new_userfiche.save();
									if (savingItem){
										$.when(savingItem).done(function(){
											new_userfiche.set({nomUser:model.get("nom"), prenomUser:model.get("prenom")});
											userfiches.add(new_userfiche);
											childView.upDevoirCounter();
											childView.flash("success");

										}).fail(function(response){
											alert("An unprocessed error happened. Please try again!");
										});
									} else {
										alert("An unprocessed error happened. Please try again!");
									}

								});
							});

							var panel = new AddElevePanel({filterCriterion:""});
							panel.on("users:filter", function(filterCriterion){
								view.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false });
							});

							layout.getRegion('contentRegion').show(view);
							layout.getRegion('panelRegion').show(panel);
						});


					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
					}
				});
			});



		}



	});

	return new Controller();
});
