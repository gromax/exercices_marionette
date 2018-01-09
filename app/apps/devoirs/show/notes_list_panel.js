define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/show/notes-list-panel"],

		triggers: {
			"click button.js-new": "notes:new"
		},

	});

	return Panel;
});
