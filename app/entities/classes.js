define(["entities/classe"], function(Item){
	var ClassesCollection = Backbone.Collection.extend({
		url: "api/classes",
		model: Item,
		comparator: "nom"
	});

	return ClassesCollection;
});
