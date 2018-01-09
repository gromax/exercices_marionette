define(["marionette","app"], function(Marionette,app){

	var API = {
		// Partie classe
		classesList: function(){
			require(["apps/classes/list/list_controller"], function(Controller){
				Controller.list();
			});
		},

		classeShow: function(id){
			require(["apps/classes/show/show_controller"], function(Controller){
				Controller.show(id);
			});
		},

		classeEdit: function(id){
			require(["apps/classes/edit/edit_controller"], function(Controller){
				Controller.edit(id);
			});
		},

		// Partie devoirs
		devoirsList: function(){
			require(["apps/devoirs/list/list_controller"], function(Controller){
				Controller.list();
			});
		},

		devoirShow: function(id){
			var auth = app.Auth;
			var devoirEdition = function(){
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.show(id);
				});
			}

			var exoFicheRun = function(){
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
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showExercices(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirEF_list,
				"Prof": devoirEF_list,
				"def": this.notFound,
			});
			todo();
		},

		devoirShowUserfiches: function(id){
			var auth = app.Auth;
			var devoirUF_list = function(){
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showUserfiches(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirUF_list,
				"Prof": devoirUF_list,
				"def": this.notFound,
			});
			todo();
		},

		devoirAddUserfiche: function(id){
			var auth = app.Auth;
			var devoirAddUF = function(){
				require(["apps/devoirs/show/show_controller"], function(Controller){
					Controller.showAddUserfiche(id);
				});
			}

			var todo = auth.mapItem({
				"Admin": devoirAddUF,
				"Prof": devoirAddUF,
				"def": this.notFound,
			});
			todo();
		},

		// Partie exercices
		exercicesList: function(){
			require(["apps/exercices/list/list_controller"], function(listController){
				listController.list();
			});
		},

		exerciceShow: function(id){
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

		// Partie home
		showHome: function(){
			require(["apps/home/show/show_controller"], function(showController){
				showController.showHome();
			});
		},

		showLogin: function(){
			if (app.Auth.get("logged_in")) {
				require(["apps/home/show/show_controller"], function(showController){
					showController.showHome();
				});
			} else {
				require(["apps/home/login/login_controller"], function(loginController){
					loginController.showLogin();
				});
			}
		},

		showSignin: function(){
			if (app.Auth.get("logged_in")) {
				this.notFound();
			} else {
				require(["apps/home/signin/signin_controller"], function(signinController){
					signinController.showSignin();
				});
			}
		},

		logout: function(){
			if (app.Auth.get("logged_in")) {
				var closingSession = app.Auth.destroy();
				console.log("destroy command launch");
				$.when(closingSession).done(function(response){
					// En cas d'échec de connexion, l'api server renvoie une erreur
					// Le delete n'occasione pas de raffraichissement des données
					// Il faut donc le faire manuellement
					app.Auth.refresh(response.logged);
					require(["apps/home/show/show_controller"], function(showController){
						showController.showHome();
					});
				}).fail(function(response){
					alert("An unprocessed error happened. Please try again!");
				});
			}
		},

		// Partie user
		listUsers: function(criterion){
			require(["apps/users/list/list_controller"], function(listController){
				listController.listUsers(criterion);
			});
		},

		showUser: function(id){
			require(["apps/users/show/show_controller"], function(showController){
				showController.showUser(id);
			});
		},

		editUser: function(id){
			require(["apps/users/edit/edit_controller"], function(editController){
				editController.editUser(id);
			});
		},

		editUserPwd: function(id){
			require(["apps/users/edit/edit_controller"], function(editController){
				editController.editUserPwd(id);
			});
		},

		// route par défaut
		notFound: function(){
			require(["apps/home/show/show_controller"], function(showController){
				showController.notFound();
			});
		}
	};




// Partie concernant les classes
	app.on("classes:list", function(){
		app.navigate("classes");
		API.classesList();
	});

	app.on("classe:show", function(id){
		app.navigate("classe:" + id);
		API.classeShow(id);
	});

	app.on("classe:edit", function(id){
		app.navigate("classe:" + id + "/edit");
		API.classeEdit(id);
	});

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

// Partie exercices
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

// Partie home
	app.on("home:show", function(){
		app.navigate("home");
		API.showHome();
	});

	app.on("home:login", function(){
		app.navigate("login");
		API.showLogin();
	});

	app.on("home:signin", function(){
		app.navigate("rejoindre-une-classe");
		API.showSignin();
	});

	app.on("home:logout", function(){
		API.logout();
		app.trigger("home:show");
	});

// Partie user
	app.on("users:list", function(){
		app.navigate("users");
		API.listUsers();
	});

	app.on("users:filter", function(criterion){
		if(criterion){
			app.navigate("users/filter/criterion:" + criterion);
		}
		else{
			app.navigate("users");
		}
	});

	app.on("user:show", function(id){
		app.navigate("user:" + id);
		API.showUser(id);
	});

	app.on("user:edit", function(id){
		app.navigate("user:" + id + "/edit");
		API.editUser(id);
	});

	app.on("user:editPwd", function(id){
		app.navigate("user:" + id + "/password");
		API.editUserPwd(id);
	});

// Router

	var Router = Marionette.AppRouter.extend({
		controller: API,
		appRoutes: {
			"classes": "classesList",
			"classe::id": "classeShow",
			"classe::id/edit": "classeEdit",
			"devoirs": "devoirsList",
			"devoir::id": "devoirShow",
			"devoir::id/exercices": "devoirShowExercices",
			"devoir::id/fiches-eleves": "devoirShowUserfiches",
			"devoir::id/ajout-fiche-eleve": "devoirAddUserfiche",
			"exercices": "exercicesList",
			"exercice::id": "exerciceShow",
			"exercice-fiche::id": "runExoFiche",
			"user-fiche::idUF/exercice-fiche::idEF":"runExoFiche",
			"home" : "showHome",
			"login" : "showLogin",
			"logout" : "logout",
			"rejoindre-une-classe": "showSignin",
			"users(/filter/criterion::criterion)": "listUsers",
			"users": "listUsers",
			"user::id": "showUser",
			"user::id/edit": "editUser",
			"user::id/password": "editUserPwd",
			'*notFound' : 'notFound'
		}
	});

	new Router();

	return ;
});
