define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs
      }).save(inputs);
      return [A, B, B.toClone("\\overrightarrow{AB}").am(A, true).simplify()];
    },
    getBriques: function(inputs, options) {
      var A, B, gAB, ref;
      ref = this.init(inputs), A = ref[0], B = ref[1], gAB = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On se place dans un repère &nbsp; $(O;I,J)$.", "On donne deux points &nbsp; $" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de &nbsp; $\\overrightarrow{AB}$."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              name: "x",
              description: "Abscisse du vecteur",
              tag: "$x_{\\overrightarrow{AB}}$",
              good: gAB.x
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              name: "y",
              description: "Ordonnée du vecteur",
              tag: "$y_{\\overrightarrow{AB}}$",
              good: gAB.y
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 5,
              list: help.vecteur.coordonnes
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, gAB, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], gAB = ref[2];
        return "$" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$.", "Donnez les coordonnées du vecteur &nbsp; $\\overrightarrow{AB}$."]
          }, {
            type: "enumerate",
            refresh: true,
            enumi: "1",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, gAB, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], gAB = ref[2];
        return "$" + (A.texLine()) + "$ et $" + (B.texLine()) + "$";
      };
      return {
        children: [
          "On donne les coordonnées de deux points $A$ et $B$.", "Donnez les coordonnées du vecteur $\\overrightarrow{AB}$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
