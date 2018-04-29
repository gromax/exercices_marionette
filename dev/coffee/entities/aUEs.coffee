define ["entities/aUE"], (Item)->
	ItemsCollection = Backbone.Collection.extend {
		url: "api/notes"
		model: Item
	}
	return ItemsCollection
