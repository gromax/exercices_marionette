define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/devoirs/faits/faits_view"
], function(
	app,
	Marionette,
	AlertView,
	MissingView,
	ListView
){
	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		listForProf: function(idUF, idEF){
			// idUF : est l'association user/fiche, l'occurence d'un devoir
			// idEF : est l'assoication exercice/fiche, référence d'un exercice à l'intérieur d'un devoir
			// Chaque exercice fait est associé à un UF et un EF

			app.trigger("header:loading", true);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetching = channel.request("custom:entities",["userfiches", "exofiches", "faits", "users"]);
				$.when(fetching).done(function(userfiches, exofiches, faits, users){
					idUF = Number(idUF);
					idEF = Number(idEF);
					var userfiche = userfiches.get(idUF);
					var exofiche = exofiches.get(idEF);
					if((userfiche !== undefined) && (exofiche !== undefined)){
						// Je cherche le numéro du EF dans la fiche
						var idFiche = userfiche.get("idFiche");
						var EFs = exofiches.where({idFiche : idFiche});
						var index = _.findIndex(EFs, function(it){
							return it.get("id") == idEF;
						});

						var idUser = userfiche.get("idUser");
						var user = users.get(idUser);
						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Fiches élèves", e:"devoir:showUserfiches", data:idFiche, link:"devoir:"+idFiche+"/fiches-eleves"},
							{ text:user.get("nomComplet")+" #"+idUF, e:"devoirs:fiche-eleve:show", data:idUF, link:"devoirs/fiche-eleve:"+idUF },
							{ text:"Exercice "+(index+1) },
						]);

						var listItemsView = new ListView({
							collection: faits,
							filter: function(child, index, collection){
								return (child.get("aUF") == idUF) && (child.get("aEF") == idEF);
							},
							showDeleteButton:true,
						});

						listItemsView.on("item:show",function(childView, args){
							var model = childView.model;
							app.trigger("exercice-fait:run", model.get("id"));
						});

						listItemsView.on("item:delete", function(childView,e){
							childView.remove();
						});

						app.regions.getRegion('main').show(listItemsView);

					} else {
						var view = new MissingView();
						app.regions.getRegion('main').show(view);
					}
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

		listForEleve: function(idUF, idEF){
			// Deux options : soit on fourni les deux arguments
			//   idUF : est l'association user/fiche, l'occurence d'un devoir
			//   idEF : est l'assoication exercice/fiche, référence d'un exercice à l'intérieur d'un devoir
			//   Chaque exercice fait est associé à un UF et un EF
			// Soit on ne fourni pas d'arguments, dans ce cas on affiche tous ceux qui ne sont pas terminés

			app.trigger("header:loading", true);
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetching = channel.request("custom:entities", ["userfiches", "exofiches", "faits"]);
				$.when(fetching).done(function(userfiches, exofiches, faits){
					var okDisplay = false;
					if (idUF && idEF) {
						idUF = Number(idUF);
						idEF = Number(idEF);
						var userfiche = userfiches.get(idUF);
						var exofiche = exofiches.get(idEF);
						if((userfiche !== undefined) && (exofiche !== undefined)){

							okDisplay = true;
							filter = function(child, index, collection){
								return (child.get("aUF") == idUF) && (child.get("aEF") == idEF);
							}
							// Je cherche le numéro du EF dans la fiche
							var EFs = exofiches.where({idFiche : userfiche.get("idFiche")});
							var index = _.findIndex(EFs, function(it){
								return it.get("id") == idEF;
							});

							app.Ariane.add([
								{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
								{ text:"Exercice "+(index+1) }
							]);
						}
					} else {
						okDisplay = true;
						filter = function(child, index, collection){
							// Si l'exercice n'est pas terminé, encore faut-il qu'il puisse l'être
							var finished = child.get("finished");
							if (!finished) {
								var uf = userfiches.get(child.get("aUF"));
								if (uf.get("actif") && uf.get("ficheActive")) {
									return true;
								}
							}
							return false;
						}
					}

					if(okDisplay){
						// Partie commune
						var listItemsView = new ListView({
							collection: faits,
							filter: filter,
							showDeleteButton:false,
						});

						listItemsView.on("item:show",function(childView, args){
							var model = childView.model;
							app.trigger("exercice-fait:run", model.get("id"));
						});

						app.regions.getRegion('main').show(listItemsView);
					} else {
						var view = new MissingView();
						app.regions.getRegion('main').show(view);
					}
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
