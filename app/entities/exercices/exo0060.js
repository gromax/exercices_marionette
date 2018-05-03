define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, a, b, q, s, values;
      if (typeof inputs.v !== "undefined") {
        values = inputs.v.split(";");
        q = (900 + Number(values[0])) / 1000;
        A = Number(values[1]);
        a = Number(values[2]);
        b = Number(values[3]);
        s = Number(values[4]);
      } else {
        values = [];
        values[0] = mM.alea.real({
          min: 0,
          max: 99
        });
        q = 900 + values[0];
        A = values[1] = mM.alea.real({
          min: 10,
          max: 100
        });
        a = values[2] = mM.alea.real({
          min: 1,
          max: 20
        });
        b = values[3] = mM.alea.real({
          min: 5,
          max: 20
        });
        s = values[4] = mM.alea["in"]([90, 95, 99]);
        inputs.v = values.join(";");
      }
      return [mM.exec([A, a, b, q / 1000, "symbol:n", "^", "*", "-", "*"]).tex(), A * a, s, Math.ceil(Math.log(a / b * (100 - s) / 100) / Math.log(q / 1000))];
    },
    getBriques: function(inputs, options) {
      var expr, lim, nLim, ref, seuil;
      ref = this.init(inputs), expr = ref[0], lim = ref[1], seuil = ref[2], nLim = ref[3];
      return [
        {
          bareme: 30,
          items: [
            {
              type: "text",
              ps: ["On considère la suite d'expression &nbsp; $A_n = " + expr + "$.", "$n$ &nbsp; est un entier naturel.", "On note &nbsp; $A_{\\infty} = \\displaystyle \\lim_{n\\to +\\infty} A_n$.", "Déterminez &nbsp; $A_{\\infty}$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$A_{\\infty}=$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  cols: 10,
                  name: "l"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: ["L'expression contient un terme de forme &nbsp; $q^n$ &nbsp; avec &nbsp; $0 < q < 1$. On sait que dans ce cas &nbsp; $q^n \\to 0$."]
            }
          ],
          validations: {
            l: "number"
          },
          verifications: [
            {
              name: "l",
              tag: "$A_{\\infty}$",
              good: lim
            }
          ]
        }, {
          bareme: 70,
          title: "Seuil",
          items: [
            {
              type: "text",
              ps: ["La quantité &nbsp; $A_n$ &nbsp; est croissante.", "Donnez l'entier &nbsp; $n$ &nbsp; à partir duquel &nbsp; $A_n \\geqslant " + seuil + "\\% A_{\\infty}$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$n =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  cols: 10,
                  name: "n"
                }
              ]
            }, {
              type: "validation"
            }
          ],
          validations: {
            n: "number"
          },
          verifications: [
            {
              name: "n",
              good: nLim,
              tag: "$n$"
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var expr, lim, nLim, ref, seuil;
        ref = that.init(inputs), expr = ref[0], lim = ref[1], seuil = ref[2], nLim = ref[3];
        return "$A_n = " + expr + "$ &nbsp; et seuil &nbsp; $S = " + seuil + "\\% A_{\\infty}$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans chaque cas suivants, on considère une suite croissante &nbsp; $\\left(A_n\\right)$ &nbsp; dont l'expression est donnée.", "Il faut donner la limite de la suite pour &nbsp; $n\\to +\\infty$. Cette limite est notée &nbsp; $A_{\\inty}$.", "Il faut également donner l'entier minimum pour lequel le seuil est dépassé : &nbsp; $A_n \\geqslant S"]
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
      var expr, fct_item, lim, nLim, ref, seuil, that;
      that = this;
      if (inputs_list.length === 1) {
        ref = that.init(inputs_list[0]), expr = ref[0], lim = ref[1], seuil = ref[2], nLim = ref[3];
        return {
          children: [
            "On considère la suite croissante d'expression &A_n = " + expr + "$.", {
              type: "enumerate",
              children: ["Donnez $A_{\\infty} = \\displaystyle \\lim_{n\\to +\\infty} A_n$.", "Donnez le plus petit entier $n$ pour lequel $A_n \\geqslant " + seuil + "\\% A_{\\infty}$."]
            }
          ]
        };
      } else {
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs), expr = ref1[0], lim = ref1[1], seuil = ref1[2], nLim = ref1[3];
          return "$A_n = " + expr + "$ et seuil $S = " + seuil + "\\% A_{\\infty}$";
        };
        return {
          children: [
            "Dans chaque cas suivants, on considère une suite croissante $\\left(A_n\\right)$ dont l'expression est donnée.", "Il faut donner la limite de la suite pour $n\\to +\\infty$. Cette limite est notée $A_{\\inty}$.", "Il faut également donner l'entier minimum pour lequel le seuil est dépassé : $A_n \\geqslant S", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
