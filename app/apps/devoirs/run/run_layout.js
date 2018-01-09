define(["jst","marionette"], function(JST,Marionette){
	var Layout = Marionette.View.extend({
		template: window.JST["devoirs/run/run-layout"],
		regions: {
			devoirRegion: "#devoir-params-region",
			exercicesRegion: "#exercices-region",
			noteRegion: "#note-region",
		}
	});

	return Layout;
});
