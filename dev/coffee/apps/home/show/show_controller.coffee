define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/home/show/admin_view",
	"apps/home/show/prof_view",
	"apps/home/show/off_view",
	"apps/common/not_found",
	"apps/home/show/devoirs_list_eleve_view",
	"apps/home/show/eleve_view_layout",
	"apps/home/show/unfinished_message",
	"apps/home/show/forgotten_key_view"
], (
	app,
	Marionette,
	AlertView,
	AdminView,
	ProfView,
	OffView,
	NotFound,
	ListEleveView,
	EleveViewLayout,
	UnfinishedView,
	ForgottenKeyView
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities"
		showHome: ->
			Auth = app.Auth
			rank = app.Auth.get('rank')
			switch rank
				when "Root"
					view = new AdminView()
					app.regions.getRegion('main').show(view)
				when "Admin"
					view = new AdminView()
					app.regions.getRegion('main').show(view)
				when "Prof"
					view = new ProfView()
					app.regions.getRegion('main').show(view)
				when "Élève"
					@showEleveHome()
				else
					view = new OffView()
					app.regions.getRegion('main').show(view)

		notFound: ->
			view = new NotFound()
			app.regions.getRegion('main').show(view)

		showEleveHome: ->
			app.trigger("header:loading", true)
			layout = new EleveViewLayout()

			channel = @getChannel()
			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (userfiches, exofiches, faits) ->
					listEleveView = new ListEleveView {
						collection: userfiches
						exofiches: exofiches
						faits: faits
					}

					listEleveView.on "childview:devoir:show", (childView) ->
						model = childView.model
						app.trigger("devoir:show", model.get("id"))

					unfinishedMessageView = null
					listeUnfinished = _.filter(
						faits.where({ finished: false }),
						(item) ->
							uf = userfiches.get(item.get("aUF"))
							if uf.get("actif") and uf.get("ficheActive")
								return true
							return false
					)

					n = listeUnfinished.length
					if n>0
						unfinishedMessageView = new UnfinishedView({ number:n })
						unfinishedMessageView.on "devoir:unfinished:show", () ->
							app.trigger("faits:unfinished")

					layout.on "render", ()->
						layout.getRegion('devoirsRegion').show(listEleveView)
						if unfinishedMessageView
							layout.getRegion('unfinishedRegion').show(unfinishedMessageView)
					app.regions.getRegion('main').show(layout)
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

		showLogOnForgottenKey: (success) ->
			if success
				view = new ForgottenKeyView()
				view.on "forgotten:reinitMDP:click", () ->
					app.trigger "user:editPwd", null
				app.regions.getRegion('main').show(view)
			else
				view = new AlertView { title:"Clé introuvable !", message:"L'adresse que vous avez saisie n'est pas valable."}
				app.regions.getRegion('main').show(view)

		casloginfailed:  ->
			view = new AlertView { title:"Échec de l'authentification !", message:"L'authentification par l'ENT a échoué."}
			app.regions.getRegion('main').show(view)
	}
	return new Controller()

