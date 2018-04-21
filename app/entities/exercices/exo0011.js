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
              ps: ["On cherche les valeurs de &nbsp; $x$ &nbsp; et &nbsp; $y$ &nbsp; telles que &nbsp; $x+y=" + (S.tex()) + "$ &nbsp; et &nbsp; $x\\cdot y =" + (P.tex()) + "$.", "On sait que &nbsp; $x$ &nbsp; $y$ &nbsp; sont alors les solutions d'une équation du second degré.", "Donnez cette équation."]
            }, {
              type: "input",
              format: [
                {
                  text: "Équation :",
                  cols: 3,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 7,
                  name: "poly"
                }, {
                  text: "$= 0$",
                  cols: 2
                }
              ]
            }, {
              type: "validation",
              clavier: ["pow", "sqrt"]
            }
          ],
          validations: {
            poly: "number"
          },
          verifications: [
            function(data) {
              var list, params, ver;
              params = {
                goodTex: polyTex + "=0",
                developp: true,
                formes: "FRACTION"
              };
              ver = mM.verification.isSame(data[verifItem.name].processed, poly.toNumberObject(), params);
              list = [
                {
                  type: "normal",
                  text: "<b>Équation</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $" + data.poly.processed.tex + " = 0$"
                }, ver.goodMessage
              ];
              return {
                note: ver.note,
                add: {
                  type: "ul",
                  list: list.concat(ver.errors)
                }
              };
            }
          ]
        }, {
          bareme: 60,
          items: [
            {
              type: "text",
              ps: ["Donnez les solutions de &nbsp; $=" + polyTex + " = 0$.", "Séparez les solutions par ; s'il y en a plusieurs.", "Répondez &nbsp; $\\varnothing$ &nbsp; s'il n'y en a pas."]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\mathcal{S} = $",
                  cols: 2,
                  "class": "text-right"
                }, {
                  name: "solutions",
                  cols: 10,
                  latex: true
                }
              ]
            }, {
              type: "validation",
              clavier: ["empty", "sqrt", "aide"]
            }, {
              type: "aide",
              list: help.trinome.racines
            }
          ],
          validations: {
            solutions: "liste"
          },
          verifications: [
            {
              type: "all",
              good: racines,
              name: "solutions",
              tag: "$\\mathcal{S}$"
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
