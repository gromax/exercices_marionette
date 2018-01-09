define(["marionette","app","jst"], function(Marionette,app,JST){
	var notFoundView = Marionette.View.extend({
		template: window.JST["home/show/not-found"],
	});

	return notFoundView;
});
