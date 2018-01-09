define(["entities/aUE"], function(Item){

	var ItemsCollection = Backbone.Collection.extend({
		url: "api/notes",
		model: Item,
	});


	return ItemsCollection;
});
