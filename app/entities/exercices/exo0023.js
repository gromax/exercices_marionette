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
        def: inputs,
        forbidden: [
          {
            axe: "x",
            coords: A
          }
        ]
      }).save(inputs);
      return [A, B, mM.droite.par2pts(A, B)];
    },
    getBriques: function(inputs, options) {
      var A, B, droite, eqReduite, ref, xAtex, yAtex;
      ref = this.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
      xAtex = A.x.tex();
      yAtex = A.y.tex();
      eqReduite = droite.reduiteObject();
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur &nbsp; $\\mathbb{R}$.", "$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère.", "On sait que &nbsp; $f\\left(" + xAtex + "\\right) = " + yAtex + "$ &nbsp; et &nbsp; $f'\\left(" + xAtex + "\\right) = " + (droite.m().tex()) + "$.", "Donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $" + xAtex + "$."]
            }, {
              type: "latex-input",
              rank: 2,
              waited: "number",
              tag: "$\\mathcal{T}$",
              answerPreprocessing: function(userValue) {
                var pattern, result;
                pattern = /y\s*=([^=]+)/;
                result = pattern.exec(userValue);
                if (result) {
                  return {
                    processed: result[1],
                    error: false
                  };
                } else {
                  return {
                    processed: userValue,
                    error: "L'équation doit être de la forme y=..."
                  };
                }
              },
              name: "e",
              description: "Équation de la tangente",
              good: eqReduite,
              goodTex: "y = " + (eqReduite.tex()),
              developp: true,
              formes: "FRACTION"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.derivee.tangente
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, droite, ref, xAtex, yAtex;
        ref = that.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
        xAtex = A.x.tex();
        yAtex = A.y.tex();
        return "$a=" + xAtex + "$ &nbsp; : &nbsp; $f(a) = " + yAtex + "$ &nbsp; et &nbsp; $f'(a) = " + (droite.m().tex()) + "$.";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur &nbsp; $\\mathbb{R}$.", "$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère.", "Dans les cas suivants, donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $a$."]
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
        var A, B, droite, ref, xAtex, yAtex;
        ref = that.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
        xAtex = A.x.tex();
        yAtex = A.y.tex();
        return "$a=" + xAtex + "$ &nbsp; : &nbsp; $f(a) = " + yAtex + "$ &nbsp; et &nbsp; $f'(a) = " + (droite.m().tex()) + "$.";
      };
      return {
        children: [
          "On considère une fonction une fonction $f$ dérivable sur $\\mathbb{R}$.", "$\\mathcal{C}$ est sa courbe représentative dans un repère.", "Dans les cas suivants, donnez l'équation de la tangente $\\mathcal{T}$ à la courbe $\\mathcal{C}$ en l'abscisse $a$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
