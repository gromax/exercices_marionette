define([], function() {
  var Controller;
  Controller = {
    list: [
      {
        id: 1,
        title: "Équation de droite",
        description: "Déterminer l'équation d'une droite passant par deux points.",
        keyWords: ["Géométrie", "Droite", "Équation", "Seconde"]
      }, {
        id: 2,
        title: "Milieu d'un segment",
        description: "Calculer les coordonnées du milieu d'un segment.",
        keyWords: ["Géométrie", "Repère", "Seconde"]
      }, {
        id: 3,
        title: "Symétrique d'un point",
        description: "Calculer les coordonnées du symétrique d'un point par rapport à un autre point.",
        keyWords: ["Géométrie", "Repère", "Seconde"]
      }
    ],
    get: function(id) {
      var exo, idExo;
      idExo = Number(id);
      return ((function() {
        var i, len, ref, results;
        ref = this.list;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          exo = ref[i];
          if (exo.id === idExo) {
            results.push(exo);
          }
        }
        return results;
      }).call(this))[0];
    },
    all: function() {
      return this.list;
    }
  };
  return Controller;
});
