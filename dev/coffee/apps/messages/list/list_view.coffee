define ["app", "jst", "marionette"], (app, JST, Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["messages/list/list-none"]
		tagName: "li"
		className: "list-group-item list-group-item-warning"
	}

	Item = Marionette.View.extend {
		tagName: "li"
		template: window.JST["messages/list/list-item"]
		triggers: {
			"click a.js-show-exercice" : "exercice:show"
			"click":"message:show"
		}
		opened: false

		className: ->
			if @model.get("idOwner") is app.Auth.get("id")
				# C'est l'utilisateur l'expéditeur
				"list-group-item list-group-item-success"
			else
				"list-group-item list-group-item-info"

		serializeData: ->
			data = _.clone(@model.attributes)
			data.opened = @opened
			data

		flash: (cssClass) ->
			$view = @$el
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, ()->
				setTimeout( ()->
					$view.toggleClass("table-"+cssClass)
				, 500)
			)

		remove: ->
			self = @
			@$el.fadeOut ()->
				Marionette.View.prototype.remove.call(self)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'ul'
		className:'list-group'
		childView:Item
		emptyView:noView
	}

	return CollectionView
