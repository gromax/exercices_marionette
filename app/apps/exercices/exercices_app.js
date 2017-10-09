define(["marionette","app"], function(Marionette,app){

	var API = {
		list: function(){
			require(["apps/exercices/list/list_controller"], function(listController){
				listController.list();
			});
		}
	};

	app.on("exercices:list", function(){
		app.navigate("exercices");
		API.list();
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"exercices": "list",
		}
	});

	new Router();

	return ;
});
