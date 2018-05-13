define ["jst","marionette"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["devoirs/list/devoir-list-panel"]

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
