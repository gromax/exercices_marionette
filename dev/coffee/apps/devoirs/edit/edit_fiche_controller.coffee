define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/devoirs/edit/edit_fiche_layout",
	"apps/common/list_layout",
	"apps/devoirs/edit/tabs_panel",
	"apps/devoirs/edit/edit_fiche_view",
	"apps/common/missing_item_view",
	"apps/devoirs/edit/exofiches_list_view",
	"apps/devoirs/edit/exofiches_panel",
	"apps/exercices/list/list_panel",
	"apps/exercices/list/list_view",
	"apps/devoirs/edit/userfiches_list_view",
	"apps/devoirs/edit/add_userfiches_list_view",
	"apps/devoirs/edit/add_userfiches_panel",
	"apps/devoirs/edit/exam_list_view",
	"apps/devoirs/edit/exam_panel",
	"apps/devoirs/edit/exam_form_view"
], (
	app,
	Marionette,
	AlertView,
	Layout,
	ListLayout,
	TabsPanel,
	ShowView,
	MissingView,
	ExercicesListView,
	ExercicesPanel,
	AddExercicePanel,
	AddExerciceView,
	ElevesListView,
	AddEleveView,
	AddElevePanel,
	ExamListView,
	ExamPanel,
	EditExamView
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities",
		show: (id) ->
			# vue des paramètres du devoir lui même
			app.trigger("header:loading", true)
			layout = new Layout()
			tabs = new TabsPanel {panel:0}

			tabs.on "tab:exercices", ()->
				app.trigger("devoir:showExercices",id)

			tabs.on "tab:notes", ()->
				app.trigger("devoir:showUserfiches",id)

			tabs.on "tab:eleves", ()->
				app.trigger("devoir:addUserfiche",id)

			tabs.on "tab:exams", ()->
				app.trigger("devoir:exams",id)

			layout.on "render", ()->
				layout.getRegion('tabsRegion').show(tabs)

			app.regions.getRegion('main').show(layout)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches"])
				$.when(fetchingData).done( (fiches)->
					fiche = fiches.get(id)
					if fiche isnt  undefined
						view = new ShowView {
							model: fiche
							editMode: false
						}

						view.on "devoir:edit", (view) ->
							view.goToEdit()

						view.on "form:submit", (data) ->
							updatingItem = fiche.save(data)
							if updatingItem
								app.trigger("header:loading", true)
								$.when(updatingItem).done( () ->
									view.goToShow()
								).fail( (response) ->
									if response.status is 422
										view.triggerMethod("form:data:invalid", response.responseJSON.errors)
									else
										if response.status is 401
											alert("Vous devez vous (re)connecter !")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/004]")
								).always( () ->
									app.trigger("header:loading", false)
								)
							else
								view.triggerMethod("form:data:invalid", fiche.validationError)

						layout.getRegion('contentRegion').show(view)
					else
						view = new MissingView()
						layout.getRegion('contentRegion').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false)
				)

		showExercices: (id) ->
			# Vue pour les exercices de la fiche
			app.trigger("header:loading", true)
			layout = new Layout()
			tabs = new TabsPanel {panel:1}

			tabs.on "tab:devoir", () ->
				app.trigger("devoir:show",id)

			tabs.on "tab:notes", () ->
				app.trigger("devoir:showUserfiches",id)

			tabs.on "tab:eleves", () ->
				app.trigger("devoir:addUserfiche",id)

			tabs.on "tab:exams", () ->
				app.trigger("devoir:exams",id)

			layout.on "render", () ->
				layout.getRegion('tabsRegion').show(tabs)

			app.regions.getRegion('main').show(layout)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches", "exofiches"])
				$.when(fetchingData).done( (fiches, exofiches) ->
					fiche = fiches.get(id)
					if fiche isnt undefined
						view = new ExercicesListView { collection:exofiches, idFiche:fiche.get("id") }
						view.on "childview:exercice:delete", (childView) ->
							childView.remove()

						view.on "childview:exercice:edit", (childView) ->
							childView.goToEdit()

						view.on "childview:exercice:cancel", (childView) ->
							childView.goToShow()

						view.on "childview:exercice:test", (childView) ->
							model = childView.model
							app.trigger("exercice-fiche:run", model.get("id"))

						view.on "childview:form:submit", (childView, data) ->
							model = childView.model
							updatingItem = model.save(data)
							if updatingItem
								app.trigger("header:loading", true)
								$.when(updatingItem).done( () ->
									childView.goToShow()
								).fail( (response) ->
									if response.status is 422
										childView.triggerMethod("form:data:invalid", response.responseJSON.errors)
									else
										if response.status is 401
											alert("Vous devez vous (re)connecter !")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/005]")
								).always( () ->
									app.trigger("header:loading", false)
								)
							else
								childView.triggerMethod("form:data:invalid", fiche.validationError)

						panel = new ExercicesPanel()
						panel.on "exercice:new", () ->
							require ["entities/exofiche", "entities/exercices"], (ExoFiche) ->
								collection = channel.request("exercices:entities")

								# debug : réutiliser la vue de l'autre appli n'est peut être pas idéal
								addExerciceView = new AddExerciceView {
									collection: collection
									filterCriterion : ""
								}
								addExerciceLayout = new ListLayout()
								addExercicePanel = new AddExercicePanel { filterCriterion:"" }

								addExerciceView.on "childview:exercice:show", (childView, args) ->
									model = childView.model
									new_exofiche = new ExoFiche({ idFiche:fiche.get("id") , idE:model.get("id") }, { parse:true})
									savingItem = new_exofiche.save()
									if savingItem
										app.trigger("header:loading", true)
										$.when(savingItem).done( () ->
											exofiches.add(new_exofiche)
											addExerciceLayout.trigger("dialog:close")
											newExoFicheView = view.children.findByModel(new_exofiche)
											if newExoFicheView
												newExoFicheView.flash("success")
										).fail( (response) ->
											if response.status is 401
												alert("Vous devez vous (re)connecter !")
												addExerciceView.trigger("dialog:close")
												app.trigger("home:logout")
											else
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/006]")
										).always( () ->
											app.trigger("header:loading", false)
										)
									else
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/007]")

								addExercicePanel.on "exercices:filter", (filterCriterion) ->
									addExerciceView.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false })

								addExerciceLayout.on "render", () ->
									addExerciceLayout.getRegion('panelRegion').show(addExercicePanel)
									addExerciceLayout.getRegion('itemsRegion').show(addExerciceView)

								app.regions.getRegion('dialog').show(addExerciceLayout)

						layout.getRegion('contentRegion').show(view)
						layout.getRegion('panelRegion').show(panel)
					else
						view = new MissingView()
						layout.getRegion('contentRegion').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false)
				)

		showUserfiches: (id) ->
			# Vue pour les userfiches de la fiche
			app.trigger("header:loading", true)
			layout = new Layout()
			tabs = new TabsPanel {panel:2}

			tabs.on "tab:devoir", () ->
				app.trigger("devoir:show",id)

			tabs.on "tab:exercices", () ->
				app.trigger("devoir:showExercices",id)

			tabs.on "tab:eleves", () ->
				app.trigger("devoir:addUserfiche",id)

			tabs.on "tab:exams", () ->
				app.trigger("devoir:exams",id)

			layout.on "render", () ->
				layout.getRegion('tabsRegion').show(tabs)

			app.regions.getRegion('main').show(layout)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (fiches, userfiches, exofiches, faits) ->
					fiche = fiches.get(id)
					if fiche isnt undefined
						view = new ElevesListView { collection: userfiches, idFiche:fiche.get("id"), exofiches:exofiches, faits:faits}
						view.on "note:delete", (childview) ->
							childview.remove()

						view.on "note:activate", (childview) ->
							model=childview.model
							model.set("actif", !model.get("actif"))
							updatingItem = model.save()
							if updatingItem
								app.trigger("header:loading", true)
								$.when(updatingItem).done( () ->
									childview.render()
									childview.flash("success")
								).fail( (response) ->
									if response.status is 401
										alert("Vous devez vous (re)connecter !")
										app.trigger("home:logout")
									else
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/008]")
								).always( () ->
									app.trigger("header:loading", false)
								)
							else
								childview.flash("danger")
								alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/009]")

						view.on "note:show", (childview) ->
							model = childview.model
							app.trigger("devoirs:fiche-eleve:show",model.get("id"))

						layout.getRegion('contentRegion').show(view)
					else
						view = new MissingView()
						layout.getRegion('contentRegion').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false)
				)

		showAddUserfiche: (id) ->
			# Vue pour l'ajout de fiches élèves
			app.trigger("header:loading", true)
			layout = new Layout()
			tabs = new TabsPanel {panel:3}

			tabs.on "tab:devoir", () ->
				app.trigger("devoir:show",id)

			tabs.on "tab:exercices", () ->
				app.trigger("devoir:showExercices",id)

			tabs.on "tab:notes", () ->
				app.trigger("devoir:showUserfiches",id)

			tabs.on "tab:exams", () ->
				app.trigger("devoir:exams",id)

			layout.on "render", () ->
				layout.getRegion('tabsRegion').show(tabs)

			app.regions.getRegion('main').show(layout)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "users"])
				$.when(fetchingData).done( (fiches, userfiches, users) ->
					fiche = fiches.get(id)
					if fiche isnt undefined
						view = new AddEleveView {
							collection: users
							filterCriterion: ""
							idFiche: fiche.get("id")
							userfiches: userfiches
						}

						view.on "item:add", (childView) ->
							model = childView.model
							require ["entities/userfiche"], (UserFiche) ->
								new_userfiche = new UserFiche {
									idUser: model.get("id")
									idFiche: fiche.get("id")
									actif:true
								}

								savingItem = new_userfiche.save()
								if savingItem
									app.trigger("header:loading", true)
									$.when(savingItem).done( () ->
										new_userfiche.set {nomUser:model.get("nom"), prenomUser:model.get("prenom")}
										userfiches.add(new_userfiche)
										childView.upDevoirCounter()
										childView.flash("success")
									).fail( (response) ->
										if response.status is 401
											alert("Vous devez vous (re)connecter !")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/010]")
									).always( () ->
										app.trigger("header:loading", false)
									)
								else
									alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/011]")

						panel = new AddElevePanel {filterCriterion:""}
						panel.on "users:filter", (filterCriterion) ->
							view.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false })

						layout.getRegion('contentRegion').show(view)
						layout.getRegion('panelRegion').show(panel)
					else
						view = new MissingView()
						layout.getRegion('contentRegion').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false)
				)

		showExams: (id) ->
			app.trigger("header:loading", true)
			layout = new Layout()
			tabs = new TabsPanel {panel:4}

			tabs.on "tab:devoir", () ->
				app.trigger("devoir:show",id)

			tabs.on "tab:exercices", () ->
				app.trigger("devoir:showExercices",id)

			tabs.on "tab:notes", () ->
				app.trigger("devoir:showUserfiches",id)

			tabs.on "tab:eleves", () ->
				app.trigger("devoir:addUserfiche",id)

			layout.on "render", () ->
				layout.getRegion('tabsRegion').show(tabs)

			app.regions.getRegion('main').show(layout)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches", "exams"])
				$.when(fetchingData).done( (fiches, exams) ->
					fiche = fiches.get(id)
					if fiche isnt undefined
						view = new ExamListView { collection:exams, idFiche: id }
						view.on "item:delete", (childView,e) ->
							childView.remove()

						view.on "item:edit", (childView) ->
							model = childView.model
							edView = new EditExamView {
								model:model
							}

							edView.on "form:submit", (data) ->
								updatingExam = model.save(data)
								if updatingExam
									app.trigger("header:loading", true)
									$.when(updatingExam).done( () ->
										childView.render()
										edView.trigger("dialog:close")
										childView.flash("success")
									).fail( (response) ->
										if response.status is 422
											edView.triggerMethod("form:data:invalid", response.responseJSON.errors)
										else
											if response.status is 401
												alert("Vous devez vous (re)connecter !")
												app.trigger("home:logout")
											else
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/012]")
									).always( () ->
										app.trigger("header:loading", false)
									)
								else
									@triggerMethod("form:data:invalid", model.validationError)
							app.regions.getRegion('dialog').show(edView)

						view.on "item:lock", (childView) ->
							model = childView.model
							locked = model.get("locked")
							model.set("locked", !locked)
							updatingExam = model.save()
							if updatingExam
								app.trigger("header:loading", false)
								$.when(updatingExam).done( () ->
									childView.render()
									childView.flash("success")
								).fail( (response) ->
									if response.status is 401
										alert("Vous devez vous (re)connecter !")
										app.trigger("home:logout")
									else
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/013]")
								).always( () ->
									app.trigger("header:loading", false)
								)
							else
								alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/014]")

						view.on "item:show", (childView) ->
							model = childView.model
							app.trigger("devoir:exam", model.get("id"))

						panel = new ExamPanel()
						panel.on "exam:new", () ->
							require ["entities/exam"], (Exam) ->
								fetchingNew = channel.request("new:exam:entity", id)
								app.trigger("header:loading", true)
								$.when(fetchingNew).done( (newExamParams) ->
									newExam = new Exam { nom:"Tex", idFiche:id, data:newExamParams.data }
									savingItem = newExam.save()

									$.when(savingItem).done( () ->
										exams.add(newExam)
									).fail( (response) ->
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/015]")
									)
								).fail( (response) ->
									if response.status is 401
										alert("Vous devez vous (re)connecter !")
										app.trigger("home:logout")
									else
										if _.isArray(response.messages)
											alert(response.messages.join("\n"))
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/016]")
								).always( () ->
									app.trigger("header:loading", false)
								)

						layout.getRegion('contentRegion').show(view)
						layout.getRegion('panelRegion').show(panel)
					else
						view = new MissingView()
						layout.getRegion('contentRegion').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false)
				)
	}

	return new Controller()
