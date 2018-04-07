define([
	"app",
	"marionette",
	"apps/home/login/login_view",
	"apps/common/alert_view"
], function(
	app,
	Marionette,
	LoginView,
	AlertView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		showLogin: function(){
			var that = this;
			var view = new LoginView();
			view.on("form:submit", function(data){
				var openingSession = app.Auth.save(data);
				if(openingSession){
					app.trigger("header:loading", true);
					$.when(openingSession).done(function(response){
						// En cas d'échec de connexion, l'api server renvoie une erreur
						app.trigger("home:show");
					}).fail(function(response){
						if(response.status == 422){
							view.triggerMethod("form:data:invalid", response.responseJSON.messages);
						}
						else{
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/025]");
						}
					}).always(function(){
						app.trigger("header:loading", false);
					});
				}
				else {
					view.triggerMethod("form:data:invalid", app.Auth.validationError);
				}
			});

			view.on("login:forgotten", function(email){
				// Vérification de l'email
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!re.test(email)){
					view.triggerMethod("form:data:invalid", [{ success:false, message: "L'email n'est pas valide"}]);
				} else {
					var channel = that.getChannel();
					app.trigger("header:loading", true);
					sendingMail = channel.request("forgotten:password", email);
					sendingMail.always(function(){
						app.trigger("header:loading", false);
					}).done(function(response){
						var aView = new AlertView({
							title:"Email envoyé",
							type:"success",
							message:"Un message a été envoyé à l'adresse "+email+". Veuillez vérifier dans votre boîte mail et cliquer sur le lien contenu dans le mail. [Cela peut prendre plusieurs minutes...]",
							dismiss:true
						});
						app.regions.getRegion('message').show(aView);

					}).fail(function(response){
						if(response.status == 404){
							var aView = new AlertView({
								title:"Utilisateur inconnu",
								type:"warning",
								message:"Aucun utilsateur avec cet email.",
								dismiss:true
							});
							app.regions.getRegion('message').show(aView);
						}
						else{
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/033]");
						}
					});
				}
			})

			app.regions.getRegion('main').show(view);
		}
	});

	return new Controller();
});
