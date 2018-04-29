define ["entities/user"], (User)->
	UsersCollection = Backbone.Collection.extend {
		url: "api/users"
		model: User
		comparator: "nomComplet"
	}

	return UsersCollection;
