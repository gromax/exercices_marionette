define ["jst","apps/common/item_form_view"], (JST,FormView) ->
	view = FormView.extend {
		itemMarkup:"devoir",
		getTemplate: ->
			# editMode compte aussi pour un new
			if @options.editMode
				return window.JST["devoirs/edit/fiche-edit"]
			else
				return window.JST["devoirs/edit/fiche-show"]


		events: {
			"click a.js-edit": "editClicked"
			"click button.js-submit": "submitClicked"
		}

		editClicked: (e) ->
			e.preventDefault()
			@trigger("devoir:edit", @)

		initialize: ->
			# si editMode = false, c'est une showView, dans ce cas
			# on prépare le generateTitle pour le cas où on basculerait au editMode
			if not @options.editMode
				@options.generateTitle = true
			# title n'est utilisé que pour le cas d'un edit ou d'un new
			if @model.get("id")
				@title = "Modifier le devoir : "+ @model.get("nom")
			else
				@title = "Nouveau devoir"

		onRender: ->
			# Dans le template de edit, le title n'est pas inclus pour le cas
			# où on appelle le template dans un popup
			if @options.generateTitle and @options.editMode
				$title = $("<h1>", { text: this.title })
				@$el.prepend($title)

		goToEdit: ->
			@options.editMode = true
			@render()

		goToShow: ->
			@options.editMode = false
			@render()
	}

	return view
