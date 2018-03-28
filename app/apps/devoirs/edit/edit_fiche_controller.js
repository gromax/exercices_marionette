define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/devoirs/edit/edit_fiche_layout",
	"apps/devoirs/edit/tabs_panel",
	"apps/devoirs/edit/edit_fiche_view",
	"apps/common/missing_item_view",
	"apps/devoirs/edit/exofiches_list_view",
	"apps/devoirs/edit/exofiches_panel",
	"apps/exercices/list/list_view",
	"apps/devoirs/edit/userfiches_list_view",
	"apps/devoirs/edit/add_userfiches_list_view",
	"apps/devoirs/edit/add_userfiches_panel",
	"apps/devoirs/edit/exam_list_view",
	"apps/devoirs/edit/exam_panel",
	"apps/devoirs/edit/exam_form_view"
], function(
	app,
	Marionette,
	AlertView,
	Layout,
	TabsPanel,
	ShowView,
	MissingView,
	ExercicesListView,
	ExercicesPanel,
	AddExerciceView,
	ElevesListView,
	AddEleveView,
	AddElevePanel,
	ExamListView,
	ExamPanel,
	EditExamView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		show: function(id){
			// vue des paramètres du devoir lui même
			app.trigger("header:loading", true);
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

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches"]);
				$.when(fetchingData).done(function(fiches){
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
								app.trigger("header:loading", true);
								$.when(updatingItem).done(function(){
									view.goToShow();
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau !");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
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

		showExercices: function(id){
			// Vue pour les exercices de la fiche
			app.trigger("header:loading", true);
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

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches", "exofiches"]);
				$.when(fetchingData).done(function(fiches, exofiches){
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
								app.trigger("header:loading", true);
								$.when(updatingItem).done(function(){
									childView.goToShow();
								}).fail(function(response){
									if(response.status == 422){
										childView.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau !");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
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
										app.trigger("header:loading", true);
										$.when(savingItem).done(function(){
											exofiches.add(new_exofiche);
											addExerciceView.trigger("dialog:close");
											var newExoFicheView = exercices_view.children.findByModel(new_exofiche);
											if(newExoFicheView){
												newExoFicheView.flash("success");
											}
										}).fail(function(response){
											if(response.status == 401){
												alert("Vous devez vous (re)connecter !");
												addExerciceView.trigger("dialog:close");
												app.trigger("home:logout");
											} else {
												alert("Erreur inconnue. Essayez à nouveau !");
											}
										}).always(function(){
											app.trigger("header:loading", false);
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

		showUserfiches: function(id){
			// Vue pour les userfiches de la fiche
			app.trigger("header:loading", true);
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

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(fiches, userfiches, exofiches, faits){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						var view = new ElevesListView({ collection: userfiches, idFiche:fiche.get("id"), exofiches:exofiches, faits:faits});
						view.on("note:delete", function(childview){
							childview.remove();
						});

						view.on("note:activate", function(childview){
							var model=childview.model;
							model.set("actif", !model.get("actif"));
							var updatingItem = model.save();
							if (updatingItem) {
								app.trigger("header:loading", true);
								$.when(updatingItem).done(function(){
									childview.render();
									childview.flash("success");
								}).fail(function(response){
									if(response.status == 401){
										alert("Vous devez vous (re)connecter !");
										app.trigger("home:logout");
									} else {
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							} else {
								childview.flash("danger");
								alert("Une erreur inconnue s'est produite. Réessayez !");
							}
						});

						view.on("note:show", function(childview){
							var model = childview.model;
							app.trigger("devoirs:fiche-eleve:show",model.get("id"));
						});


						layout.getRegion('contentRegion').show(view);
					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
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

		showAddUserfiche: function(id){
			// Vue pour l'ajout de fiches élèves
			app.trigger("header:loading", true);
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

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "users"]);
				$.when(fetchingData).done(function(fiches, userfiches, users){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
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

								var savingItem = new_userfiche.save();
								if (savingItem){
									app.trigger("header:loading", true);
									$.when(savingItem).done(function(){
										new_userfiche.set({nomUser:model.get("nom"), prenomUser:model.get("prenom")});
										userfiches.add(new_userfiche);
										childView.upDevoirCounter();
										childView.flash("success");

									}).fail(function(response){
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau !");
										}
									}).always(function(){
										app.trigger("header:loading", false);
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
					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
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

		showExams: function(id){
			app.trigger("header:loading", true);
			var layout = new Layout();
			var tabs = new TabsPanel({panel:4});

			tabs.on("tab:devoir", function(){
				app.trigger("devoir:show",id);
			});

			tabs.on("tab:exercices", function(){
				app.trigger("devoir:showExercices",id);
			});

			tabs.on("tab:notes", function(){
				app.trigger("devoir:showUserfiches",id);
			});

			tabs.on("tab:eleves", function(){
				app.trigger("devoir:addUserfiche",id);
			});

			layout.on("render", function(){
				layout.getRegion('tabsRegion').show(tabs);
			});

			app.regions.getRegion('main').show(layout);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches", "exams"]);
				$.when(fetchingData).done(function(fiches, exams){
					var fiche = fiches.get(id);
					if(fiche !== undefined){
						var view = new ExamListView({ collection:exams, idFiche: id });

						view.on("item:delete", function(childView,e){
							childView.remove();
						});

						view.on("item:edit",function(childView){
							var model = childView.model;
							var edView = new EditExamView({
								model:model
							});

							edView.on("form:submit", function(data){
								var updatingExam = model.save(data);
								if(updatingExam){
									app.trigger("header:loading", true);
									$.when(updatingExam).done(function(){
										childView.render();
										edView.trigger("dialog:close");
										childView.flash("success");
									}).fail(function(response){
										if(response.status == 422){
											edView.triggerMethod("form:data:invalid", response.responseJSON.errors);
										} else {
											if(response.status == 401){
												alert("Vous devez vous (re)connecter !");
												app.trigger("home:logout");
											} else {
												alert("Erreur inconnue. Essayez à nouveau !");
											}
										}
									}).always(function(){
										app.trigger("header:loading", false);
									});
								} else {
									this.triggerMethod("form:data:invalid", model.validationError);
								}
							});

							app.regions.getRegion('dialog').show(edView);
						});

						view.on("item:lock", function(childView){
							var model = childView.model;
							var locked = model.get("locked");
							model.set("locked", !locked);
							var updatingExam = model.save();
							if (updatingExam) {
								app.trigger("header:loading", false);
								$.when(updatingExam).done(function(){
									childView.render();
									childView.flash("success");
								}).fail(function(response){
									if(response.status == 401){
										alert("Vous devez vous (re)connecter !");
										app.trigger("home:logout");
									} else {
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							} else {
								alert("Une erreur inconnue s'est produite. Réessayez !");
							}
						});

						view.on("item:show", function(childView){
							var model = childView.model;
							app.trigger("devoir:exam", model.get("id"));
						});

						var panel = new ExamPanel();
						panel.on("exam:new", function(){
							require(["entities/exam"], function(Exam){
								var fetchingNew = channel.request("new:exam:entity", id);
								app.trigger("header:loading", true);
								$.when(fetchingNew).done(function(newExamParams){
									var newExam = new Exam({ nom:"Tex", idFiche:id, data:newExamParams.data });
									var savingItem = newExam.save();

									$.when(savingItem).done(function(){
										exams.add(newExam);
									}).fail(function(response){
										alert("An unprocessed error happened. Please try again!");
									});

								}).fail(function(response){
									if (response.status == 401){
										alert("Vous devez vous (re)connecter !");
										app.trigger("home:logout");
									} else {
										if (_.isArray(response.messages)) {
											alert(response.messages.join("\n"));
										} else {
											alert("Une erreur inconnue s'est produite. Réessayez !");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							});
						});



						layout.getRegion('contentRegion').show(view);
						layout.getRegion('panelRegion').show(panel);
					} else {
						var view = new MissingView();
						layout.getRegion('contentRegion').show(view);
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
