define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/devoirs/run/exercices_list_view",
	"apps/devoirs/run/devoir_panel",
	"apps/devoirs/run/note_panel",
	"apps/devoirs/run/run_layout",
], (
	app,
	Marionette,
	AlertView,
	MissingView,
	ExercicesListView,
	DevoirPanel,
	NotePanel,
	Layout
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities"
		showProf: (id) ->
			app.trigger("header:loading", true)
			channel = @getChannel()

			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "exofiches", "faits", "users"])
				$.when(fetchingData).done( (devoirs, userfiches, exofiches, faits, users) ->
					userfiche = userfiches.get(id)
					if userfiche isnt undefined
						idFiche = userfiche.get("idFiche")
						fiche = devoirs.get(idFiche)
						idUser = userfiche.get("idUser")
						user = users.get(idUser)

						app.Ariane.add [
							{ text:"Devoir ##{idFiche}", e:"devoir:show", data:idFiche, link:"devoir:#{idFiche}" },
							{ text:"Fiches élèves", e:"devoir:showUserfiches", data:idFiche, link:"devoir:#{idFiche}/fiches-eleves"},
							{ text: user.get("nomComplet")+" #"+id },
						]

						layout = new Layout()
						devoirPanel = new DevoirPanel({ model: fiche, profMode:true })
						notePanel = new NotePanel({ model: userfiche, exofiches:exofiches, faits:faits, notation:fiche.get("notation") })
						view = new ExercicesListView({ collection: exofiches, userfiche:userfiche, faits:faits, profMode:true, notation:fiche.get("notation") })

						view.on "childview:exofiche:run", (childview) ->
							model = childview.model
							app.trigger("devoirs:fiche-eleve:faits", id, model.get("id"))


						layout.on "render", () ->
							layout.getRegion('devoirRegion').show(devoirPanel)
							layout.getRegion('exercicesRegion').show(view)
							layout.getRegion('noteRegion').show(notePanel)

						app.regions.getRegion('main').show(layout)

					else
						view = new MissingView()
						app.regions.getRegion('main').show(view)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

		showEleve: (id) ->
			app.trigger("header:loading", true)
			channel = @getChannel()

			require ["entities/dataManager"], ()->
				fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (userfiches, exofiches, faits) ->
					userfiche = userfiches.get(id)
					if userfiche isnt undefined
						# On envoie toute la collection partant du principe que seule les exofiches de userfiche seront affichés
						app.Ariane.add { text:userfiche.get("nomFiche") }

						layout = new Layout()
						devoirPanel = new DevoirPanel({ model: userfiche })
						notePanel = new NotePanel({ model: userfiche, exofiches:exofiches, faits:faits, notation: userfiche.get("notation") })
						view = new ExercicesListView({ collection: exofiches, userfiche:userfiche, faits:faits, showFaitsButton:true, notation: userfiche.get("notation")})

						view.on "childview:exofiche:run", (childview) ->
							model = childview.model
							app.trigger("exercice-fiche:run", model.get("id"), id)

						view.on "childview:exofiche:saved-list:show", (childview) ->
							model = childview.model
							app.trigger("userfiche:exofiche:faits", id, model.get("id"))

						layout.on "render", () ->
							layout.getRegion('devoirRegion').show(devoirPanel)
							layout.getRegion('exercicesRegion').show(view)
							layout.getRegion('noteRegion').show(notePanel)

						app.regions.getRegion('main').show(layout)
					else
						view = new MissingView()
						app.regions.getRegion('main').show(view)
				).fail( (response)->
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
