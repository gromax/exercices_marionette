define(["marionette","app"], function(Marionette,app){

	var API = {
		showHome: function(){
			app.Ariane.reset([]);
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
				app.Ariane.reset([{text:"Connexion", link:"login", e:"home:login"}]);
				require(["apps/home/login/login_controller"], function(loginController){
					loginController.showLogin();
				});
			}
		},

		showSignin: function(){
			if (app.Auth.get("logged_in")) {
				this.notFound();
			} else {
				app.Ariane.reset([{text:"Inscription", link:"rejoindre-une-classe", e:"home:signin"}]);
				require(["apps/home/signin/signin_controller"], function(signinController){
					signinController.showSignin();
				});
			}
		},

		logout: function(){
			if (app.Auth.get("logged_in")) {
				var closingSession = app.Auth.destroy();
				$.when(closingSession).done(function(response){
					// En cas d'échec de connexion, l'api server renvoie une erreur
					// Le delete n'occasione pas de raffraichissement des données
					// Il faut donc le faire manuellement
					app.Auth.refresh(response.logged);
					require(["apps/home/show/show_controller"], function(showController){
						showController.showHome();
					});
				}).fail(function(response){
					alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/024]");
				});
			}
		},

		forgotten: function(key){
			if (app.Auth.get("logged_in")) {
				app.trigger("notFound");
			} else {
				app.Ariane.reset([{text:"Réinitialisation de mot de passe"}]);
				app.trigger("header:loading", true);
				require(["apps/home/show/show_controller"], function(showController){
					var fetching = app.Auth.getWithForgottenKey(key);
					$.when(fetching).done(function(){
						showController.showLogOnForgottenKey(true);
					}).fail(function(response){
						if (response.status==401) {
							showController.showLogOnForgottenKey(false);
						} else {
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/034]");
						}
					}).always(function(){
						app.trigger("header:loading", false);
					});

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

	app.on("home:signin", function(){
		app.navigate("rejoindre-une-classe");
		API.showSignin();
	});

	app.on("home:logout", function(){
		API.logout();
		app.trigger("home:show");
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"" : "showHome",
			"home" : "showHome",
			"login" : "showLogin",
			"logout" : "logout",
			"rejoindre-une-classe": "showSignin",
			"forgotten::key": "forgotten"
		}
	});

	new Router();

	return ;
});
