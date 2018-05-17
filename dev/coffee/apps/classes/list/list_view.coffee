define ["jst","marionette"], (JST,Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["classes/list/classe-list-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: window.JST["classes/list/classe-list-item"]
		triggers: {
			"click td a.js-edit": "item:edit"
			"click button.js-delete": "item:delete"
			"click": "item:show"
		}

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
		tagName:'tbody'
		childView:Item
		emptyView:noView
	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: window.JST["classes/list/classe-list"]
		regions:{
			body:{
				el:'tbody'
				replaceElement:true
			}
		}

		onRender: ->
			@subCollection = new CollectionView {
				collection:@collection
			}
			@listenTo(@subCollection,"childview:item:show", @showItem);
			@listenTo(@subCollection,"childview:item:edit", @editItem);
			@listenTo(@subCollection,"childview:item:delete", @deleteItem);
			@showChildView('body', @subCollection);

		showItem: (childView)->
			@trigger("item:show",childView)

		editItem: (childView)->
			@trigger("item:edit",childView)

		deleteItem: (childView)->
			@trigger("item:delete",childView)

		flash: (itemModel)->
			newItemView = @subCollection.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView
				newItemView.flash("success")
	}

	return Liste
