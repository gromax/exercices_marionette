define ["jst", "marionette", "mathjax"], (JST, Marionette, Mathjax) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/edit/exofiche-none"]
		tagName: "a"
		className: "list-group-item"
	}

	Item = Marionette.View.extend {
		tagName: "a",
		className: "list-group-item list-group-item-action"
		getTemplate: () ->
			if (@options.editMode)
				return window.JST["devoirs/edit/exofiche-item-edit"]
			else
				return window.JST["devoirs/edit/exofiche-item"]

		events:{
			"click button.js-submit": "submitClicked"
		}

		triggers: {
			"click button.js-edit": "exercice:edit"
			"click button.js-delete": "exercice:delete"
			"click button.js-cancel": "exercice:cancel"
			"click button.js-test" : "exercice:test"
		}

		flash: (cssClass) ->
			$view = this.$el;
			toFct = () -> $view.toggleClass("table-#{cssClass}")
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, () ->
				setTimeout(toFct, 500)
			)

		remove: ->
			self = @
			@$el.fadeOut( () ->
				self.model.destroy()
				Marionette.View.prototype.remove.call(self)
			)

		goToEdit: ->
			@options.editMode = true
			@render()

		goToShow: ->
			@options.editMode = false
			@render()

		submitClicked: (e) ->
			e.preventDefault()
			data = Backbone.Syphon.serialize(@)
			output = {}
			options = {}
			_.each(data, (value, key, list) ->
				if key.indexOf("option_") is 0
					new_key = key.substr(7)
					options[new_key] = value
				else
					output[key] = value
			)
			output.options = options
			@trigger("form:submit", @, output)

		onFormDataInvalid: (errors) ->
			# debug : à faire
			alert("erreur")
			console.log(errors)

		onRender: ->
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,@$el[0]])
	}

	Liste = Marionette.CollectionView.extend {
		className:"list-group"
		emptyView: noView
		childView: Item

		initialize: (options) ->
			@idFiche = options.idFiche

		filter: (child, index, collection) ->
			# On affiche que les exofiches qui ont sont dans la bonne fiche
			return child.get("idFiche") is @idFiche
	}

	return Liste
