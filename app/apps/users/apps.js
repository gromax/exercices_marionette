define(["marionette","app"], function(Marionette,app){

	var API = {
		listUsers: function(criterion){
			var auth = app.Auth;
			if (auth.isAdmin()||auth.isProf()){
				app.Ariane.reset([{ text:"Utilisateurs", e:"users:list", link:"users"}]);
				require(["apps/users/list/list_controller"], function(listController){
					listController.listUsers(criterion);
				});
			} else {
				app.trigger("notFound");
			}
		},

		showUser: function(id){
			var auth = app.Auth;
			if (auth.isAdmin()||auth.isProf()){
				app.Ariane.reset([{ text:"Utilisateurs", e:"users:list", link:"users"}]);
				require(["apps/users/show/show_controller"], function(showController){
					showController.showUser(id, false);
				});
			} else if(auth.get("id") == id) {
				app.Ariane.reset([]);
				require(["apps/users/show/show_controller"], function(showController){
					showController.showUser(id, true);
				});
			} else {
				app.trigger("notFound");
			}
		},

		editUser: function(id){
			var auth = app.Auth;
			if (auth.isAdmin()||auth.isProf()){
				app.Ariane.reset([{ text:"Utilisateurs", e:"users:list", link:"users"}]);
				require(["apps/users/edit/edit_controller"], function(editController){
					editController.editUser(id, false);
				});
			} else if(auth.get("id") == id) {
				app.Ariane.reset([]);
				require(["apps/users/edit/edit_controller"], function(editController){
					editController.editUser(id, true);
				});
			} else {
				app.trigger("notFound");
			}
		},

		editUserPwd: function(id){
			var auth = app.Auth;
			if (auth.isAdmin()||auth.isProf()){
				app.Ariane.reset([{ text:"Utilisateurs", e:"users:list", link:"users"}]);
				require(["apps/users/edit/edit_controller"], function(editController){
					editController.editUserPwd(id, false);
				});
			} else if(auth.get("id") == id) {
				app.Ariane.reset([]);
				require(["apps/users/edit/edit_controller"], function(editController){
					editController.editUserPwd(id, true);
				});
			} else {
				app.trigger("notFound");
			}
		},
	};

	app.on("users:list", function(){
		app.navigate("users");
		API.listUsers();
	});

	app.on("users:filter", function(criterion){
		if(criterion){
			app.navigate("users/filter/criterion:" + criterion);
		}
		else{
			app.navigate("users");
		}
	});

	app.on("user:show", function(id){
		app.navigate("user:" + id);
		API.showUser(id);
	});

	app.on("user:edit", function(id){
		app.navigate("user:" + id + "/edit");
		API.editUser(id);
	});

	app.on("user:editPwd", function(id){
		app.navigate("user:" + id + "/password");
		API.editUserPwd(id);
	});

// Router

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"users(/filter/criterion::criterion)": "listUsers",
			"users": "listUsers",
			"user::id": "showUser",
			"user::id/edit": "editUser",
			"user::id/password": "editUserPwd",
		}
	});

	new Router();

	return ;
});
