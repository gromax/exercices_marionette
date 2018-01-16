define(["marionette","app"], function(Marionette,app){

	var API = {
		// Partie devoirs
		devoirsList: function(){
			app.Ariane.reset([{ text:"Devoirs", e:"devoirs:list", link:"devoirs"}]);
			require(["apps/devoirs/list/list_controller"], function(Controller){
				Controller.list();
			});
		},

		devoirShow: function(id){
			var auth = app.Auth;
			var devoirEdition = function(){
				app.Ariane.reset([
					{ text:"Devoirs", e:"devoirs:list", link:"devoirs"},
					{ text:"Devoir #"+id, e:"devoir:show", data:id, link:"devoir:"+id},
				]);
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.show(id);
				});
			}

			var exoFicheRun = function(){
				app.Ariane.reset([]);
				require(["apps/devoirs/run/run_controller"], function(Controller){
					Controller.show(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirEdition,
				"Prof": devoirEdition,
				"Eleve": exoFicheRun,
				"def": this.notFound,
			});
			todo();
		},

		devoirShowExercices: function(id){
			var auth = app.Auth;
			var devoirEF_list = function(){
				app.Ariane.reset([
					{ text:"Devoirs", e:"devoirs:list", link:"devoirs"},
					{ text:"Devoir #"+id, e:"devoir:show", data:id, link:"devoir:"+id},
					{ text:"Exercices", e:"devoir:showExercices", data:id, link:"devoir:"+id+"/exercices"},
				]);

				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showExercices(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirEF_list,
				"Prof": devoirEF_list,
				"def": function(){ app.trigger("nnotFound"); },
			});
			todo();
		},

		devoirShowUserfiches: function(id){
			var auth = app.Auth;
			var devoirUF_list = function(){
				app.Ariane.reset([
					{ text:"Devoirs", e:"devoirs:list", link:"devoirs"},
					{ text:"Devoir #"+id, e:"devoir:show", data:id, link:"devoir:"+id},
					{ text:"Fiches élèves", e:"devoir:showUserfiches", data:id, link:"devoir:"+id+"/fiches-eleves"},
				]);
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showUserfiches(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirUF_list,
				"Prof": devoirUF_list,
				"def": function(){ app.trigger("nnotFound"); }
			});
			todo();
		},

		devoirAddUserfiche: function(id){
			var auth = app.Auth;
			var devoirAddUF = function(){
				app.Ariane.reset([
					{ text:"Devoirs", e:"devoirs:list", link:"devoirs"},
					{ text:"Devoir #"+id, e:"devoir:show", data:id, link:"devoir:"+id},
					{ text:"Fiches élèves", e:"devoir:showUserfiches", data:id, link:"devoir:"+id+"/fiches-eleves"},
					{ text:"Ajouter", e:"devoir:showAddUserfiche", data:id, link:"devoir:"+id+"/ajout-fiche-eleve"}
				]);
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showAddUserfiche(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirAddUF,
				"Prof": devoirAddUF,
				"def": function(){ app.trigger("nnotFound"); },
			});
			todo();
		},

	};

// Partie devoirs
	app.on("devoirs:list", function(){
		app.navigate("devoirs");
		API.devoirsList();
	});

	app.on("devoir:show", function(id){
		app.navigate("devoir:" + id);
		API.devoirShow(id);
	});

	app.on("devoir:showExercices", function(id){
		app.navigate("devoir:" + id+"/exercices");
		API.devoirShowExercices(id);
	});

	app.on("devoir:showUserfiches", function(id){
		app.navigate("devoir:" + id+"/fiches-eleves");
		API.devoirShowUserfiches(id);
	});

	app.on("devoir:addUserfiche", function(id){
		app.navigate("devoir:" + id+"/ajout-fiche-eleve");
		API.devoirAddUserfiche(id);
	});

	app.on("devoir:exams", function(id){
		//app.navigate("devoir:" + id+"/ajout-fiche-eleve");
		//API.devoirAddUserfiche(id);
		alert("Cette fonction n'est pas encore implémentée.")
	});

// Router

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"devoirs": "devoirsList",
			"devoir::id": "devoirShow",
			"devoir::id/exercices": "devoirShowExercices",
			"devoir::id/fiches-eleves": "devoirShowUserfiches",
			"devoir::id/ajout-fiche-eleve": "devoirAddUserfiche",
		}
	});

	new Router();

	return ;
});
