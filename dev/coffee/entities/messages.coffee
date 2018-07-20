define ["entities/message"], (Item) ->
	ItemsCollection = Backbone.Collection.extend {
		url: "api/messages"
		model: Item
		comparator: "date"
	}

	return ItemsCollection
