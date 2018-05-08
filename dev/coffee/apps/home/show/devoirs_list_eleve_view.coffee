define ["jst","marionette"], (JST,Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["home/show/devoirs-list-eleve-none"]
		tagName: "a"
		className: "list-group-item"
	}

	Item = Marionette.View.extend {
		tagName: "a"
		className: ()->
			if not @model.get("actif") or @model.has("ficheActive") and not @model.get("ficheActive")
				"list-group-item list-group-item-danger"
			else
				"list-group-item"

		template: window.JST["home/show/devoirs-list-eleve-item"]

		initialize: (options)->
			@faits = _.where(options.faits, {aUF: options.model.get("id")});
			@exofiches = options.exofiches.where({idFiche: options.model.get("idFiche")});

		serializeData: ->
			data = _.clone(this.model.attributes)
			data.note = @model.calcNote(@exofiches, @faits);
			if (_.has(data,"ficheActive"))
				data.actif = data.actif && data.ficheActive
			return data

		triggers: {
			"click": "devoir:show"
		}
	}

	Liste = Marionette.CollectionView.extend {
		className:"list-group"
		emptyView: noView
		childView: Item

		initialize: (options) ->
			@exofiches = options.exofiches # le calcul de la note a besoin de la propriété calculNote du modèle exofiche
			@faits = options.faits.toJSON() # Le calcul de la note n'a pas besoin des propriétés de models

		childViewOptions: (model, index)-> { exofiches: @exofiches, faits: @faits }
	}

	return Liste
