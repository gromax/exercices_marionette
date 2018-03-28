define(["utils/math", "utils/help"], function(mM, help) {
  return {
    getBriques: function(inputs, options) {
      var A, B, gM, ref;
      ref = this.init(inputs), A = ref[0], B = ref[1], gM = ref[2];
      return [
        {
          bareme: 100,
          title: "Coordonnées de $M$",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On se place dans un repère $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."]
            }, {
              type: "input",
              rank: 2,
              tag: "$x_M$",
              name: "xM",
              description: "Abscisse de M",
              good: gM.x,
              waited: "number"
            }, {
              type: "input",
              rank: 3,
              tag: "$y_M$",
              name: "yM",
              description: "Ordonnée de M",
              good: gM.y,
              waited: "number"
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 5,
              list: help.geometrie.analytique.milieu
            }
          ]
        }
      ];
    },
    init: function(inputs) {
      var A, B;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      return [A, B, A.milieu(B, "M")];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, gM, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], gM = ref[2];
        return "$" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$.", "Vous devez donner les coordonnées du milieu de &nbsp; $[AB]$."]
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
        var A, B, gM, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], gM = ref[2];
        return "$" + (A.texLine()) + "$ et $" + (B.texLine()) + "$";
      };
      return {
        children: [
          "On donne les coordonnées de deux points $A$ et $B$.", "Vous devez donner les coordonnées du milieu de $[AB]$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
