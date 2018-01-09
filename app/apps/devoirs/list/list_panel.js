define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/list/devoir-list-panel"],

		triggers: {
			"click button.js-new": "devoir:new"
		},

	});

	return Panel;
});
