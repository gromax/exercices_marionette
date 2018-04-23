define(["backbone.radio","entities/exercices/exercices_catalog", "jst"], function(Radio, Catalog, JST){
	var Exam = Backbone.Model.extend({
		urlRoot:"api/exams",
		defaults: {
			nom: "Version papier"
		},

		parse: function(data){
			if (data.id) { data.id = Number(data.id); }
			data.idFiche = Number(data.idFiche);
			data.locked = (data.locked == "1") || (data.locked==1) || (data.locked===true);
			if (typeof data.data == "string") {
				data.data = JSON.parse(data.data);
			}
			return data;
		},

		toJSON: function(){
			var output = _.pick(this.attributes, 'id', 'nom', 'idFiche', 'data', 'locked');
			if (typeof output.data == "object"){
				output.data = JSON.stringify(output.data);
			}
			return output;
		},

		toExamBriques: function(){
			var params = this.get("data");
			// params est un tableau de inputs avec idE, options, inputs array
			// Les options sont sous forme { key:value }

			var deferGlobal = $.Deferred();
			var counter = params.length; // permet de compter le travail restant à faire
			var out = _.map(params, function(){ return { children:[], message:false }; });

			var fct_item_exo = function(item, index){
				var itemParams = params[index];
				var idE = itemParams.idE;
				var iteratee_options = function(option_item){
					return { value: option_item };
				}
				var options = _.mapObject(itemParams.options, iteratee_options);
				var inputs = itemParams.inputs;

				var exoData = Catalog.get(idE);
				if (exoData) {
					var filename = exoData.filename
					item.title = exoData.title
					// Prise en compte des paramètres d'options

					var successCB = function(exoController) {
						if (typeof exoController.getExamBriques == "function" ) {
							_.extend(item, exoController.getExamBriques(inputs,options, exoData.fixedSettings))
						} else {
							item.message = "Cet exercice n'a pas de fonction Exam [#"+idE+"]";
						}
						counter--;
						if (counter == 0) {
							deferGlobal.resolve(new ExerciceCollection(out));
						}
					}

					var failedCB = function() {
						item.message = "Le fichier "+filename+" n'a pu être chargé.";
						counter--;
						if (counter == 0) {
							deferGlobal.resolve(new ExerciceCollection(out));
						}
					}
					require(["entities/exercices/"+filename], successCB, failedCB);
				} else {
					item.message="L'exercice #"+idE+" n'est pas dans le catalogue.";
					item.title = "Exercice inconnu !";
					counter--;
					if (counter == 0) {
						deferGlobal.resolve(new ExerciceCollection(out));
					}
				}
			}

			if (counter == 0) {
				deferGlobal.resolve(new ExerciceCollection(out));
			} else {
				_.each(out, fct_item_exo);
			}

			return deferGlobal.promise();
		},

		refresh: function(exo_index, item_index){
			var defer = $.Deferred();
			var data = this.get("data");
			if (data.length<exo_index) {
				defer.reject("Il n'y a que "+data.length+" exercices dans la liste, pas "+(exo_index+1)+" !");
				return defer.promise();
			}
			var exo_data = data[exo_index];
			if (exo_data.inputs.length<item_index) {
				defer.reject("L'exercice "+(exo_index+1)+" ne doit être répété que "+exo_data.length+", pas "+(exo_index+1)+" fois !");
				return defer.promise();
			}
			// L'item peut être réinitialisé
			var idE = exo_data.idE;
			// Il faut reconstruire l'objet options
			var options = _.mapObject(exo_data.options, function(itO){
				return { value: itO };
			});

			var exoInCatalog = Catalog.get(idE);
			if (exoInCatalog) {
				var filename = exoInCatalog.filename
				// Prise en compte des paramètres d'options

				var successCB = function(exoController) {
					var inputs = {}
					exoController.init(inputs,options); // Cette fonction change inputs
					exo_data.inputs[item_index] = inputs;

					var briques = { children:[], message:false, title:exoInCatalog.title };

					if (typeof exoController.getExamBriques == "function" ) {
						_.extend(briques, exoController.getExamBriques(exo_data.inputs,options, exoInCatalog.fixedSettings))
					} else {
						briques.message = "Cet exercice n'a pas de fonction Exam";
					}

					defer.resolve({
						inputs:inputs,
						briques: briques
					});
				}

				var failedCB = function() {
					defer.reject("Fichier "+filename+" introuvable.");
				}
				require(["entities/exercices/"+filename], successCB, failedCB);
			} else {
				defer.reject("Exercice #"+idE+" introuvable dans le catalogue.");
			}
			return defer.promise();
		},

		getTex: function(){
			var defer = $.Deferred();
			var params = this.get("data");
			// params est un tableau de inputs avec idE, options, inputs array
			// Les options sont sous forme { key:value }

			var counter = params.length; // permet de compter le travail restant à faire
			var exercices_tex_object = _.map(params, function(){ return { children:[], title:"", message:false}; });
			var templateDatas = {
				exercices: exercices_tex_object,
				id: this.get("id"),
				nom: this.get("nom"),
			}

			var fct_remove_blank_lines = function(text) {
				return text.replace(/^\s*[\r\n]/gm, "\r\n");
			}

			var fct_item_exo = function(item, index){
				var template = window.JST["devoirs/exam/exam-tex"];
				var itemParams = params[index];
				var idE = itemParams.idE;
				var iteratee_options = function(option_item){
					return { value: option_item };
				}
				var options = _.mapObject(itemParams.options, iteratee_options);
				var inputs = itemParams.inputs;


				var exoData = Catalog.get(idE);
				if (exoData) {
					var filename = exoData.filename
					item.title = exoData.title
					// Prise en compte des paramètres d'options

					var successCB = function(exoController) {
						if (typeof exoController.getTex == "function" ) {
							_.extend(item, exoController.getTex(inputs,options, exoData.fixedSettings))
						} else {
							item.message = "\\textcolor{red}{Cet exercice n'a pas de fonction Tex ["+idE+"]}";
						}
						counter--;
						if (counter == 0) {
							defer.resolve( fct_remove_blank_lines(template(templateDatas)) );
						}
					}

					var failedCB = function() {
						item.message = "\\textcolor{red}{Le fichier \\verb?"+filename+"? n'a pu être chargé.}";
						counter--;
						if (counter == 0) {
							defer.resolve( fct_remove_blank_lines(template(templateDatas)) );
						}
					}
					require(["entities/exercices/"+filename], successCB, failedCB);
				} else {
					item.message="\\textcolor{red}{L'exercice ["+idE+"] n'est pas dans le catalogue.}";
					item.title = "Exercice inconnu";
					counter--;
					if (counter == 0) {
						defer.resolve( fct_remove_blank_lines(template(templateDatas)) );
					}
				}
			}

			if (counter == 0) {
				defer.resolve( fct_remove_blank_lines(template(templateDatas)) );
			} else {
				_.each(exercices_tex_object, fct_item_exo);
			}

			return defer.promise();
		}
	});



	var ExerciceInExam = Backbone.Model.extend({
		defaults: {
			title: "Exercice",
			unique: false,
		},
	});

	var ExerciceCollection = Backbone.Collection.extend({
		model: ExerciceInExam,
	});


	API= {
		newExamEntityWithIdFiche: function(idFiche){
			var defer = $.Deferred();
			require(["entities/dataManager"], function(){
				var fetchingData = channel.request("custom:entities", ["exofiches"]);
				$.when(fetchingData).done(function(exofiches){
					var ex = exofiches.where({idFiche: Number(idFiche)});
					var params = _.map(ex, function(item){
						return {
							idE: item.get("idE"),
							options:item.get("options"),
							num:Number(item.get("num"))
						};
					});
					var fetchingExo = API.newExamEntityWithParams(params);
					$.when(fetchingExo).done(function(exoModel){
						defer.resolve(exoModel);
					}).fail(function(response){
						defer.reject(response);
					});
				});
			});
			return defer.promise();
		},

		newExamEntityWithParams: function(params){
			// params est un tableau
			// pour chaque item, il faut préciser idE, options, num
			// Les options sont complètes
			var out = {
				messages:[],
				data:_.map(params,function(){ return { }; }),
				erreur:false
			}
			var deferGlobal = $.Deferred();
			var counter = params.length; // permet de compter le travail restant à faire

			var fct_item_exo = function(item, index){
				var itemParams = params[index];
				var idE = itemParams.idE;
				var num = itemParams.num;
				var options = itemParams.options;

				item.idE = idE;
				item.options = _.mapObject(options, function(itO){
					return itO.value;
				});

				var exoData = Catalog.get(idE);
				if (exoData) {
					var filename = exoData.filename
					// Prise en compte des paramètres d'options

					var successCB = function(exoController) {
						outExoInputs = []
						for (var i=0; i<num; i++){
							var inputs = {}
							exoController.init(inputs,options); // Cette fonction change inputs
							outExoInputs.push(inputs);
						}

						item.inputs = outExoInputs;
						counter--;
						if (counter == 0) {
							if (out.erreur) {
								deferGlobal.reject(out);
							} else {
								deferGlobal.resolve(out);
							}
						}
					}

					var failedCB = function() {
						item.inputs = [];
						out.messages.push("Fichier "+filename+" introuvable.");
						out.erreur = true;
						counter--;
						if (counter == 0) {
							deferGlobal.reject(out);
						}
					}
					require(["entities/exercices/"+filename], successCB, failedCB);
				} else {
					item.inputs=[];
					out.erreur = true;
					out.messages.push("Exercice #"+idE+" introuvable dans le catalogue.");
					counter--;
					if (counter == 0) {
						deferGlobal.reject(out);
					}
				}
			}

			if (counter == 0) {
				deferGlobal.resolve(out);
			} else {
				_.each(out.data, fct_item_exo);
			}

			return deferGlobal.promise();

		},

	}

	channel = Radio.channel('entities');
	channel.reply('new:exam:entity', API.newExamEntityWithIdFiche);

	return Exam;
});
