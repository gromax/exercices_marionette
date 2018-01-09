define(["entities/devoir"], function(Item){
	var ItemsCollection = Backbone.Collection.extend({
		url: "api/devoirs",
		model: Item,
		comparator: "nom"
	});

	return ItemsCollection;
});
