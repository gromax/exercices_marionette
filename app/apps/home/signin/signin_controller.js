define(["app", "marionette", "apps/home/signin/signin_view", "apps/common/loading_view",  "apps/common/not_found", "apps/home/signin/test_mdp_view", "apps/home/signin/new_eleve_view"], function(app, Marionette, SigninView, LoadingView, NotFoundView, TestMdpView, NewEleveView){
	var Controller = Marionette.Object.extend({
		channelName: "entities",

		showSignin: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetching = channel.request("classes:entities");
				$.when(fetching).done(function(items){
					var listClassesView = new SigninView({
						collection: items
					});

					listClassesView.on("childview:classe:join", function(childView){
						var classe = childView.model;
						require(["entities/user"], function(User){
							var newUser = new User({ nomClasse:classe.get("nom"), idClasse:classe.get("id")});
							var mdp_view = new TestMdpView({ model: newUser });

							mdp_view.on("form:submit", function(data_test){
								testingMdp = newUser.testClasseMdp(data_test.mdp);
								$.when(testingMdp).done(function(){
									newUser.set("classeMdp", data_test.mdp);
									mdp_view.trigger("dialog:close");

									// Débug : Réutiliser la vue de l'autre app n'est peut-être pas idéal
									new_eleve_view = new NewEleveView({ model: newUser });

									new_eleve_view.on("form:submit", function(data_user){
										// Dans ce qui suit, le handler error sert s'il y a un problème avec la requête
										// Mais la fonction renvoie false directement si le save n'est pas permis pour ne pas vérifier des conditions comme un terme vide
										var savingUser = newUser.save(data_user);
										if (savingUser){
											$.when(savingUser).done(function(){
												console.log("succès");
												new_eleve_view.trigger("dialog:close");
											}).fail(function(response){
												if(response.status == 422){
													new_eleve_view.triggerMethod("form:data:invalid", response.responseJSON.errors);
												} else {
													alert("An unprocessed error happened. Please try again!");
												}
											});
										} else {
											new_eleve_view.triggerMethod("form:data:invalid",newUser.validationError);
										}

									});




									app.regions.getRegion('dialog').show(new_eleve_view);
								}).fail(function(response){
									if(response.status == 422){
										mdp_view.triggerMethod("form:data:invalid", {mdp:"Mot de passe incorrect."});
									}
									else{
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								})
							});

							app.regions.getRegion('dialog').show(mdp_view);

						});
					});
					app.regions.getRegion('main').show(listClassesView);
				});
			});
		}
	});

	return new Controller();
});
