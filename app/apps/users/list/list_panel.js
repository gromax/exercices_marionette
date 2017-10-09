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

		filterUsers: function(e){
			e.preventDefault();
			var criterion = this.$(".js-filter-criterion").val();
			this.trigger("users:filter", criterion);
		},

		onSetFilterCriterion: function(criterion){
			this.ui.criterion.val(criterion);
		}
	});

	return Panel;
});
