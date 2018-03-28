define(["marionette","app"], function(Marionette,app){

	var API = {
		classesList: function(){
			var auth = app.Auth;
			var forProf = function(){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/list/list_controller"], function(Controller){
					Controller.list();
				});
			}

			var todo = auth.mapItem({
				"Admin": forProf,
				"Prof": forProf,
				"Eleve": function(){ app.trigger("notFound"); },
				"def": function(){ app.trigger("home:login"); },
			});
			todo();
		},

		classeShow: function(id){
			var auth = app.Auth;
			var forProf = function(){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/show/show_controller"], function(Controller){
					Controller.show(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": forProf,
				"Prof": forProf,
				"Eleve": function(){ app.trigger("notFound"); },
				"def": function(){ app.trigger("home:login"); },
			});
			todo();
		},

		classeEdit: function(id){
			var forProf = function(){
				app.Ariane.reset([{ text:"Classes", e:"classes:list", link:"classes"}]);
				require(["apps/classes/edit/edit_controller"], function(Controller){
					Controller.edit(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": forProf,
				"Prof": forProf,
				"Eleve": function(){ app.trigger("notFound"); },
				"def": function(){ app.trigger("home:login"); },
			});
			todo();
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
