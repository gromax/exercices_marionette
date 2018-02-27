define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/edit/exam-panel"],

		triggers: {
			"click button.js-new": "exam:new"
		},

	});

	return Panel;
});
