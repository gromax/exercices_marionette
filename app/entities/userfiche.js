define([], function(){
	var UserFiche = Backbone.Model.extend({
		urlRoot: "api/assosUF",
		defaults: {
			nomUser: "",
			prenomUser: "",
			idUser: 0,
			idFiche: 0,
			actif:false,
		},

		parse: function(data){
			if (data.id) { data.id = Number(data.id); }
			data.idUser = Number(data.idUser);
			data.idFiche = Number(data.idFiche);
			data.nomCompletUser = data.nomUser+" "+data.prenomUser;
			data.actif = (data.actif == "1") || (data.actif==1) || (data.actif===true);
			if (data.ficheActive) {
				data.ficheActive = (data.ficheActive == "1") || (data.ficheActive==1) || (data.ficheActive===true);
			}
			return data;
		},

		toJSON: function(){
			return {
				idUser:this.get("idUser"),
				idFiche:this.get("idFiche"),
				actif:this.get("actif"),
			}
		},

		getCoeffs: function(aEFsCollec) {
			var exercices_coeff={}
			if (aEFsCollec) {
				var models = aEFsCollec.models;
				for (item of models){
					exercices_coeff[item.get("id")] = { coeff:item.get("coeff"), num:item.get("num") };
				}
			}
			return exercices_coeff;
		},

		calcNote: function(aEFs_models_array, notes_json_array) {
			var total = _.reduce(aEFs_models_array,function(memo, item){
				var notes_of_EF = _.where(notes_json_array, { aEF: item.get("id") });
				return item.calcNote(notes_of_EF)*item.get("coeff")+ memo;
			}, 0);
			var totalCoeff = _.reduce(aEFs_models_array, function(memo,item){
				return item.get("coeff") + memo;
			},0);
			return Math.ceil(total/totalCoeff);
		},

		cloneEFs: function() {
			// La collection des exercices est liée une fiche devoir et non
			// à une fiche userfiche. Elle peut notamment être commune
			// mais à fin d'affichage des EF dans le cadre d'un userfiche, je prévois de générer une collection ad hoc

			var Collec = Backbone.Collection.extend({
				model: Backbone.Model
			});
			var self = this;
			var liste = _.map(this.get("aEFs").models,function(item){
				return { aEF:item, aUF:self };
			});
			return new Collec(liste);
		}
	});

// Comme je compte mettre en cache les requêtes, il me semble impossible de faire la requête d'une userfiche
// indépendamment de la collection. En effet, si d'un côté j'ai des models userfiches dans la collection
// et que d'un autre je charge un userfiche indépendamment, l'outil de cache ne va pas comprendre qu'il peut
// piocher le model directement dans la collection déjà en cache et on aura alors travail sur deux copies
// indépendantes d'un même objet qui évolueront séparément tout le temps du cache





	return UserFiche;
});
