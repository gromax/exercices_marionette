define(["marionette","app","jst"], function(Marionette,app,JST){
	var OffPanel = Marionette.View.extend({
		template: window.JST["home/show/home-off"],
		triggers: {
			"click a.js-login": "home:login"
		},
		onHomeLogin: function(e){
			app.trigger("home:login");
		}
	});

	return OffPanel;

});
