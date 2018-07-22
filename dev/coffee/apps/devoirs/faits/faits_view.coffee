define ["jst","marionette"], (JST,Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/faits/faits-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: window.JST["devoirs/faits/faits-list-item"]
		triggers: {
			"click button.js-delete": "item:delete"
			"click": "item:show"
		}

		serializeData: ->
			data = _.clone(this.model.attributes)
			data.showDeleteButton = this.options.showDeleteButton
			data

		flash: (cssClass) ->
			$view = this.$el
			toFunc = () ->
				$view.toggleClass("table-"+cssClass)
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, () ->
				setTimeout( toFunc, 500 )
			)

		remove: ->
			self = this
			this.$el.fadeOut( () ->
				#self.model.destroy()
				Marionette.View.prototype.remove.call(self)
			)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView

		initialize: (options) ->
			if typeof options.filter is 'function'
				@filter = @options.filter

		childViewOptions: (model, index) ->
			{
				showDeleteButton: this.options.showDeleteButton
			}
	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: window.JST["devoirs/faits/faits-list"]
		regions:{
			body:{
				el:'tbody'
				replaceElement:true
			}
		}

		onRender: ->
			@subCollection = new CollectionView {
				collection:this.collection
				filter:this.options.filter
				showDeleteButton: this.options.showDeleteButton is true
			}
			@listenTo @subCollection, "childview:item:show", @showItem
			@listenTo @subCollection, "childview:item:delete", @deleteItem
			@showChildView 'body', @subCollection

		serializeData: ->
			{
				showDeleteButton: @options.showDeleteButton
			}

		showItem: (childView) ->
			@trigger "item:show", childView

		deleteItem: (childView) ->
			@trigger "item:delete",childView

		flash: (itemModel) ->
			newItemView = @subCollection.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView
				newItemView.flash("success")
	}

	return Liste
