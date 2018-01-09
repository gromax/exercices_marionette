define(["backbone.radio", "entities/exercices/exercices_catalog"], function(Radio, catalog){
	var ExoFiche = Backbone.Model.extend({
		urlRoot:"api/exosfiche",
		defaults: {
			title: "",
			description: "",
			keyWords: [],
			idE: false,
			num:1,
			coeff:1,
			options:{}
		},

		validate: function(attrs, options){
			var errors = {};
			if (! attrs.num){
				errors.num = "Ne doit pas être vide";
			}
			else {
				if (!$.isNumeric(attrs.coeff)){
					errors.num = "Il faut enter un nombre";
				}
			}
			if (! attrs.coeff){
				errors.coeff = "Ne doit pas être vide";
			}
			else {
				if (!$.isNumeric(attrs.coeff)){
					errors.coeff = "Il faut enter un nombre";
				}
			}
			if(! _.isEmpty(errors)){
				return errors;
			}
		},

		calcNote: function(notesArray) {
			var i;
			var num = Math.max(this.get("num"), 1);

			var noteExo = 0;
			var poidsExo = 0;
			var l = notesArray.length;
			// Il faut que l'élève ait fait au moins num fois l'exercice
			// Sinon, on complète en considérant qu'il y a des 0

			for (i=0; i<num-l; i++) {
				poidsExo = poidsExo*.9 + 1;
			}
			for (i=0; i<l; i++) {
				var note = Number(notesArray[i].note);
				noteExo = noteExo*.9 + note;
				poidsExo = poidsExo*.9 + 1;
			}

			return Math.ceil(noteExo/poidsExo);
		},

		parse: function(data) {
			if (data.id) { data.id = Number(data.id); }
			data.idFiche = Number(data.idFiche);
			var exo_attributes = catalog.get(data.idE);
			if (!exo_attributes) {
				exo_attributes = {
					title: "Exercice inconnu",
					description: "",
					keyWords: [],
					options:{}
				}
			}

			data.options = data.options || {};
			if (typeof data.options =="string") {
				// On convertit en objet
				if (data.options=="") {
					data.options={}
				} else {
					data.options = JSON.parse(data.options);
				}
			}

			data.options = _.mapObject(exo_attributes.options, function(value,key){
				// On initialise chaque option à sa valeur par défaut
				var selectedOption = Number(data.options[key] || 0);
				if (selectedOption<0 || selectedOption>value.options.length) {
					selectedOption = 0;
				}
				var output = _.clone(value);
				output.value = selectedOption;
				return output;
			});

			// Lors d'un new exoFiche, le parse s'éxécute avant que les valeurs par défaut ne soient fournies
			// et on se retrouve avec num et coeff undefined
			// Les valeurs par défaut sont donc imposées ici directement
			data.num = Number(data.num || 1);
			data.coeff = Number(data.coeff || 1);
			data = _.extend(data, _.omit(exo_attributes, "id", "filename", "options"));
			return data;
		},

		toJSON: function() {
			var output = _.clone(_.omit(this.attributes,"title", "options", "description", "keyWords"));
			// options peut être l'objet complet contenant toutes les infos
			// { nomOpt:{ tag:"string", options[strin array], def:number, value:number}, ... }
			// ou seulement la liste des valeurs des différents attributs
			// { nomOpt: number, ... }
			var options = _.mapObject(this.get("options"), function(val,key){
				if (typeof val == "object") {
					return val.value || 0;
				} else {
					return val;
				}
			});
			output.options = JSON.stringify(options);
			return output;
		}
	});

	var API = {
		getEntity: function(id){
			var exofiche = new ExoFiche({id: id});
			var defer = $.Deferred();
			var response = exofiche.fetch();
			response.done(function(){
				defer.resolveWith(response,[exofiche]);
			});
			response.fail(function(){
				defer.rejectWith(response, arguments)
			});
			return defer.promise();
		}
	}

	var channel = Radio.channel('entities');
	channel.reply('exofiche:entity', API.getEntity );


	return ExoFiche;
});
