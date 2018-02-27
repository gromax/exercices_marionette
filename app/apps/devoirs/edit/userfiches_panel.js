define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/edit/userfiches-panel"],

		triggers: {
			"click button.js-sort-notes": "sort:notes",
			"click button.js-sort-names": "sort:names"
		},

	});

	return Panel;
});
