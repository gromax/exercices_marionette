define ["entities/classe"], (Item)->
	ClassesCollection = Backbone.Collection.extend {
		url: "api/classes"
		model: Item
		comparator: "nom"
	}

	return ClassesCollection
