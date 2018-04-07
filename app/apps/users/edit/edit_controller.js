define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/users/edit/edit_view",
	"apps/users/edit/editpwd_view"
], function(
	app,
	Marionette,
	AlertView,
	MissingView,
	EditView,
	EditPwdView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",

		editUser: function(id, isMe){
			app.trigger("header:loading", true);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				if (isMe) {
					var fetchingUser = channel.request("user:me");
				} else {
					var fetchingUser = channel.request("user:entity", id);
				}
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){

						if (isMe) {
							app.Ariane.add([
								{ text:"Mon compte", e:"user:show", data:user.get("id"), link:"user:"+user.get("id") },
								{ text:"Modification", e:"user:edit", data:user.get("id"), link:"user:"+user.get("id")+"/edit" }
							]);
						} else {
							app.Ariane.add([
								{ text:user.get("nomComplet"), e:"user:show", data:user.get("id"), link:"user:"+user.get("id") },
								{ text:"Modification", e:"user:edit", data:user.get("id"), link:"user:"+user.get("id")+"/edit" }
							]);
						}

						view = new EditView({
							model: user,
							generateTitle: true
						});

						view.on("form:submit", function(data){
							app.trigger("header:loading", true);
							var updatingUser = user.save(data);
							if(updatingUser){
								$.when(updatingUser).done(function(){
									app.trigger("user:show", user.get("id"));
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if (response.status == 401){
											alert("Vous devez vous (re)connecter !");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/028]");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							}
							else {
								view.triggerMethod("form:data:invalid", user.validationError);
							}
						});
					}
					else
					{

						if (isMe) {
							app.Ariane.add([
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification", e:"user:edit", data:id, link:"user:"+id+"/edit" }
							]);
						} else {
							app.Ariane.add([
								{ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification", e:"user:edit", data:id, link:"user:"+id+"/edit" }
							]);
						}

						view = new EditView({
							model: user,
							generateTitle: true
						});

						view = new MissingView({message:"Cet utilisateur n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		},
		editUserPwd: function(id, isMe){
			app.trigger("header:loading", true);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				if (isMe) {
					var fetchingUser = channel.request("user:me");
				} else {
					var fetchingUser = channel.request("user:entity", id);
				}
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){
						if (isMe){
							app.Ariane.add([
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]);
						} else {
							app.Ariane.add([
								{ text:user.get("nomComplet"), e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]);
						}

						view = new EditPwdView({
							model: user,
							generateTitle: true
						});

						view.on("form:submit", function(data){
							if (data.pwd!==data.pwdConfirm){
								view.triggerMethod("form:data:invalid", { pwdConfirm:"Les mots de passe sont différents."});
							} else {
								app.trigger("header:loading", true);
								var updatingUser = user.save(_.omit(data,"pwdConfirm"));
								if(updatingUser){
									$.when(updatingUser).done(function(){
										// Là il faudrait enlever le pwd de user
										app.trigger("user:show", user.get("id"));
									}).fail(function(response){
										if(response.status == 422){
											view.triggerMethod("form:data:invalid", response.responseJSON.errors);
										} else {
											if(response.status == 401){
												alert("Vous devez vous (re)connecter !");
												app.trigger("home:logout");
											} else {
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/029]");
											}
										}
									}).always(function(){
										app.trigger("header:loading", false);
									});
								} else {
									view.triggerMethod("form:data:invalid", user.validationError);
								}
							}


						});
					}
					else
					{
						if (isMe){
							app.Ariane.add([
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]);
						} else {
							app.Ariane.add([
								{ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:"+id },
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]);
						}

						view = new ExosManager.UsersApp.Show.MissingUser();
					}
					app.regions.getRegion('main').show(view);
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		}
	});

	return new Controller();
});
