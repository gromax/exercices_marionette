define ["backbone.radio","entities/exercices/exercices_catalog"], (Radio, Catalog) ->
	# Un item exercice light, juste pour apparaître dans une liste
	Item = Backbone.Model.extend {
		defaults: {
			title: "Titre de l'exercice",
			description: "Description de l'exercice",
			keywords: ""
		},
	}

	ItemsCollection = Backbone.Collection.extend({
		model: Item,
	});

	API =
		getEntities: () ->
			itemsData = Catalog.all()
			collection = new ItemsCollection itemsData
			return collection

	channel = Radio.channel 'exercices'
	channel.reply 'exercices:entities', API.getEntities

	return
