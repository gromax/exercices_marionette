define ["jst","marionette"], (JST,Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/edit/add-userfiche-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: window.JST["devoirs/edit/add-userfiche-item"]
		triggers: {
			"click button.js-addDevoir": "item:add"
		}

		serializeData: ->
			data = _.clone(this.model.attributes)
			data.devoirCounter = this.options.devoirCounter
			data

		upDevoirCounter: ->
			@options.devoirCounter++

		flash: (cssClass) ->
			@render() # pour mettre à jour le compteur
			$view = this.$el
			toFunc = () -> $view.toggleClass("table-"+cssClass)
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, ()->
				setTimeout(toFunc, 500)
			)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView
		filterCriterion:null

		initialize: ->
			if @options.filterCriterion
				@setFilterCriterion(@options.filterCriterion)

		childViewOptions: (model, index) ->
			{
				devoirCounter: _.where(this.options.userfiches, { idUser: model.get("id")}).length
			}

		setFilterCriterion: (filterCriterion) ->
			@filterCriterion = filterCriterion.toLowerCase()
			return @

		filter: (child, index, collection) ->
			criterion = @filterCriterion
			if not child.get("isEleve")
				return false
			if criterion is "" or criterion is null or child.get("prenom").toLowerCase().indexOf(criterion) isnt -1 or child.get("nom").toLowerCase().indexOf(criterion) isnt -1 or child.get("nomClasse").toLowerCase().indexOf(criterion) isnt -1
				return true
			return false;
	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: window.JST["devoirs/edit/add-userfiches-list"]
		regions: {
			body: {
				el:'tbody'
				replaceElement:true
			}
		}

		triggers:{
			"click a.js-sort":"sort"
		}

		onRender: ->
			@subCollectionView = new CollectionView {
				collection: @collection
				filterCriterion: @options.filterCriterion
				userfiches: _.where(@options.userfiches.toJSON(), {idFiche: @options.idFiche})
			}
			@listenTo(@subCollectionView,"childview:item:add", @addItem)
			@showChildView('body', @subCollectionView)

		onSort: (view,e) ->
			name = $(e.currentTarget).attr("name")
			if name
				if @collection.comparator is name
					@collection.comparator = (a,b) ->
						if a.get(name) > b.get(name)
							return -1
						else
							return 1
				else
					@collection.comparator = name
				@collection.sort()

		addItem: (childview) ->
			@trigger("item:add",childview)

		flash: (itemModel) ->
			newItemView = @subCollectionView.children.findByModel(itemModel)
			# check whether the new user view is displayed (it could be
			# invisible due to the current filter criterion)
			if newItemView
				newItemView.flash "success"

		onSetFilterCriterion: (criterion, options) ->
			@subCollectionView.setFilterCriterion(criterion)
			options = options ? {}
			if not options.preventRender
				@subCollectionView.render()
	}

	return Liste
