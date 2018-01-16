define([
	"app",
	"marionette",
	"apps/common/loading_view",
	"apps/common/missing_item_view",
	"apps/devoirs/run/exercices_list_view",
	"apps/devoirs/run/devoir_panel",
	"apps/devoirs/run/note_panel",
	"apps/devoirs/run/run_layout",
], function(
	app,
	Marionette,
	LoadingView,
	MissingView,
	ExercicesListView,
	DevoirPanel,
	NotePanel,
	Layout
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		show: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'un devoir",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("eleve:entities");
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var userfiche = userfiches.get(id);
					if(userfiche !== undefined){
						// On envoie toute la collection partant du principe que seule les exofiches de userfiche seront affichés

						app.Ariane.add({ text:userfiche.get("nomFiche"), e:"devoir:show", data:id, link:"devoir:"+id});

						var layout = new Layout();
						var devoirPanel = new DevoirPanel({ model: userfiche });
						var notePanel = new NotePanel({ model: userfiche, exofiches:exofiches, faits:faits });
						var view = new ExercicesListView({ collection: exofiches, userfiche:userfiche, faits:faits });

						view.on("childview:exofiche:run", function(childview){
							var model = childview.model;
							// Il faut envoyer l'id de l'exofiche mais aussi du userfiche
							app.trigger("exercice-fiche:run", model.get("id"), id);
						});

						layout.on("render", function(){
							layout.getRegion('devoirRegion').show(devoirPanel);
							layout.getRegion('exercicesRegion').show(view);
							layout.getRegion('noteRegion').show(notePanel);
						});
						app.regions.getRegion('main').show(layout);
					} else{
						var view = new MissingView();
						app.regions.getRegion('main').show(view);
					}
				});
			});
		},

	});

	return new Controller();
});
