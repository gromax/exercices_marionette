define ["marionette","app","apps/header/show/show_view"], (Marionette,app, HeadersView) ->
	Controller = {
		showHeader: () ->
			if app.Auth
				navbar = new HeadersView() # Requiert le app.Auth
				app.regions.getRegion('header').show(navbar)
				navbar.listenTo(
					app.Auth,
					"change",
					()-> @logChange()
				)
				navbar.listenTo(app,"header:loading", navbar.spin)
			else
				console.log "Erreur : Objet session non défini !"
	}

	return Controller
