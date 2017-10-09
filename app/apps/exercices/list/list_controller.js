define(["app", "apps/common/loading_view", "apps/exercices/list/list_view"], function(app, LoadingView, ListView){

	var Controller ={
		list: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/exercice","entities/exercices"], function(Radio, Item){
				var channel=Radio.channel('exercices');
				var collection = channel.request("exercices:entities");

				var listView = new ListView({
					collection: collection
				});

				app.regions.getRegion('main').show(listView);
			});
		}
	};

	return Controller;
});
