define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var a, b, expr, l, q, r, u0, values;
      u0 = false;
      if (typeof inputs.v !== "undefined") {
        values = inputs.v.split(";");
        q = (900 + Number(values[0])) / 1000;
        if (values.length === 3) {
          a = Number(values[1]);
          b = Number(values[2]);
          r = false;
        } else {
          u0 = Number(values[1]);
          r = true;
        }
      } else {
        r = mM.alea.dice(1, 2);
        values = [];
        values[0] = mM.alea.real({
          min: 0,
          max: 200
        });
        q = 900 + values[0];
        if (r) {
          u0 = values[1] = mM.alea.real({
            min: 1,
            max: 20
          });
        } else {
          a = values[1] = mM.alea.real({
            min: 1,
            max: 20
          });
          b = values[2] = mM.alea.real({
            min: 5,
            max: 20,
            sign: true
          });
        }
        inputs.v = values.join(";");
      }
      if (r) {
        expr = "u_{n+1} = " + (mM.exec([q / 1000, "symbol:u_n", "*"]).tex());
        switch (false) {
          case !(q > 1000):
            l = mM.exec(["infini"]);
            break;
          case q !== 1:
            l = mM.exec([u0]);
            break;
          default:
            l = mM.exec([0]);
        }
      } else {
        expr = "u_n = " + (mM.exec([a, b, q / 1000, "symbol:n", "^", "*", "+"]).tex());
        switch (false) {
          case !(q > 1000):
            l = mM.exec(["infini"]);
            break;
          case q !== 1:
            l = mM.exec([a, b, "+"]);
            break;
          default:
            l = mM.exec([a]);
        }
      }
      return [expr, l, u0];
    },
    getBriques: function(inputs, options) {
      var expr, lim, ref, u0;
      ref = this.init(inputs), expr = ref[0], lim = ref[1], u0 = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On considère la suite &nbsp; $\\left(u_n\\right)$.", u0 === false ? "Son expression est &nbsp; $" + expr + "$." : "Son premier terme est &nbsp; $u_0 = " + u0 + "$ &nbsp; et &nbsp; $" + expr + "$.", "Donnez la limite de cette suite quand &nbsp; $n\\to +\\infty$.", "On notera &nbsp; $u_{\\infty}$ &nbsp; cette limite.", "Déterminez &nbsp; $u_{\\infty}$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$u_{\\infty}=$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  cols: 10,
                  name: "l"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "infini"]
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
              tag: "$u_{\\infty}$",
              good: lim
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
