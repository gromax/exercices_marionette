define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["users/list/user-list-panel"],

		triggers: {
			"click button.js-new": "user:new"
		},

		events: {
			"submit #filter-form": "filterUsers"
		},

		ui: {
			criterion: "input.js-filter-criterion"
		},

		serializeData:function(){
			if (this.options.filterCriterion) {
				return { filterCriterion:this.options.filterCriterion };
			} else {
				return {};
			}
		},

		filterUsers: function(e){
			e.preventDefault();
			var criterion = this.$(".js-filter-criterion").val();
			this.trigger("users:filter", criterion);
		},

		onSetFilterCriterion: function(criterion){
			console.log("lalal");
			console.log(criterion);
			this.ui.criterion.val(criterion);
		}
	});

	return Panel;
});
