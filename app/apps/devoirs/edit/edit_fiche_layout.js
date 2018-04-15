define(["jst","marionette"], function(JST,Marionette){
	var Layout = Marionette.View.extend({
		template: window.JST["devoirs/edit/edit-fiche-layout"],
		regions: {
			tabsRegion: "#tabs-region",
			contentRegion: "#content-region",
			panelRegion: "#panel-region",
		}
	});

	return Layout;
});