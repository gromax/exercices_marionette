define(["marionette","app"], function(Marionette,app){

	var API = {
		// route par défaut
		notFound: function(){
			app.Ariane.reset([{text:"Page introuvable", e:"notFound", link:"erreur-404"}]);
			require(["apps/home/show/show_controller"], function(showController){
				showController.notFound();
			});
		}
	};

	app.on("notFound", function(){
		API.notFound();
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			'*notFound' : 'notFound'
		}
	});

	new Router();

	return ;
});
