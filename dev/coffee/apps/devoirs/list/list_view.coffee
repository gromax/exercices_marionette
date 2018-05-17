define ["app", "jst", "marionette"], (app, JST, Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/list/devoir-list-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: (data)->
			if app.Auth.isAdmin()
				window.JST["devoirs/list/devoir-list-admin-item"](data)
			else
				window.JST["devoirs/list/devoir-list-prof-item"](data)
		triggers: {
			"click button.js-delete": "item:delete"
			"click button.js-actif": "item:setActivity"
			"click button.js-visible": "item:setVisibility"
			"click": "item:show"
		}

		flash: (cssClass) ->
			$view = @$el
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, () ->
				setTimeout( ()->
					$view.toggleClass("table-"+cssClass)
				, 500)
			)

		remove: ->
			self = @
			@$el.fadeOut( ()->
				self.trigger("model:destroy", @model)
				Marionette.View.prototype.remove.call(self)
			)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView
	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: (data)->
			if app.Auth.isAdmin()
				window.JST["devoirs/list/devoir-list-admin"](data)
			else
				window.JST["devoirs/list/devoir-list-prof"](data)
		regions: {
			body: {
				el:'tbody'
				replaceElement:true
			}
		}

		triggers:{
			"click a.js-sort":"sort"
		}

		onSort: (view,e) ->
			name = $(e.currentTarget).attr("name")
			if name
				if @collection.comparator is name
					@collection.comparator = (a,b)->
						if a.get(name) > b.get(name)
							return -1
						else
							return 1
				else
					@collection.comparator=name
				@collection.sort();

		onRender: ->
			@subCollection = new CollectionView {
				collection: @collection
			}
			unless @options.showInactifs
				@subCollection.setFilter (child, index, collection) ->
					child.get('actif')
			@listenTo(@subCollection,"childview:item:show", @showItem)
			@listenTo(@subCollection,"childview:item:delete", @deleteItem)
			@listenTo(@subCollection,"childview:item:setVisibility", @setVisibility)
			@listenTo(@subCollection,"childview:item:setActivity", @setActivity)
			@showChildView('body', @subCollection)

		setShowInactifs: (showInactifs)->
			@options.showInactifs = showInactifs
			if showInactifs
				@subCollection.removeFilter()
			else
				@subCollection.setFilter (child, index, collection) ->
					child.get('actif')

		showItem: (childView) ->
			@trigger("item:show",childView)

		setVisibility: (childView)->
			@trigger("item:setAttribute",childView, "visible")

		setActivity: (childView) ->
			@trigger("item:setAttribute",childView, "actif")

		deleteItem: (childView) ->
			@trigger("item:delete",childView)

		flash: (itemModel)->
			newItemView = @subCollection.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView
				newItemView.flash("success")
	}

	return Liste
