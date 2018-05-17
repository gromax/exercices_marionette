define ["jst","marionette"], (JST,Marionette)->
	Panel = Marionette.View.extend {
		template: window.JST["classes/list/classe-list-panel"]

		triggers: {
			"click button.js-new": "classe:new"
		}
	}

	return Panel
