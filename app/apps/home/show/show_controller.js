define([
	"app",
	"marionette",
	"apps/common/loading_view",
	"apps/home/show/admin_view",
	"apps/home/show/off_view",
	"apps/common/not_found",
	"apps/home/show/devoirs_list_eleve_view",
	"apps/home/show/eleve_view_layout",
], function(
	app,
	Marionette,
	LoadingView,
	AdminView,
	OffView,
	NotFound,
	ListEleveView,
	EleveViewLayout,
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
			var loadingView = new LoadingView({
				title: "Affichage de l'accueuil",
				message: "Chargement des données."
			});
			app.regions.getRegion('main').show(loadingView);
			var layout = new EleveViewLayout();

			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("eleve:entities");
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

					layout.on("render", function(){
						layout.getRegion('devoirsRegion').show(listEleveView);
					});

					app.regions.getRegion('main').show(layout);
				});
			});
		}
	});

	return new Controller();
});
