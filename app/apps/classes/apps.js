define(["marionette","app"], function(Marionette,app){

	var API = {
		classesList: function(){
			if (app.Auth.isProf()||app.Auth.isAdmin()){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/list/list_controller"], function(Controller){
					Controller.list();
				});
			} else {
				app.trigger("notFound");
			}
		},

		classeShow: function(id){
			if (app.Auth.isProf()||app.Auth.isAdmin()){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/show/show_controller"], function(Controller){
					Controller.show(id);
				});
			} else {
				app.trigger("notFound");
			}
		},

		classeEdit: function(id){
			if (app.Auth.isProf()||app.Auth.isAdmin()){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/edit/edit_controller"], function(Controller){
					Controller.edit(id);
				});
			} else {
				app.trigger("notFound");
			}
		},
	};

	app.on("classes:list", function(){
		app.navigate("classes");
		API.classesList();
	});

	app.on("classe:show", function(id){
		app.navigate("classe:" + id);
		API.classeShow(id);
	});

	app.on("classe:edit", function(id){
		app.navigate("classe:" + id + "/edit");
		API.classeEdit(id);
	});


// Router

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"classes": "classesList",
			"classe::id": "classeShow",
			"classe::id/edit": "classeEdit",
		}
	});

	new Router();

	return ;
});
