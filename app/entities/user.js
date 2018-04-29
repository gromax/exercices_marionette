define([], function() {
  var User;
  User = Backbone.Model.extend({
    urlRoot: "api/users",
    defaults: {
      prenom: "",
      nom: "",
      email: "",
      nomClasse: "N/A",
      rank: "Off"
    },
    parse: function(data) {
      if (data.id) {
        data.id = Number(data.id);
      }
      if (data.idClasse) {
        data.idClasse = Number(data.idClasse);
      }
      if (data.nomClasse === null) {
        data.nomClasse = "N/A";
      }
      data.nomComplet = data.nom + " " + data.prenom;
      data.isEleve = data.rank === "Élève";
      return data;
    },
    testClasseMdp: function(mdp) {
      var promise;
      promise = $.ajax("api/classes/" + (this.get('idClasse')) + "/test", {
        data: {
          pwd: mdp
        },
        dataType: "json",
        method: "GET"
      });
      return promise;
    },
    validate: function(attrs, options) {
      var errors, re;
      errors = {};
      if (!attrs.prenom) {
        errors.prenom = "Ne doit pas être vide";
      }
      if (!attrs.nom) {
        errors.nom = "Ne doit pas être vide";
      } else {
        if (attrs.nom.length < 2) {
          errors.nom = "Trop court";
        }
      }
      if (!attrs.email) {
        errors.email = "Ne doit pas être vide";
      } else {
        if (this.get("rank") !== "Root") {
          re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(attrs.email)) {
            errors.email = "L'email n'est pas valide";
          }
        }
      }
      if (!_.isEmpty(errors)) {
        return errors;
      }
    }
  });
  return User;
});
