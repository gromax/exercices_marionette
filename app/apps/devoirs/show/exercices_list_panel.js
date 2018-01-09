define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/show/exercices-list-panel"],

		triggers: {
			"click button.js-new": "exercice:new"
		},

	});

	return Panel;
});
