define(["entities/exercices/exercices_catalog"], function(catalog) {
  var ExoFiche;
  ExoFiche = Backbone.Model.extend({
    urlRoot: "api/exosfiche",
    defaults: {
      title: "",
      description: "",
      keyWords: [],
      idE: false,
      num: 1,
      coeff: 1,
      options: {}
    },
    validate: function(attrs, options) {
      var errors;
      errors = {};
      if (!attrs.num) {
        errors.num = "Ne doit pas être vide";
      } else {
        if (!$.isNumeric(attrs.coeff)) {
          errors.num = "Il faut enter un nombre";
        }
      }
      if (!attrs.coeff) {
        errors.coeff = "Ne doit pas être vide";
      } else {
        if (!$.isNumeric(attrs.coeff)) {
          errors.coeff = "Il faut enter un nombre";
        }
      }
      if (!_.isEmpty(errors)) {
        return errors;
      }
    },
    calcNote: function(notesArray) {
      var i, j, k, l, len, n, note, noteExo, num, poidsExo, ref;
      num = Math.max(this.get("num"), 1);
      noteExo = 0;
      poidsExo = 0;
      l = notesArray.length;
      for (i = j = 1, ref = num - l; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        poidsExo = poidsExo * .9 + 1;
      }
      for (k = 0, len = notesArray.length; k < len; k++) {
        n = notesArray[k];
        note = Number(n.note);
        noteExo = noteExo * .9 + note;
        poidsExo = poidsExo * .9 + 1;
      }
      return Math.ceil(noteExo / poidsExo);
    },
    parse: function(data) {
      var exo_attributes, iteratee, ref, ref1, ref2;
      if (data.id) {
        data.id = Number(data.id);
      }
      data.idFiche = Number(data.idFiche);
      exo_attributes = catalog.get(data.idE);
      if (!exo_attributes) {
        exo_attributes = {
          title: "Exercice inconnu",
          description: "",
          keyWords: [],
          options: {}
        };
      }
      data.options = (ref = data.options) != null ? ref : {};
      if (typeof data.options === "string") {
        if (data.options === "") {
          data.options = {};
        } else {
          data.options = JSON.parse(data.options);
        }
      }
      iteratee = function(value, key) {
        var output, ref1, selectedOption;
        selectedOption = Number((ref1 = data.options[key]) != null ? ref1 : 0);
        if (selectedOption < 0 || selectedOption > value.options.length) {
          selectedOption = 0;
        }
        output = _.clone(value);
        output.value = selectedOption;
        return output;
      };
      data.options = _.mapObject(exo_attributes.options, iteratee);
      data.num = Number((ref1 = data.num) != null ? ref1 : 1);
      data.coeff = Number((ref2 = data.coeff) != null ? ref2 : 1);
      data = _.extend(data, _.omit(exo_attributes, "id", "filename", "options"));
      return data;
    },
    toJSON: function() {
      var iteratee, options, output;
      output = _.clone(_.omit(this.attributes, "title", "options", "description", "keyWords"));
      iteratee = function(val, key) {
        var ref;
        if (typeof val === "object") {
          return (ref = val.value) != null ? ref : 0;
        } else {
          return val;
        }
      };
      options = _.mapObject(this.get("options"), iteratee);
      output.options = JSON.stringify(options);
      return output;
    }
  });
  return ExoFiche;
});
