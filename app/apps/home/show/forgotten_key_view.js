define(["marionette","app","jst"], function(Marionette,app,JST){
	var Panel = Marionette.View.extend({
		template: window.JST["home/show/home-forgotten-key"],
		triggers: {
			"click a.js-reinit-mdp": "forgotten:reinitMDP:click"
		},
	});

	return Panel;

});
