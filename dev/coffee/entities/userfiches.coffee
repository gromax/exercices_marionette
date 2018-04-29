define ["entities/userfiche"], (Item) ->

	ItemsCollection = Backbone.Collection.extend {
		url: "api/assosUF"
		model: Item

		getNumberForEachUser: () ->
			@models.reduce (output, item) ->
				id = item.get "idUser"
				if output[id]
					output[id]++
				else
					output[id] = 1
				output
			, {}
	}

	ItemsCollection
