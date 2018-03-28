define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var P, S, poly, x1, x2;
      if ((typeof inputs.S !== "undefined") && (typeof inputs.P !== "undefined")) {
        S = mM.toNumber(inputs.S);
        P = mM.toNumber(inputs.P);
      } else {
        x1 = x2 = mM.alea.real({
          min: -40,
          max: 40
        });
        while (x2 === x1) {
          x2 = mM.alea.real({
            min: -40,
            max: 40
          });
        }
        S = mM.toNumber(inputs.S = x1 + x2);
        P = mM.toNumber(inputs.P = x1 * x2);
      }
      poly = mM.polynome.make({
        coeffs: [P.toClone(), S.toClone().opposite(), 1]
      });
      return [
        S, P, poly, poly.tex(), mM.polynome.solve.exact(poly, {
          y: 0
        })
      ];
    },
    getBriques: function(inputs, options) {
      var P, S, poly, polyTex, racines, ref;
      ref = this.init(inputs), S = ref[0], P = ref[1], poly = ref[2], polyTex = ref[3], racines = ref[4];
      return [
        {
          bareme: 40,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On cherche les valeurs de &nbsp; $x$ &nbsp; et &nbsp; $y$ &nbsp; telles que &nbsp; $x+y=" + (S.tex()) + "$ &nbsp; et &nbsp; $x\\cdot y =" + (P.tex()) + "$.", "On sait que &nbsp; $x$ &nbsp; $y$ &nbsp; sont alors les solutions d'une équation du second degré.", "Donnez cette équation."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "(E)",
              answerPreprocessing: function(userValue) {
                var pattern, result;
                pattern = /([^=]+)=\s*0/;
                result = pattern.exec(userValue);
                if (result) {
                  return {
                    processed: result[1],
                    error: false
                  };
                } else {
                  return {
                    processed: userValue,
                    error: "L'équation doit être de la forme ... = 0"
                  };
                }
              },
              name: "poly",
              description: "Équation à résoudre",
              good: poly.toNumberObject(),
              goodTex: polyTex + "=0",
              developp: true,
              formes: "FRACTION"
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        }, {
          bareme: 60,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Donnez les solutions de &nbsp; $=" + polyTex + " = 0$.", "Séparez les solutions par ; s'il y en a plusieurs.", "Répondez &nbsp; $\\varnothing$ &nbsp; s'il n'y en a pas."]
            }, {
              type: "input",
              rank: 2,
              waited: "liste:number",
              tag: "$\\mathcal{S}$",
              name: "solutions",
              description: "Solutions",
              good: racines
            }, {
              type: "validation",
              rank: 3,
              clavier: ["empty", "sqrt", "aide"]
            }, {
              type: "aide",
              rank: 4,
              list: help.trinome.racines
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var P, S, poly, polyTex, racines, ref;
        ref = this.init(inputs), S = ref[0], P = ref[1], poly = ref[2], polyTex = ref[3], racines = ref[4];
        return "$x+y = " + (S.tex()) + "$ &nbsp; et &nbsp; $x\\cdot y = " + (P.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans tous les cas, on donne la somme et le produit de deux nombres &nbsp; $x$ &nbsp; et &nbsp; $y$.", "Donnez ces nombres, s'ils existent."]
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
        var P, S, poly, polyTex, racines, ref;
        ref = this.init(inputs), S = ref[0], P = ref[1], poly = ref[2], polyTex = ref[3], racines = ref[4];
        return "$x+y = " + (S.tex()) + "$ et $x\\cdot y = " + (P.tex()) + "$";
      };
      return {
        children: [
          "Dans tous les cas, on donne la somme et le produit de deux nombres $x$ et $y$.", "Donnez ces nombres, s'ils existent.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
