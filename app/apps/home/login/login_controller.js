define(["app","apps/home/login/login_view"], function(app, LoginView){
	var Controller = {
		showLogin: function(){
			var view = new LoginView();
			view.on("form:submit", function(data){
				var openingSession = app.Auth.save(data);
				if(openingSession){
					$.when(openingSession).done(function(response){
						// En cas d'échec de connexion, l'api server renvoie une erreur
						app.trigger("home:show");
					}).fail(function(response){
						if(response.status == 422){
							view.triggerMethod("form:data:invalid", response.responseJSON.messages);
						}
						else{
							alert("An unprocessed error happened. Please try again!");
						}
					});
				}
				else {
					view.triggerMethod("form:data:invalid", app.Auth.validationError);
				}
			});

			app.regions.getRegion('main').show(view);
		}
	};

	return Controller;
});
