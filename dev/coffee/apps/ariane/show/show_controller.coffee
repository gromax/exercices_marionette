define ["app","apps/ariane/show/show_view"], (app, ArianeView) ->
	Controller = {
		showAriane: ->
			if app.Ariane
				view = new ArianeView { collection: app.Ariane.collection }
				app.regions.getRegion('ariane').show(view)
			else
				console.log "L'objet fil d'ariane n'est pas initialisé."
	}

	return Controller
