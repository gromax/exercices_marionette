define([
	"app",
	"marionette",
	"apps/common/loading_view",
	"apps/common/list_layout",
	"apps/exercices/list/list_panel",
	"apps/exercices/list/list_view"
], function(
	app,
	Marionette,
	LoadingView,
	Layout,
	Panel,
	ListView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		list: function(criterion){
			criterion = criterion || "";
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);

			var layout = new Layout();
			var panel = new Panel({filterCriterion:criterion});

			var channel = this.getChannel();

			require(["entities/exercices"], function(){
				var collection = channel.request("exercices:entities");
				var listView = new ListView({
					collection: collection,
					filterCriterion: criterion
				});

				panel.on("exercices:filter", function(filterCriterion){
					listView.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false });
					app.trigger("exercices:filter", filterCriterion);
				});

				layout.on("render", function(){
					layout.getRegion('panelRegion').show(panel);
					layout.getRegion('itemsRegion').show(listView);
				});


				listView.on("childview:exercice:show",function(childView, args){
					var model = childView.model;
					app.trigger("exercice:show", model.get("id"));
				});

				app.regions.getRegion('main').show(layout);
			});
		}
	});

	return new Controller();
});
