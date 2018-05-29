define ["jst","marionette", "mathjax"], (JST,Marionette, MathJax) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/run/exercice-list-none"]
		tagName: "a"
		className: "list-group-item"
	}

	Item = Marionette.View.extend {
		tagName: "a"
		className: "list-group-item list-group-item-action"
		getTemplate: ->
			if @options.profMode is true
				window.JST["devoirs/run/exercice-list-item-prof"]
			else
				window.JST["devoirs/run/exercice-list-item-eleve"]

		initialize: (options)->
			this.faits = _.where(options.faits, {aEF: options.model.get("id")})

		serializeData: ->
			data = _.clone(@model.attributes)
			data.actif = @options.actif
			data.note = @model.calcNote(@faits)
			data.n_faits = @faits.length
			data.numero = @options.numero
			data.showFaitsButton = @options.showFaitsButton
			data

		onRender: ->
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]])

		triggers: {
			"click": "exofiche:run"
			"click a.js-faits": "exofiche:saved-list:show"
		}
	}

	Liste = Marionette.CollectionView.extend {
		className:"list-group"
		emptyView: noView
		childView: Item

		initialize: (options) ->
			@userfiche = options.userfiche
			@faits = _.where(options.faits.toJSON(), {aUF:@userfiche.get("id")})
			@idFiche = @userfiche.get("idFiche")

		filter: (child, index, collection) ->
			# On affiche que les exofiches qui ont sont dans la bonne fiche
			child.get("idFiche") is @idFiche

		childViewOptions: (model, index) ->
			return {
				actif: @userfiche.get("actif")
				faits: @faits
				numero: index+1
				profMode: @options.profMode is true
				showFaitsButton: @options.showFaitsButton is true # bouton élève pour accéder aux exercices faits
			}
	}

	return Liste
