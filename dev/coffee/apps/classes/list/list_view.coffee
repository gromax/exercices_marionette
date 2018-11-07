define ["app", "jst", "marionette"], (app, JST, Marionette) ->
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
			"click td a.js-fill": "item:fill"
			"click td a.js-classe-prof": "item:classe-prof"
			"click": "item:show"
		}

		flash: (cssClass) ->
			$view = @$el
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, ()->
				setTimeout( ()->
					$view.toggleClass("table-"+cssClass)
				, 500)
			)

		serializeData: ->
			data = _.clone(@model.attributes)
			data.showProfName = @options.showProfName
			data.linkProf = @options.showProfName and (@model.attributes.idOwner isnt app.Auth.get("id"))
			data.showFillClassButton = @options.showFillClassButton
			data

		remove: ->
			self = @
			@$el.fadeOut ()->
				Marionette.View.prototype.remove.call(self)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView
		childViewOptions: (model)->
			{
				showFillClassButton: @options.showFillClassButton
				showProfName: @options.showProfName
			}
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

		serializeData: ->
			{
				showProfName: @options.showProfName
			}

		onRender: ->
			params = {
				collection:@collection
				showProfName:@options.showProfName
				showFillClassButton:@options.showFillClassButton
			}
			if @options.filterFct isnt false
				params.filter = @options.filterFct

			@subCollection = new CollectionView params
			@listenTo(@subCollection,"childview:item:show", @showItem)
			@listenTo(@subCollection,"childview:item:fill", @fillItem)
			@listenTo(@subCollection,"childview:item:edit", @editItem)
			@listenTo(@subCollection,"childview:item:delete", @deleteItem)
			@listenTo(@subCollection,"childview:item:classe-prof", @classeProfItem)
			@showChildView('body', @subCollection)

		showItem: (childView)->
			@trigger("item:show",childView)

		editItem: (childView)->
			@trigger("item:edit",childView)

		fillItem: (childView)->
			@trigger("item:fill",childView)

		deleteItem: (childView)->
			@trigger("item:delete",childView)

		classeProfItem:(childView)->
			app.trigger("classes:prof",childView.model.get("idOwner"))

		flash: (itemModel)->
			newItemView = @subCollection.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView
				newItemView.flash("success")
	}

	return Liste
