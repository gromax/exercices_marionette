define(["jst","marionette"], function(JST,Marionette){
	var Layout = Marionette.View.extend({
		template: window.JST["home/show/eleve-view-layout"],
		regions: {
			devoirsRegion: "#devoirs-region",
		}
	});

	return Layout;
});
