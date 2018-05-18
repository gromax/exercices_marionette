define ["app", "jst","marionette"], (app, JST, Marionette)->
	noView = Marionette.View.extend {
		template:  window.JST["users/list/user-list-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: (data)->
			if app.Auth.isAdmin()
				window.JST["users/list/user-list-admin-item"](data)
			else
				window.JST["users/list/user-list-prof-item"](data)
		triggers: {
			"click td a.js-edit": "item:edit"
			"click td a.js-editPwd": "item:editPwd"
			"click button.js-delete": "item:delete"
			"click button.js-forgotten": "item:forgotten"
			"click": "item:show"
		}

		flash: (cssClass)->
			$view = @$el
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, ()->
				setTimeout( ()->
					$view.toggleClass("table-"+cssClass)
				, 500)
			)

		remove: ()->
			self = @
			@$el.fadeOut( ()->
				#self.model.destroy()
				self.trigger("model:destroy", @model)
				Marionette.View.prototype.remove.call(self)
			)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView
		filterCriterion:null

		initialize: ()->
			if @options.filterCriterion
				@setFilterCriterion(@options.filterCriterion)

		setFilterCriterion: (filterCriterion)->
			@filterCriterion = filterCriterion.toLowerCase()
			return @

		filter: (child, index, collection) ->
			criterion = @filterCriterion
			if criterion is "" or criterion is null or child.get("prenom").toLowerCase().indexOf(criterion) isnt -1 or child.get("nom").toLowerCase().indexOf(criterion) isnt -1 or child.get("nomClasse").toLowerCase().indexOf(criterion) isnt -1
				return true
			else
				return false
	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: (data)->
			if app.Auth.isAdmin()
				window.JST["users/list/user-list-admin"](data)
			else
				window.JST["users/list/user-list-prof"](data)
		regions:{
			body:{
				el:'tbody'
				replaceElement:true
			}
		}

		triggers:{
			"click a.js-sort":"sort"
		}

		onSort: (view,e)->
			name = $(e.currentTarget).attr("name")
			if name
				if @collection.comparator is name
					@collection.comparator = (a,b)->
						if a.get(name)>b.get(name)
							-1
						else
							1
				else
					@collection.comparator = name
				@collection.sort()

		onRender: ()->
			@subCollectionView = new CollectionView {
				collection:@collection
				filterCriterion:@options.filterCriterion
			}
			@listenTo(@subCollectionView,"childview:item:show", @showItem)
			@listenTo(@subCollectionView,"childview:item:edit", @editItem)
			@listenTo(@subCollectionView,"childview:item:editPwd", @editItemPwd)
			@listenTo(@subCollectionView,"childview:item:delete", @deleteItem)
			@listenTo(@subCollectionView,"childview:item:forgotten", @forgottenItem)
			@showChildView('body', @subCollectionView)

		showItem: (childView)->
			@trigger("item:show",childView)

		editItem: (childView)->
			@trigger("item:edit",childView)

		editItemPwd: (childView)->
			@trigger("item:editPwd",childView)

		deleteItem: (childView)->
			@trigger("item:delete",childView)

		forgottenItem: (childView)->
			@trigger("item:forgotten",childView)

		flash: (itemModel)->
			newItemView = @subCollectionView.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView then newItemView.flash("success")

		onSetFilterCriterion: (criterion, options)->
			@subCollectionView.setFilterCriterion(criterion)
			options = options or {}
			if not options.preventRender
				@subCollectionView.render()
	}

	return Liste
