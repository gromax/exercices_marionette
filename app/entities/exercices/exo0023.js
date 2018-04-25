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
              ps: ["On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur &nbsp; $\\mathbb{R}$.", "$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère.", "On sait que &nbsp; $f\\left(" + xAtex + "\\right) = " + yAtex + "$ &nbsp; et &nbsp; $f'\\left(" + xAtex + "\\right) = " + (droite.m().tex()) + "$.", "Donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $" + xAtex + "$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\mathcal{T} :$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "e"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.derivee.tangente
            }
          ],
          validations: {
            e: function(user) {
              var out, pattern, result;
              pattern = /y\s*=([^=]+)/;
              result = pattern.exec(userValue);
              if (result) {
                out = mM.verification.numberValidation(result, {});
                out.user = user;
              } else {
                out = {
                  processed: false,
                  user: user,
                  error: "L'équation doit être de la forme y=..."
                };
              }
              return out;
            }
          },
          verifications: [
            function(data) {
              var list, out, ver;
              ver = mM.verification.isSame(data.e.processed, eqReduite, {
                developp: true,
                formes: "FRACTION"
              });
              if (ver.note === 0) {
                ver.goodMessage = {
                  type: "error",
                  text: "La bonne réponse était &nbsp; $y = " + (eqReduite.tex()) + "$."
                };
              }
              list = [
                {
                  type: "normal",
                  text: "<b>" + tag + "</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $y = " + data.e.processed.tex + "$"
                }, ver.goodMessage
              ];
              return out = {
                note: ver.note,
                add: {
                  type: "ul",
                  list: list.concat(ver.errors)
                }
              };
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
