define(["marionette","app"], function(Marionette,app){
	var Router = Marionette.AppRouter.extend({
		appRoutes: {
			"home" : "showHome",
			"login" : "showLogin"
		}
	});

	var API = {
		showHome: function(){
			require(["apps/home/show/show_controller"], function(showController){
				showController.showHome();
			});
		},

		showLogin: function(){
			if (app.Auth.get("logged_in")) {
				require(["apps/home/show/show_controller"], function(showController){
					showController.showHome();
				});
			} else {
				require(["apps/home/login/login_controller"], function(loginController){
					loginController.showLogin();
				});
			}
		},

		logout: function(){
			if (app.Auth.get("logged_in")) {
				var closingSession = app.Auth.destroy();
				console.log("destroy command launch");
				$.when(closingSession).done(function(response){
					// En cas d'échec de connexion, l'api server renvoie une erreur
					// Le delete n'occasione pas de raffraichissement des données
					// Il faut donc le faire manuellement
					app.Auth.refresh(response.logged);
					require(["apps/home/show/show_controller"], function(showController){
						showController.showHome();
					});
				}).fail(function(response){
					alert("An unprocessed error happened. Please try again!");
				});
			}
		}
	};

	app.on("home:show", function(){
		app.navigate("home");
		API.showHome();
	});

	app.on("home:login", function(){
		app.navigate("login");
		API.showLogin();
	});

	app.on("home:logout", function(){
		API.logout();
		app.trigger("home:show");
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"home" : "showHome",
			"login" : "showLogin"
		}
	});

	var router = new Router();

	return ;
});
