define(["marionette","app"], function(Marionette,app){

	var API = {
		exercicesList: function(criterion){
			app.Ariane.reset([{text:"Exercices", e:"exercices:list", link:"exercices"}]);
			require(["apps/exercices/list/list_controller"], function(listController){
				listController.list(criterion);
			});
		},

		exerciceShow: function(id){
			app.Ariane.reset([
				{text:"Exercices", e:"exercices:list", link:"exercices"},
				{text:"Exercice #"+id, e:"exercices:show:", data:id, link:"exercice:"+id}
			]);
			require(["apps/exercices/show/show_controller"], function(showController){
				showController.execExoForTest(id);
			});
		},

		runExoFiche: function(idUF, idEF){
			var auth = app.Auth;
			var testForProf = function(){
				require(["apps/exercices/show/show_controller"], function(showController){
					showController.execExoFicheForProf(idEF);
				});
			}

			var execForEleve = function(){
				app.Ariane.reset([]);
				require(["apps/exercices/show/show_controller"], function(showController){
					showController.execExoFicheForEleve(idUF, idEF);
				});
			}

			var todo = auth.mapItem({
				"Admin": testForProf,
				"Prof": testForProf,
				"Eleve": execForEleve,
				"def": function(){ app.trigger("notFound") },
			});
			todo();
		},

		runUE: function(idUE){
			var auth = app.Auth;
			var forEleve = function(){
				app.Ariane.reset([]);
				require(["apps/exercices/show/show_controller"], function(showController){
					showController.execUEForEleve(idUE);
				});
			}

			var todo = auth.mapItem({
				"Eleve": forEleve,
				"def": function(){ app.trigger("notFound") },
			});
			todo();
		},

	};

	app.on("exercices:list", function(){
		app.navigate("exercices");
		API.exercicesList();
	});

	app.on("exercices:filter", function(criterion){
		if(criterion){
			app.navigate("exercices/filter/criterion:" + criterion);
		}
		else{
			app.navigate("exercices");
		}
	});

	app.on("exercice:show", function(id, data){
		app.navigate("exercice:" + id);
		API.exerciceShow(id, data);
	});

	app.on("exercice-fiche:run", function(idEF, idUF){
		if (idUF) {
			app.navigate("fiche-eleve:"+idUF+"/exercice-fiche:" + idEF);
		} else {
			app.navigate("exercice-fiche:" + idEF);
		}
		API.runExoFiche(idUF, idEF);
	});

	app.on("exercice-fait:run", function(idUE){
		app.navigate("exercice-fait:"+idUE);
		API.runUE(idUE);
	})

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"exercices(/filter/criterion::criterion)": "exercicesList",
			"exercice::id": "exerciceShow",
			"exercice-fiche::id": "runExoFiche",
			"fiche-eleve::idUF/exercice-fiche::idEF":"runExoFiche",
			"exercice-fait::idUE":"runUE"
		}
	});

	new Router();

	return ;
});
