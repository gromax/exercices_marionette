define(["app", "marionette", "apps/common/loading_view", "apps/common/list_layout","apps/users/list/list_panel", "apps/users/list/list_view", "apps/users/new/new_view", "apps/users/edit/edit_view", "apps/users/edit/editpwd_view"], function(app, Marionette, LoadingView, Layout, Panel, UsersView, NewView, EditView,EditPwdView){

	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		listUsers: function(criterion){
			criterion = criterion || "";
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var usersListLayout = new Layout();
			var usersListPanel = new Panel({filterCriterion:criterion});
			var channel = this.getChannel();

			require(["entities/user","entities/dataManager"], function(User){
				var fetchingUsers = channel.request("users:entities");
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
										alert("An unprocessed error happened. Please try again!");
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
							if(updatingUser){
								$.when(updatingUser).done(function(){
									childView.render();
									view.trigger("dialog:close");
									childView.flash("success");
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										alert("An unprocessed error happened. Please try again!");
									}
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
											alert("An unprocessed error happened. Please try again!");
										}
									});
								} else {
									this.triggerMethod("form:data:invalid", model.validationError);
								}
							}
						});

						app.regions.getRegion('dialog').show(view);
					});

					usersListView.on("item:delete", function(childView,e){
						childView.remove();
					});

					app.regions.getRegion('main').show(usersListLayout);
				});
			});
		}
	});

	return new Controller();
});
