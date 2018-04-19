define(["utils/math", "utils/help"], function(mM, help) {
  return {
    getBriques: function(inputs, options) {
      var A, B, enonce, gAB, ref, ref1, zA, zB;
      ref = this.init(inputs), A = ref[0], B = ref[1], gAB = ref[2];
      if (((ref1 = options.a) != null ? ref1.value : void 0) === 1) {
        zA = A.affixe().tex();
        zB = B.affixe().tex();
        enonce = ["Dans le plan complexe, on donne deux points $A$, d'affixe $z_A=" + zA + "$ et $B$, d'affixe $z_B=" + zB + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      } else {
        enonce = ["On se place dans un repère orthonormé $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      }
      return [
        {
          bareme: 100,
          title: "Distance $AB$",
          items: [
            {
              type: "text",
              ps: enonce
            }, {
              type: "input",
              format: [
                {
                  text: "$AB =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "AB"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "sqrt", "pow"]
            }, {
              type: "aide",
              list: help.geometrie.analytique.distance
            }
          ],
          validations: {
            "AB": "number"
          },
          verifications: [
            {
              name: "AB",
              tag: "$AB$",
              good: gAB,
              parameters: {
                formes: "RACINE"
              }
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
      return [A, B, A.toClone().minus(B).norme()];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, ref, that;
      that = this;
      if (((ref = options.a) != null ? ref.value : void 0) === 1) {
        fct_item = function(inputs, index) {
          var A, B, gAB, ref1;
          ref1 = that.init(inputs, options), A = ref1[0], B = ref1[1], gAB = ref1[2];
          return "$z_A = " + (A.affixe().tex()) + "$ &nbsp; et &nbsp; $z_B = " + (B.affixe().tex()) + "$";
        };
        return {
          children: [
            {
              type: "text",
              children: ["On donne les affixes de deux points &nbsp; $A$, &nbsp et &nbsp; $B$.", "Vous devez donner la distance &nbsp; $AB$."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        fct_item = function(inputs, index) {
          var A, B, gAB, ref1;
          ref1 = that.init(inputs, options), A = ref1[0], B = ref1[1], gAB = ref1[2];
          return "$" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$";
        };
        return {
          children: [
            {
              type: "text",
              children: ["On donne les coordonnées de deux points &nbsp; $A$, &nbsp et &nbsp; $B$.", "Vous devez donner la distance &nbsp; $AB$."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    },
    getTex: function(inputs_list, options) {
      var fct_item, ref, that;
      that = this;
      if (((ref = options.a) != null ? ref.value : void 0) === 1) {
        fct_item = function(inputs, index) {
          var A, B, gAB, ref1;
          ref1 = that.init(inputs, options), A = ref1[0], B = ref1[1], gAB = ref1[2];
          return "$z_A = " + (A.affixe().tex()) + "$ et $z_B = " + (B.affixe().tex()) + "$";
        };
        return {
          children: [
            "On donne les affixes de deux points $A$ et $B$.", "Vous devez donner la distance $AB$.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        fct_item = function(inputs, index) {
          var A, B, gAB, ref1;
          ref1 = that.init(inputs, options), A = ref1[0], B = ref1[1], gAB = ref1[2];
          return "$" + (A.texLine()) + "$ et $" + (B.texLine()) + "$";
        };
        return {
          children: [
            "On donne les coordonnées de deux points $A$ et $B$.", "Vous devez donner la distance $AB$.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
