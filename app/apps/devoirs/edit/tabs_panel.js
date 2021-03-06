define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/edit/tabs-panel"],

		triggers: {
			"click a.js-devoir": "tab:devoir",
			"click a.js-exercices": "tab:exercices",
			"click a.js-notes": "tab:notes",
			"click a.js-eleves": "tab:eleves",
			"click a.js-exams": "tab:exams",
		},

		serializeData:function(){
			return { panel:this.options.panel };
		},

		setPanel:function(panel){
			this.options.panel = panel;
			this.render();
		},

	});

	return Panel;
});
