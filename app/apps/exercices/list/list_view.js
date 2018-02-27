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

		triggers: {
			"click": "exercice:show"
		},

	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,

		initialize:function(){
			if (this.options.filterCriterion) {
				this.setFilterCriterion(this.options.filterCriterion);
			}
		},

		setFilterCriterion: function(filterCriterion, options){
			this.filterCriterion = filterCriterion.toLowerCase();
			return this;
		},

		onSetFilterCriterion:function(filterCriterion,options){
			this.setFilterCriterion(filterCriterion);
			options = options || {};
			if (!options.preventRender) {
				this.render();
			}
		},

		filter: function (child, index, collection) {
			var criterion = this.filterCriterion;
			if( (criterion=="")
				|| criterion == null
				|| child.get("title").toLowerCase().indexOf(criterion) !== -1
				|| child.get("description").toLowerCase().indexOf(criterion) !== -1
				|| child.get("keyWords").join(";").toLowerCase().indexOf(criterion) !== -1){
				return true;
			}
			return false;
		}
	});

	return Liste;
});
