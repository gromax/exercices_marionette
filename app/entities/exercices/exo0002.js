define(["utils/math", "utils/help"], function(mM, help) {
  return {
    getBriques: function(inputs, options) {
      var A, B, gM, ref;
      ref = this.init(inputs), A = ref[0], B = ref[1], gM = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On se place dans un repère $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."]
            }, {
              type: "input",
              format: [
                {
                  text: "M (",
                  cols: 3,
                  "class": "text-right h4"
                }, {
                  name: "xM",
                  cols: 2,
                  latex: true
                }, {
                  text: ";",
                  cols: 1,
                  "class": "text-center h4"
                }, {
                  name: "yM",
                  cols: 2,
                  latex: true
                }, {
                  text: ")",
                  cols: 1,
                  "class": "h4"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.geometrie.analytique.milieu
            }
          ],
          validations: {
            xM: "number",
            yM: "number"
          },
          verifications: [
            {
              name: "xM",
              tag: "$x_M$",
              good: gM.x
            }, {
              name: "yM",
              tag: "$y_M$",
              good: gM.y
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
