define(["marionette","app","jst"], function(Marionette,app,JST){
	var AdminPanel = Marionette.View.extend({
		template: window.JST["home/show/home-admin"],
		triggers: { //bug : ça ne semble pas fonctionner
			"click a.js-users": "users:list",
			"click a.js-classes": "classes:list",
			"click a.js-exercices": "exercices:list",
			"click a.js-devoirs": "devoirs:list",
		},

		onUsersList: function(e){
			app.trigger("users:list");
		},

		onClassesList: function(e){
			app.trigger("classes:list");
		},

		onExercicesList: function(e){
			app.trigger("exercices:list");
		},

		onDevoirsList: function(e){
			app.trigger("devoirs:list");
		},
	});

	return AdminPanel;
});
