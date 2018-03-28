define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/classes/show/show_view",
	"apps/common/missing_item_view"
], function(
	app,
	Marionette,
	AlertView,
	ShowView,
	MissingView
){

	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		show: function(id){
			app.trigger("header:loading", true);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingClasse = channel.request("classe:entity", id);
				$.when(fetchingClasse).done(function(item){
					var view;
					if(item !== undefined){
						app.Ariane.add({ text:item.get("nom"), e:"classe:show", data:id, link:"classe:"+id});
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
		},
	})

	return new Controller();
});
