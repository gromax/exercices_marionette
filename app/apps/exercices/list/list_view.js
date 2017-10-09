define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["exercices/list/exercice-list-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: "list-group-item",
		template: window.JST["exercices/list/exercice-list-item"],
	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,
	});

	return Liste;
});
