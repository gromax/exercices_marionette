define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/show/tabs-panel"],

		triggers: {
			"click a.js-devoir": "tab:devoir",
			"click a.js-exercices": "tab:exercices",
			"click a.js-notes": "tab:notes",
			"click a.js-eleves": "tab:eleves",
			"click a.js-exams": "tab:exams",
		},

		serializeData(){
			return { panel:this.options.panel };
		},

		setPanel(panel){
			this.options.panel = panel;
			this.render();
		},

	});

	return Panel;
});
