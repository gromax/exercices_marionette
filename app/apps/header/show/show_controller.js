define(["marionette","app","apps/header/show/show_view"], function(Marionette,app, HeadersView){
	var Controller = {
		showHeader: function(){
			if (app.Auth) {
				var navbar = new HeadersView(); // Requiert le app.Auth
				app.regions.getRegion('header').show(navbar);
				navbar.listenTo(app.Auth,"change",function(){
					this.logChange();
				});
			} else {
				console.log("Erreur : Objet session non défini !");
			}
		}
	};

	return Controller;
});
