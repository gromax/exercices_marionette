define(["marionette","app"], function(Marionette,app){

	var API = {
		list: function(){
			require(["apps/classes/list/list_controller"], function(Controller){
				Controller.list();
			});
		},

		show: function(id){
			require(["apps/classes/show/show_controller"], function(Controller){
				Controller.show(id);
			});
		},

		edit: function(id){
			require(["apps/classes/edit/edit_controller"], function(Controller){
				Controller.edit(id);
			});
		},

	};

	app.on("classes:list", function(){
		app.navigate("classes");
		API.list();
	});

	app.on("classe:show", function(id){
		app.navigate("classe:" + id);
		API.show(id);
	});

	app.on("classe:edit", function(id){
		app.navigate("classe:" + id + "/edit");
		API.edit(id);
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"classes": "list",
			"classe::id": "show",
			"classe::id/edit": "edit",
		}
	});

	new Router();

	return ;
});
