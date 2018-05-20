define ["app"], (app) ->
	API = {
		showAriane: ->
			require ["apps/ariane/show/show_controller"], (showController) ->
				showController.showAriane()
	}

	app.on "ariane:show", (data) ->
		API.showAriane()
