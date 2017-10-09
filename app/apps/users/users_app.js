define(["marionette","app"], function(Marionette,app){

	var API = {
		listUsers: function(criterion){
			require(["apps/users/list/list_controller"], function(listController){
				listController.listUsers(criterion);
			});
		},

		showUser: function(id){
			require(["apps/users/show/show_controller"], function(showController){
				showController.showUser(id);
			});
		},

		editUser: function(id){
			require(["apps/users/edit/edit_controller"], function(editController){
				editController.editUser(id);
			});
		},

		editUserPwd: function(id){
			require(["apps/users/edit/edit_controller"], function(editController){
				editController.editUserPwd(id);
			});
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
