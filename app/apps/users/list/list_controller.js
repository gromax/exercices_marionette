define(["app", "apps/common/loading_view", "apps/common/list_layout","apps/users/list/list_panel", "apps/users/list/list_view", "apps/users/new/new_view", "apps/users/edit/edit_view", "apps/users/edit/editpwd_view"], function(app, LoadingView, Layout, Panel, UsersView, NewView, EditView,EditPwdView){

	var Controller ={
		listUsers: function(criterion){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var usersListLayout = new Layout();
			var usersListPanel = new Panel();

			require(["backbone.radio", "entities/filtered_collection", "entities/user","entities/users"], function(Radio, FilteredCollection, User){
				var channel=Radio.channel('users');
				var fetchingUsers = channel.request("user:entities");
				$.when(fetchingUsers).done(function(users){
					var filteredUsers = FilteredCollection({
						collection: users,
						filterFunction: function(filterCriterion){
							var criterion = filterCriterion.toLowerCase();
							return function(user){
								if(user.get("prenom").toLowerCase().indexOf(criterion) !== -1
								|| user.get("nom").toLowerCase().indexOf(criterion) !== -1
								|| user.get("nomClasse").toLowerCase().indexOf(criterion) !== -1){
									return user;
								}
							};
						}
					});

					if(criterion){
						filteredUsers.filter(criterion);
						usersListPanel.once("show", function(){
							usersListPanel.triggerMethod("set:filter:criterion", criterion);
						});
					}

					var usersListView = new UsersView({
						collection: filteredUsers
					});

					usersListPanel.on("users:filter", function(filterCriterion){
						filteredUsers.filter(filterCriterion);
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

					usersListView.on("childview:user:show",function(childView, args){
						var model = childView.model;
						app.trigger("user:show", model.get("id"));
					});

					usersListView.on("childview:user:edit",function(childView, args){
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

					usersListView.on("childview:user:editPwd",function(childView, args){
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

					usersListView.on("childview:user:delete", function(childView,e){
						childView.model.destroy();
					});

					app.regions.getRegion('main').show(usersListLayout);
				});





			});



		}
	};

	return Controller;
});
