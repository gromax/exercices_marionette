define(["jst","marionette"], function(JST,Marionette){
	var Layout = Marionette.View.extend({
		template: window.JST["common/list-layout"],
		regions: {
			panelRegion: "#panel-region",
			itemsRegion: "#items-region"
		}
	});

	return Layout;
});
