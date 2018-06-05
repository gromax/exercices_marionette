define ["marionette","app","jst", "backbone.syphon"], (Marionette,app,JST) ->
	Panel = Marionette.View.extend {
		className:"card"
		template: window.JST["home/login/home-login"]

		events: {
			"click button.js-submit": "submitClicked"
			"click button.js-forgotten": "forgottenClicked"
		}

		initialize: ->
			@title = @options.title ? "Connexion";

		onRender: ->
			if @options.generateTitle
				$title = $("<div>", { text: "Connexion", class:"card-header"})
				@$el.prepend($title)

		serializeData: ->
			{ showForgotten: @options.showForgotten }

		submitClicked: (e)->
			e.preventDefault()
			data = Backbone.Syphon.serialize(@)
			@trigger("form:submit", data)

		forgottenClicked: (e)->
			e.preventDefault()
			data = Backbone.Syphon.serialize(@)
			@trigger("login:forgotten", data.identifiant)

		onFormDataInvalid: (errors)->
			$view = @$el
			clearFormErrors = () ->
				$form = $view.find("form")
				$form.find("div.alert").each( ()->
					$(this).remove()
				)

			$container = $view.find("#messages")
			markErrors = (value)->
				$errorEl
				if value.success
					$errorEl = $("<div>", { class: "alert alert-success", role:"alert", text: value.message })
				else
					$errorEl = $("<div>", { class: "alert alert-danger", role:"alert", text: value.message })
				$container.append($errorEl)

			clearFormErrors()
			_.each(errors, markErrors)
	}

	return Panel
