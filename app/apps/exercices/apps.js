define(["marionette","app"], function(Marionette,app){

	var API = {
		exercicesList: function(){
			app.Ariane.reset([{text:"Exercices", e:"exercices:list", link:"exercices"}]);
			require(["apps/exercices/list/list_controller"], function(listController){
				listController.list();
			});
		},

		exerciceShow: function(id){
			app.Ariane.reset([
				{text:"Exercices", e:"exercices:list", link:"exercices"},
				{text:"Exercice #"+id, e:"exercices:show:", data:id, link:"exercice:"+id}
			]);
			require(["apps/exercices/show/show_controller"], function(showController){
				showController.show(id);
			});
		},

		runExoFiche: function(idUF, idEF){
			var auth = app.Auth;
			var testForProf = function(){
				require(["apps/exercices/show/show_controller"], function(showController){
					showController.execExoFicheForTest(idEF);
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
				"def": this.notFound,
			});
			todo();
		},

	};

	app.on("exercices:list", function(){
		app.navigate("exercices");
		API.exercicesList();
	});

	app.on("exercice:show", function(id, data){
		app.navigate("exercice:" + id);
		API.exerciceShow(id, data);
	});

	app.on("exercice-fiche:run", function(idEF, idUF){
		if (idUF) {
			app.navigate("user-fiche:"+idUF+"/exercice-fiche:" + idEF);
		} else {
			app.navigate("exercice-fiche:" + idEF);
		}
		API.runExoFiche(idUF, idEF);
	});

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"exercices": "exercicesList",
			"exercice::id": "exerciceShow",
			"exercice-fiche::id": "runExoFiche",
			"user-fiche::idUF/exercice-fiche::idEF":"runExoFiche",
		}
	});

	new Router();

	return ;
});
