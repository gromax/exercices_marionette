define(["app","apps/common/loading_view","apps/classes/show/show_view","apps/common/missing_item_view"], function(app, LoadingView, ShowView, MissingView){
	var Controller = {
		show: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'une classe",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/classe"], function(Radio,Classe){
				var channel = Radio.channel('classes');
				var fetchingItem = channel.request("classe:entity", id);
				$.when(fetchingItem).done(function(item){
					var view;
					if(item !== undefined){
						view = new ShowView({
							model: item
						});
						view.on("classe:edit", function(item){
							app.trigger("classe:edit", item.get("id"));
						});
					}
					else{
						view = new MissingView( { message: "Cette classe n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				});
			});
		}
	}

	return Controller;
});
