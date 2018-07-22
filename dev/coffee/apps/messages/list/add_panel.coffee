define ["jst","marionette", "backbone.syphon"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["messages/list/add-panel"]

		closedMode: true
		className: "alert alert-warning"

		triggers: {
			"click button.js-new": "user:new"
		}

		triggers: {
			"click button.js-add": "message:toggle"
			"click button.js-cancel": "message:toggle"
			"click button.js-submit": "message:submit:click"
		}

		onMessageToggle: ->
			@closedMode = not @closedMode
			@render()

		onMessageSubmitClick: (view)->
			data = Backbone.Syphon.serialize(this)
			@trigger("message:send", this, data)

		serializeData: ->
			{
				closedMode: @closedMode
			}

		onFormDataInvalid: (errors)->
			console.log errors
			$view = @$el
			clearFormErrors = ()->
				$form = $view.find("form")
				$form.find(".help-inline.text-danger").each( ()->
					$(this).remove()
				)
				$form.find(".form-group.has-error").each( ()->
					$(this).removeClass("has-error")
				)

			markErrors = (value, key) ->
				$controlGroup = $view.find("#message-#{key}").closest(".form-group")
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

	return Panel
