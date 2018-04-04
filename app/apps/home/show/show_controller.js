define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/home/show/admin_view",
	"apps/home/show/off_view",
	"apps/common/not_found",
	"apps/home/show/devoirs_list_eleve_view",
	"apps/home/show/eleve_view_layout",
	"apps/home/show/unfinished_message"
], function(
	app,
	Marionette,
	AlertView,
	AdminView,
	OffView,
	NotFound,
	ListEleveView,
	EleveViewLayout,
	UnfinishedView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		showHome: function(){
			var Auth = app.Auth;
			var rank = app.Auth.get('rank');
			switch (rank) {
				case "Root":
					var view = new AdminView();
					app.regions.getRegion('main').show(view);
					break;
				case "Admin":
					var view = new AdminView();
					app.regions.getRegion('main').show(view);
					break;
				case "Élève":
					this.showEleveHome();
					break;
				default:
					var view = new OffView();
					app.regions.getRegion('main').show(view);
			}
		},

		notFound: function(){
			var view = new NotFound();
			app.regions.getRegion('main').show(view);
		},

		showEleveHome: function(){
			app.trigger("header:loading", true);
			var layout = new EleveViewLayout();

			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var listEleveView = new ListEleveView({
						collection: userfiches,
						exofiches: exofiches,
						faits: faits
					});

					listEleveView.on("childview:devoir:show", function(childView){
						var model = childView.model;
						app.trigger("devoir:show", model.get("id"));
					});

					var unfinishedMessageView = null;
					var listeUnfinished = _.filter(
						faits.where({ finished: false }),
						function(item){
							var uf = userfiches.get(item.get("aUF"));
							if (uf.get("actif") && uf.get("ficheActive")) {
								return true;
							}
							return false;
						}
					);

					var n = listeUnfinished.length;
					if (n>0){
						unfinishedMessageView = new UnfinishedView({ number:n });
						unfinishedMessageView.on("devoir:unfinished:show", function(){
							app.trigger("faits:unfinished");
						});
					}

					layout.on("render", function(){
						layout.getRegion('devoirsRegion').show(listEleveView);
						if (unfinishedMessageView) {
							layout.getRegion('unfinishedRegion').show(unfinishedMessageView);
						}
					});
					app.regions.getRegion('main').show(layout);
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
		}
	});

	return new Controller();
});
