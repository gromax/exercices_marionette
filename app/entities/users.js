define(["entities/user"], function(User){
	var UsersCollection = Backbone.Collection.extend({
		url: "api/users",
		model: User,
		comparator: "nomComplet",
	});

	return UsersCollection;
});
