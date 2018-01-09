define(["app","marionette", "apps/common/loading_view","apps/classes/show/show_view","apps/common/missing_item_view"], function(app, Marionette, LoadingView, ShowView, MissingView){

	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		show: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'une classe",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();
			require(["entities/classe"], function(Classe){
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
		},
	})

	return new Controller();
});
