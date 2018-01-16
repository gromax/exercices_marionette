define(["app","apps/ariane/show/show_view"], function(app, ArianeView){
	var Controller = {
		showAriane: function(){
			if (app.Ariane) {
				var view = new ArianeView({ collection: app.Ariane.collection });
				app.regions.getRegion('ariane').show(view);
			} else {
				console.log("L'objet fil d'ariane n'est pas initialisé.")
			}
		}
	};

	return Controller;
});
