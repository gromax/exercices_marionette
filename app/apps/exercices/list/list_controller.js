define(["app", "marionette", "apps/common/loading_view", "apps/exercices/list/list_view"], function(app, Marionette, LoadingView, ListView){

	var Controller = Marionette.Object.extend({
		channelName: "entities",
		list: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();

			require(["entities/exercices"], function(){
				var collection = channel.request("exercices:entities");
				var listView = new ListView({
					collection: collection
				});

				listView.on("childview:exercice:show",function(childView, args){
					var model = childView.model;
					app.trigger("exercice:show", model.get("id"));
				});

				app.regions.getRegion('main').show(listView);
			});
		}
	});

	return new Controller();
});
