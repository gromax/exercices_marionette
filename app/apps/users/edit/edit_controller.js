define(["app","apps/common/loading_view","apps/common/missing_item_view","apps/users/edit/edit_view","apps/users/edit/editpwd_view"], function(app, LoadingView, MissingView, EditView, EditPwdView){
	var Controller = {
		editUser: function(id){
			var loadingView = new LoadingView({
				title: "Modification d'un utilisateur",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/user"], function(Radio,User){
				var channel = Radio.channel('users');
				var fetchingUser = channel.request("user:entity", id);
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){
						view = new EditView({
							model: user,
							generateTitle: true
						});

						view.on("form:submit", function(data){
							var updatingUser = user.save(data);
							if(updatingUser){
								$.when(updatingUser).done(function(){
									app.trigger("user:show", user.get("id"));
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									}
									else{
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								});
							}
							else {
								view.triggerMethod("form:data:invalid", user.validationError);
							}
						});
					}
					else
					{
						view = new MissingView({message:"Cet utilisateur n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				});
			});
		},
		editUserPwd: function(id){
			var loadingView = new LoadingView({
				title: "Modification du mot de passe utilisateur",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/user"], function(Radio,User){
				var channel = Radio.channel('users');
				var fetchingUser = channel.request("user:entity", id);
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){
						view = new EditPwdView({
							model: user,
							generateTitle: true
						});

						view.on("form:submit", function(data){
							if (data.pwd!==data.pwdConfirm){
								view.triggerMethod("form:data:invalid", { pwdConfirm:"Les mots de passe sont différents."});
							} else {
								var updatingUser = user.save(_.omit(data,"pwdConfirm"));
								if(updatingUser){
									$.when(updatingUser).done(function(){
										// Là il faudrait enlever le pwd de user
										app.trigger("user:show", user.get("id"));
									}).fail(function(response){
										if(response.status == 422){
											view.triggerMethod("form:data:invalid", response.responseJSON.errors);
										}
										else{
											alert("Erreur inconnue. Essayez à nouveau !");
										}
									});
								} else {
									view.triggerMethod("form:data:invalid", user.validationError);
								}
							}


						});
					}
					else
					{
						view = new ExosManager.UsersApp.Show.MissingUser();
					}
					app.regions.getRegion('main').show(view);
				});
			});
		}
	}

	return Controller;
});
