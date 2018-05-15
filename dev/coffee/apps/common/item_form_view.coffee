define ["jst","marionette", "backbone.syphon"], (JST,Marionette) ->
	View = Marionette.View.extend {
		itemMarkup:"item"
		events: {
			"click button.js-submit": "submitClicked"
		}

		submitClicked: (e)->
			e.preventDefault()
			data = Backbone.Syphon.serialize(this)
			@trigger("form:submit", data)

		onFormDataInvalid: (errors)->
			$view = @$el
			clearFormErrors = ()->
				$form = $view.find("form")
				$form.find(".help-inline.text-danger").each( ()->
					$(this).remove()
				)
				$form.find(".form-group.has-error").each( ()->
					$(this).removeClass("has-error")
				)

			itemMarkup = @itemMarkup
			markErrors = (value, key) ->
				$controlGroup = $view.find("##{itemMarkup}-#{key}").closest(".form-group")
				$controlGroup.addClass("has-error")
				if $.isArray(value)
					value.forEach( (el)->
						$errorEl = $("<span>", { class: "help-inline text-danger", text: el })
						$controlGroup.append($errorEl)
					)
				else
					$errorEl = $("<span>", { class: "help-inline text-danger", text: value })
					$controlGroup.append($errorEl)

			clearFormErrors()
			_.each(errors, markErrors)

	}

	return View
