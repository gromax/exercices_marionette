define ["app", "jst", "marionette"], (app, JST, Marionette) ->
	Panel = Marionette.View.extend {
		template: (data)->
			if app.Auth.isAdmin()
				window.JST["devoirs/list/devoir-list-panel-admin"](data)
			else
				window.JST["devoirs/list/devoir-list-panel-prof"](data)

		serializeData: ->
			{
				showInactifs: this.options.showInactifs is true
			}

		triggers: {
			"click button.js-new": "devoir:new"
			"click button.js-inactive-filter": "devoir:toggle:showInactifs"
		}
	}

	return Panel;
