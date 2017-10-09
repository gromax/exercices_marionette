define(["app","apps/common/loading_view","apps/users/show/show_view","apps/common/missing_item_view"], function(app, LoadingView, ShowView, MissingView){
	var Controller = {
		showUser: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'un utilisateur",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/user"], function(Radio,User){
				var channel = Radio.channel('users');
				var fetchingUser = channel.request("user:entity", id);
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){
						view = new ShowView({
							model: user
						});
						view.on("user:edit", function(user){
							app.trigger("user:edit", user.get("id"));
						});
					}
					else{
						view = new MissingView({ message:"Cet utilisateur n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				});
			});
		}
	}

	return Controller;
});
