define ["app"], (app) ->
	API = {
		showHeader: () ->
			require ["apps/header/show/show_controller"], (showController) -> showController.showHeader()
	}

	app.on "header:show", ()-> API.showHeader()
