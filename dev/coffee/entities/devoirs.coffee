define ["entities/devoir"], (Item)->
	ItemsCollection = Backbone.Collection.extend {
		url: "api/devoirs"
		model: Item
		comparator: "nom"
	}

	return ItemsCollection
