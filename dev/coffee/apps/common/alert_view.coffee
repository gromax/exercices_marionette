define ["jst","marionette","spin.jquery"], (JST,Marionette) ->
	AlertView = Marionette.View.extend {
		tag:"div"
		template: window.JST["common/alert-view"]
		className: ->
			return "alert alert-"+(@options.type or "danger")

		initialize: (options) ->
			options = options ? {};
			@title = options.title ? "Erreur !"
			@message = options.message ? "Erreur inconnue. Reessayez !"
			@type = options.type ? "danger"

		serializeData: ->
			return {
				title: @title
				message: @message
				dismiss: @options.dismiss is true
				type: @type
			}

	}

	return AlertView
