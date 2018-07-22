define [
	"app"
	"jst"
	"marionette"
	"mathjax"
], (app, JST, Marionette, MathJax) ->
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
			"click button.js-delete" : "message:delete"
			"click":"message:show"
		}

		initialize: ->
			@opened = @options.openWhenRead and @model.get("lu")

		className: ->
			if @model.get("idOwner") is app.Auth.get("id")
				# C'est l'utilisateur l'expéditeur
				"list-group-item list-group-item-success"
			else
				"list-group-item list-group-item-info"

		remove: ()->
			self = @
			@$el.fadeOut( ()->
				#self.model.destroy()
				self.trigger("model:destroy", @model)
				Marionette.View.prototype.remove.call(self)
			)

		open: ->
			if not @opened
				@opened = true
				@render()

		onRender: ->
			if @opened
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, @.$el[0]])

		serializeData: ->
			data = _.clone(@model.attributes)
			data.opened = @opened
			data.showExoLink = @options.showExoLink
			data.enableDelete = @options.idUser is data.idOwner
			data


	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'ul'
		className:'list-group'
		childView:Item
		emptyView:noView

		initialize: ->
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
				openWhenRead: @options.openWhenRead is true
				idUser: @options.idUser ? false
			}
	}

	return CollectionView
