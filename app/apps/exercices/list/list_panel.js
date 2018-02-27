define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["exercices/list/exercice-list-panel"],

		events: {
			"submit #filter-form": "filterExercices"
		},

		ui: {
			criterion: "input.js-filter-criterion"
		},

		serializeData:function(){
			return {
				filterCriterion: this.options.filterCriterion || "",
			}
		},

		filterExercices: function(e){
			e.preventDefault();
			var criterion = this.$(".js-filter-criterion").val();
			this.trigger("exercices:filter", criterion);
		},

		onSetFilterCriterion: function(criterion){
			this.ui.criterion.val(criterion);
		}
	});

	return Panel;
});
