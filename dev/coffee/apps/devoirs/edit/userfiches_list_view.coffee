define ["jst","marionette"], (JST,Marionette) ->
	noView = Marionette.View.extend {
		template:  window.JST["devoirs/edit/userfiche-none"]
		tagName: "tr"
		className: "alert"
	}

	Item = Marionette.View.extend {
		tagName: "tr"
		template: window.JST["devoirs/edit/userfiche-item"]

		initialize: (options) ->
			this.faits = _.where(options.faits, {aUF: options.model.get("id")})
			this.exofiches = options.exofiches.where({idFiche: options.model.get("idFiche")})

		serializeData: () ->
			data = _.clone(this.model.attributes)
			note = @model.calcNote(@exofiches, @faits, @options.notation)
			@model.set("_note",note)
			data.note = String(note)
			if data.note.length is 1
				data.note = "0#{data.note}"
			return data

		triggers: {
			"click button.js-delete": "note:delete"
			"click button.js-actif": "note:activate"
			"click": "note:show"
		}

		flash: (cssClass) ->
			$view = @$el
			toFct = ()-> $view.toggleClass("list-group-item-#{cssClass}")
			$view.hide().toggleClass("list-group-item-"+cssClass).fadeIn(800, () ->
				setTimeout( toFct, 500)
			)

		remove: () ->
			self = @
			@$el.fadeOut( ()->
				self.model.destroy()
				Marionette.View.prototype.remove.call(self)
			)
	}

	CollectionView = Marionette.CollectionView.extend {
		tagName:'tbody'
		childView:Item
		emptyView:noView

		childViewOptions: (model, index) ->
			return {
				exofiches: @options.exofiches
				faits: @options.faits
				notation: @options.notation
			}

		filter: (child, index, collection) ->
			# On affiche que les userfiches qui ont sont dans la bonne fiche
			return child.get("idFiche") is @options.idFiche

	}

	Liste = Marionette.View.extend {
		tagName: "table"
		className:"table table-hover"
		template: window.JST["devoirs/edit/userfiches-list"]
		regions:{
			body:{
				el:'tbody'
				replaceElement:true
			}
		}

		triggers:{
			"click a.js-sort":"sort"
		}

		onSort: (view,e) ->
			name = $(e.currentTarget).attr("name")
			if name is "nomCompletUser"
				# celui ci est alphabétique
				if @collection.comparatorAttr is "nomCompletUser"
					@collection.comparatorAttr = "inv_nomCompletUser"
					@collection.comparator = (a,b)->
						if a.get("nomCompletUser").toUpperCase()>b.get("nomCompletUser").toUpperCase()
							-1
						else
							1
				else
					@collection.comparatorAttr = "nomCompletUser"
					@collection.comparator = (a,b)->
						if a.get("nomCompletUser").toUpperCase()>b.get("nomCompletUser").toUpperCase()
							1
						else
							-1
				@collection.sort()

			else if name
				# dans ce cas, c'est note ou id, donc numérique
				if @collection.comparatorAttr is name
					@collection.comparatorAttr = "inv"+name
					@collection.comparator = (a,b) ->
						if a.get(name) > b.get(name)
							return -1
						else
							return 1
				else
					@collection.comparatorAttr = name
					@collection.comparator=name
				@collection.sort()

		onRender: () ->
			@subCollectionView = new CollectionView {
				collection: @collection
				exofiches: @options.exofiches
				faits: @options.faits.toJSON()
				notation: @options.notation
				idFiche: @options.idFiche
			}

			@listenTo(this.subCollectionView,"childview:note:delete", @deleteItem)
			@listenTo(this.subCollectionView,"childview:note:activate", @activateItem)
			@listenTo(this.subCollectionView,"childview:note:show", @showItem)
			@showChildView('body', @subCollectionView)

		showItem: (childView) ->
			@trigger("note:show",childView)

		deleteItem: (childView) ->
			@trigger("note:delete",childView)

		activateItem: (childView) ->
			@trigger("note:activate",childView)

	}

	return Liste
