define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/devoirs/exam/exam_view"
], function(
	app,
	Marionette,
	AlertView,
	MissingView,
	View
){
	// Il faudra envisager un exercice vide
	// Ou un exercice dont le fichier js n'existe pas
	// et éventuellement un chargement

	var Controller = Marionette.Object.extend({
		channelName: "entities",

		show: function(id){
			app.trigger("header:loading", true);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["exams"]);
				$.when(fetchingData).done(function(exams){
					var exam = exams.get(id);
					if (exam){
						var idFiche = exam.get("idFiche");
						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Tex", e:"devoir:exams", data:idFiche, link:"devoir:"+idFiche+"/tex"},
							{ text:"Fiche #"+id}
						]);
						var gettingBriques = exam.toExamBriques();
						$.when(gettingBriques).done(function(result){
							var view = new View ({nom:exam.get("nom"), locked: exam.get("locked"), collection:result});
							var fct_show_tex = function(){
								var askingForTex = exam.getTex();
								$.when(askingForTex).done(function(tex){
									view.showTex(tex);
								});
							}

							view.on("item:refresh", function(childview, exo_index, index){
								var askingRefresh = exam.refresh(exo_index, index);
								$.when(askingRefresh).done(function(result){
									var askingSave = exam.save();
									$.when(askingSave).done(function(){
										var model = childview.model;
										model.set(result.briques);
										childview.refresh_view();
										if(view.getRegion('tex').hasView()){
											fct_show_tex();
										}
									}).fail(function(response){
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/017]");
									});
								}).fail(function(message){
									alert(message);
								});
							});

							view.on("exam:button:tex", function(view){
								var texRegion = view.getRegion('tex');
								if (texRegion.hasView()) {
									texRegion.empty();
								} else {
									fct_show_tex();
								}
							});

							view.on("exam:lock", function(view){
								var locked = exam.get("locked");
								exam.set("locked", !locked);
								var updatingExam = exam.save();
								if (updatingExam) {
									$.when(updatingExam).done(function(){
										view.options.locked = !locked;
										view.render();
									}).fail(function(response){
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/018]");
									});
								} else {
									alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/019]");
								}
							});

							app.regions.getRegion('main').show(view);
						});
					} else {
						var view = new MissingView({ message:"Cette fiche tex n'existe pas !" });
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
