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
			data.showExoLink = @options.showExoLink
			data


	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'ul'
		className:'list-group'
		childView:Item
		emptyView:noView

		initialize: () ->
			@options = @options ? {}
			unless @options.aUE?
				@options.aUE = false

		filter: (child, index, collection) ->
			criterion = @filterCriterion
			if (@options.aUE is false) or (@options.aUE is child.get("aUE"))
				return true
			return false

		childViewOptions: (model, index) ->
			return {
				showExoLink: @options.aUE is false
			}
	}

	return CollectionView
