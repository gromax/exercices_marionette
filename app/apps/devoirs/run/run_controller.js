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
		showProf: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'un devoir",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["fiches", "userfiches", "exofiches", "faits", "users"]);
				$.when(fetchingData).done(function(devoirs, userfiches, exofiches, faits, users){
					var userfiche = userfiches.get(id);
					if(userfiche !== undefined){
						var idFiche = userfiche.get("idFiche");
						var fiche = devoirs.get(idFiche);
						var idUser = userfiche.get("idUser");
						var user = users.get(idUser);

						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:showUserfiches", data:idFiche, link:"devoir:"+idFiche+"/fiches-eleves"},
							{ text:user.get("nomComplet")+" #"+id },
						]);

						var layout = new Layout();
						var devoirPanel = new DevoirPanel({ model: fiche, profMode:true });
						var notePanel = new NotePanel({ model: userfiche, exofiches:exofiches, faits:faits });
						var view = new ExercicesListView({ collection: exofiches, userfiche:userfiche, faits:faits, profMode:true });

						view.on("childview:exofiche:run", function(childview){
							var model = childview.model;
							app.trigger("devoirs:fiche-eleve:faits", id, model.get("id"));
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

		showEleve: function(id){
			var loadingView = new LoadingView({
				title: "Affichage d'un devoir",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetchingData).done(function(userfiches, exofiches, faits){
					var userfiche = userfiches.get(id);
					if(userfiche !== undefined){
						// On envoie toute la collection partant du principe que seule les exofiches de userfiche seront affichés

						app.Ariane.add({ text:userfiche.get("nomFiche") });

						var layout = new Layout();
						var devoirPanel = new DevoirPanel({ model: userfiche });
						var notePanel = new NotePanel({ model: userfiche, exofiches:exofiches, faits:faits });
						var view = new ExercicesListView({ collection: exofiches, userfiche:userfiche, faits:faits, showFaitsButton:true });

						view.on("childview:exofiche:run", function(childview){
							var model = childview.model;
							app.trigger("exercice-fiche:run", model.get("id"), id);
						});

						view.on("childview:exofiche:saved-list:show", function(childview){
							var model = childview.model;
							app.trigger("userfiche:exofiche:faits", id, model.get("id"));
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
