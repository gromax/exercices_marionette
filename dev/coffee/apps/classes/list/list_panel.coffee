define ["app", "jst", "marionette"], (app, JST, Marionette)->
	Panel = Marionette.View.extend {
		template: ->
			if app.Auth.isAdmin()
				window.JST["classes/list/classe-list-panel-admin"]
			else
				window.JST["classes/list/classe-list-panel-prof"]

		triggers: {
			"click button.js-new": "classe:new"
		}
	}

	return Panel
