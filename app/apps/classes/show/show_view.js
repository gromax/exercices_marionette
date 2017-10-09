define(["jst","marionette"], function(JST,Marionette){
	var view = Marionette.View.extend({
		template: window.JST["classes/show/show-classe"],
		events: {
			"click a.js-edit": "editClicked",
		},

		editClicked: function(e){
			e.preventDefault();
			this.trigger("classe:edit", this.model);
		},

	});

	return view;
});
