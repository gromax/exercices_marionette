define(["marionette","app"], function(Marionette,app){

	var API = {
		list: function(){
			require(["apps/exercices/list/list_controller"], function(listController){
				listController.list();
			});
		},

		show: function(id){
			require(["apps/exercices/show/show_controller"], function(showController){
				showController.show(id);
			});
		}
	};

	app.on("exercices:list", function(){
		app.navigate("exercices");
		API.list();
	});

	app.on("exercice:show", function(id){
		app.navigate("exercice:" + id);
		API.show(id);
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"exercices": "list",
			"exercice::id": "show",
		}
	});

	new Router();

	return ;
});
