define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/list_layout",
	"apps/users/list/list_panel",
	"apps/users/list/list_view",
	"apps/users/new/new_view",
	"apps/users/edit/edit_view",
	"apps/users/edit/editpwd_view"
], function(
	app,
	Marionette,
	AlertView,
	Layout,
	Panel,
	UsersView,
	NewView,
	EditView,
	EditPwdView
){
	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		listUsers: function(criterion){
			criterion = criterion || "";
			app.trigger("header:loading", true);
			var usersListLayout = new Layout();
			var usersListPanel = new Panel({filterCriterion:criterion});
			var channel = this.getChannel();

			require(["entities/user","entities/dataManager"], function(User){
				var fetchingUsers = channel.request("custom:entities", ["users"]);
				$.when(fetchingUsers).done(function(users){
					var usersListView = new UsersView({
						collection: users,
						filterCriterion: criterion
					});

					usersListPanel.on("users:filter", function(filterCriterion){
						usersListView.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false });
						app.trigger("users:filter", filterCriterion);
					});

					usersListLayout.on("render", function(){
						usersListLayout.getRegion('panelRegion').show(usersListPanel);
						usersListLayout.getRegion('itemsRegion').show(usersListView);
					});

					usersListPanel.on("user:new", function(){
						var newUser = new User();
						var view = new NewView({
							model: newUser
						});

						view.on("form:submit", function(data){
							// Dans ce qui suit, le handler error sert s'il y a un problème avec la requête
							// Mais la fonction renvoie false directement si le save n'est pas permis pour ne pas vérifier des conditions comme un terme vide
							var savingUser = newUser.save(data);
							if (savingUser){
								$.when(savingUser).done(function(){
									users.add(newUser);
									view.trigger("dialog:close");
									var newUserView = usersListView.children.findByModel(newUser);
									// check whether the new user view is displayed (it could be
									// invisible due to the current filter criterion)
									if(newUserView){
										newUserView.flash("success");
									}
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											view.trigger("dialog:close");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/030]");
										}
									}
								});
							} else {
								view.triggerMethod("form:data:invalid",newUser.validationError);
							}

						});
						app.regions.getRegion('dialog').show(view);
					});

					usersListView.on("item:show",function(childView, args){
						var model = childView.model;
						app.trigger("user:show", model.get("id"));
					});

					usersListView.on("item:edit",function(childView, args){
						var model = childView.model;
						var view = new EditView({
							model:model
						});

						view.on("form:submit", function(data){
							var updatingUser = model.save(data);
							app.trigger("header:loading", true);
							if(updatingUser){
								$.when(updatingUser).done(function(){
									childView.render();
									view.trigger("dialog:close");
									childView.flash("success");
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											view.trigger("dialog:close");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/031]");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							} else {
								this.triggerMethod("form:data:invalid", model.validationError);
							}
						});

						app.regions.getRegion('dialog').show(view);
					});

					usersListView.on("item:editPwd",function(childView, args){
						var model = childView.model;
						var view = new EditPwdView({
							model:model
						});

						view.on("form:submit", function(data){
							if (data.pwd!==data.pwdConfirm){
								view.triggerMethod("form:data:invalid", { pwdConfirm:"Les mots de passe sont différents."});
							} else {
								var updatingUser = model.save(_.omit(data,"pwdConfirm"));
								app.trigger("header:loading", true);
								if(updatingUser){
									$.when(updatingUser).done(function(){
										// Supprimer pwd de user
										childView.render();
										view.trigger("dialog:close");
										childView.flash("success");
									}).fail(function(response){
										if(response.status == 422){
											view.triggerMethod("form:data:invalid", response.responseJSON.errors);
										} else {
											if(response.status == 401){
												alert("Vous devez vous (re)connecter !");
												view.trigger("dialog:close");
												app.trigger("home:logout");
											} else {
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/032]");
											}
										}
									}).always(function(){
										app.trigger("header:loading", false);
									});
								} else {
									this.triggerMethod("form:data:invalid", model.validationError);
								}
							}
						});

						app.regions.getRegion('dialog').show(view);
					});

					usersListView.on("item:delete", function(childView,e){
						var model = childView.model;
						var idUser = model.get("id");
						if (confirm("Supprimer le compte de « "+model.get("nomComplet")+" » ?")){
							var destroyRequest = model.destroy();
							app.trigger("header:loading", true);
							$.when(destroyRequest).done(function(){
								childView.remove();
								channel.request("user:destroy:update", idUser);
							}).fail(function(response){
								alert("Erreur. Essayez à nouveau !");
							}).always(function(){
								app.trigger("header:loading", false);
							});
						}
					});


					usersListView.on("item:forgotten", function(childView,e){
						var model = childView.model;
						var email = model.get("email");
						if (confirm("Envoyer un mail de réinitialisation à « "+model.get("nomComplet")+" » ?")){
							app.trigger("header:loading", true);
							sendingMail = channel.request("forgotten:password", email);
							sendingMail.always(function(){
								app.trigger("header:loading", false);
							}).done(function(response){
								childView.flash("success");
							}).fail(function(response){
								alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/034]");
							});
						}
					});

					app.regions.getRegion('main').show(usersListLayout);
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
