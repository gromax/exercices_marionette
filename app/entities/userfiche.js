define([], function() {
  var UserFiche;
  UserFiche = Backbone.Model.extend({
    urlRoot: "api/assosUF",
    defaults: {
      nomUser: "",
      prenomUser: "",
      idUser: 0,
      idFiche: 0,
      actif: false
    },
    parse: function(data) {
      if (data.id) {
        data.id = Number(data.id);
      }
      data.idUser = Number(data.idUser);
      data.idFiche = Number(data.idFiche);
      data.nomCompletUser = data.nomUser + " " + data.prenomUser;
      data.actif = (data.actif === "1") || (data.actif === 1) || (data.actif === true);
      if (data.ficheActive) {
        data.ficheActive = (data.ficheActive === "1") || (data.ficheActive === 1) || (data.ficheActive === true);
      }
      return data;
    },
    toJSON: function() {
      return {
        idUser: this.get("idUser"),
        idFiche: this.get("idFiche"),
        actif: this.get("actif")
      };
    },
    getCoeffs: function(aEFsCollec) {
      var exercices_coeff, i, item, len, models;
      exercices_coeff = {};
      if (aEFsCollec) {
        models = aEFsCollec.models;
        for (i = 0, len = models.length; i < len; i++) {
          item = models[i];
          exercices_coeff[item.get("id")] = {
            coeff: item.get("coeff"),
            num: item.get("num")
          };
        }
      }
      return exercices_coeff;
    },
    calcNote: function(aEFs_models_array, notes_json_array) {
      var total, totalCoeff;
      total = aEFs_models_array.reduce(function(memo, item) {
        var notes_of_EF;
        notes_of_EF = _.where(notes_json_array, {
          aEF: item.get("id")
        });
        return item.calcNote(notes_of_EF) * item.get("coeff") + memo;
      }, 0);
      totalCoeff = aEFs_models_array.reduce(function(memo, item) {
        return item.get("coeff") + memo;
      }, 0);
      return Math.ceil(total / totalCoeff);
    },
    cloneEFs: function() {
      var Collec, item, liste, self;
      Collec = Backbone.Collection.extend({
        model: Backbone.Model
      });
      self = this;
      liste = (function() {
        var i, len, ref, results;
        ref = this.get("aEFs").models;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          results.push({
            aEF: item,
            aUF: self
          });
        }
        return results;
      }).call(this);
      return new Collec(liste);
    }
  });
  return UserFiche;
});
