define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var f;
      if (inputs.f == null) {
        inputs.f = (mM.alea.real({
          min: 1,
          max: 50
        })) + " " + (mM.alea["in"](["cos", "sin"])) + "(" + (mM.alea.real({
          min: 0,
          max: 30,
          sign: true
        })) + " t " + (mM.alea["in"](["+", "-"])) + " " + (mM.alea.real({
          min: 0,
          max: 30
        })) + ")";
      }
      return [f = mM.toNumber(inputs.f).simplify(), f.derivate("t"), "f: t \\mapsto " + (f.tex())];
    },
    getBriques: function(inputs, options) {
      var f, fDer, fTex, ref;
      ref = this.init(inputs), f = ref[0], fDer = ref[1], fTex = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On considère la fonction &nbsp; $" + fTex + "$.", "Vous devez donner l'expression de sa dérivée.", "<b>Attention :</b> La variable choisie est &nbsp; $t$ &nbsp; et pas &nbsp; $x$ &nbsp; !"]
            }, {
              type: "input",
              format: [
                {
                  text: "$f'(t) =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "u"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.trigo.derivee
            }
          ],
          validations: {
            u: "number"
          },
          verifications: [
            {
              name: "u",
              tag: "$f'(t)$",
              good: fDer,
              parameters: {
                forme: {
                  fraction: true
                }
              }
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var f, fDer, fTex, ref;
        ref = that.init(inputs, options), f = ref[0], fDer = ref[1], fTex = ref[2];
        return "$" + fTex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez la dérivée des fonctions suivantes :"]
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
        var f, fDer, fTex, ref;
        ref = that.init(inputs, options), f = ref[0], fDer = ref[1], fTex = ref[2];
        return "$" + fTex + "$";
      };
      return {
        children: [
          "Donnez la dérivée des fonctions suivantes :", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
