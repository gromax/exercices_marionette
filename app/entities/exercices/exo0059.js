define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var E, X, calcE, calcSup, l, pX, quest;
      if (typeof inputs.E !== "undefined") {
        E = mM.toNumber(inputs.E);
      } else {
        E = mM.alea.real({
          min: 10,
          max: 1000
        });
        inputs.E = String(E);
      }
      l = mM.exec([1, E, "/"]);
      if (typeof inputs.X !== "undefined") {
        X = Number(inputs.X);
      } else {
        X = mM.alea.real({
          min: .5 * E,
          max: 2 * E
        });
        inputs.X = String(X);
      }
      if (typeof inputs.c !== "undefined") {
        calcE = Number(inputs.c);
      } else {
        calcE = mM.alea["in"]([0, 1]);
        inputs.c = String(calcE);
      }
      if (typeof inputs.s !== "undefined") {
        calcSup = Number(inputs.s);
      } else {
        calcSup = mM.alea["in"]([0, 1]);
        inputs.s = String(calcSup);
      }
      if (calcSup === 0) {
        pX = mM.exec([1, X, E, "/", "*-", "exp", "-"]);
      } else {
        pX = mM.exec([X, E, "/", "*-", "exp"]);
      }
      if (calcSup) {
        quest = "p(" + X + " \\leqslant T)";
      } else {
        quest = "$p(T \\leqslant " + X + ")$";
      }
      return [mM.toNumber(E), l, calcE, quest, pX];
    },
    getBriques: function(inputs, options) {
      var E, calcE, enonce, it, l, pX, qP, ref, verif;
      ref = this.init(inputs), E = ref[0], l = ref[1], calcE = ref[2], qP = ref[3], pX = ref[4];
      if (calcE) {
        enonce = ["Le paramètre de cette loi est &nbsp; $\\lambda = " + (l.tex()) + "$.", "Donnez l'espérance."];
        it = {
          type: "input",
          format: [
            {
              text: "$E(T) =$",
              cols: 2,
              "class": "text-right"
            }, {
              latex: true,
              cols: 10,
              name: "q"
            }
          ]
        };
        verif = {
          name: "q",
          tag: "$E(T)$",
          good: E
        };
      } else {
        enonce = ["L'espérance de cette loi est &nbsp; $E(T) = " + (E.tex()) + "$.", "Donnez le paramètre &nbsp; $\\lambda$."];
        it = {
          type: "input",
          format: [
            {
              text: "$\\lambda =$",
              cols: 2,
              "class": "text-right"
            }, {
              latex: true,
              cols: 10,
              name: "q"
            }
          ]
        };
        verif = {
          name: "q",
          tag: "$\\lambda$",
          good: l
        };
      }
      return [
        {
          bareme: 50,
          items: [
            {
              type: "text",
              ps: ["La variable aléatoire &nbsp; $T$ &nbsp; suit une <b>loi exponentielle</b>."].concat(enonce)
            }, it, {
              type: "validation"
            }
          ],
          validations: {
            q: "number"
          },
          verifications: [verif]
        }, {
          bareme: "50",
          title: "Calcul de probabilité",
          items: [
            {
              type: "text",
              ps: ["Calculez à 0,01 près la probabilité &nbsp; $" + qP + "$"]
            }, {
              type: "input",
              tag: "$" + qP + " =$",
              name: "p"
            }, {
              type: "validation"
            }
          ],
          validations: {
            p: "number"
          },
          verifications: [
            {
              name: "p",
              good: pX,
              tag: "$" + qP + "$",
              parameters: {
                arrondi: -2
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
        var E, calcE, l, pX, qP, ref;
        ref = that.init(inputs), E = ref[0], l = ref[1], calcE = ref[2], qP = ref[3], pX = ref[4];
        if (calcE) {
          return "$\\lambda = " + (l.tex()) + "$ &nbsp; et &nbsp; $" + qP + "$";
        } else {
          return "$\\E(T) = " + (E.tex()) + "$ &nbsp; et &nbsp; $" + qP + "$";
        }
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans tous les cas suivants, T suit une loi exponentielle.", "Dans chaque cas, si on vous fournit le paramètre &nbsp; $\\lambda$, calculez l'espérance.", "Si on vous fournit l'espérance, calculez le paramètre.", "Calculez également la probabilité demandée à 0,01 près."]
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
      var E, calcE, fct_item, l, pX, qP, ref, that;
      that = this;
      if (inputs_list.length === 1) {
        ref = that.init(inputs_list[0]), E = ref[0], l = ref[1], calcE = ref[2], qP = ref[3], pX = ref[4];
        if (calcE) {
          return {
            children: [
              "T suit une loi exponentielle de paramètre $\\lambda = " + (l.tex()) + "$.", {
                type: "enumerate",
                children: ["Calculez l'espérance $E(T)$ de cette loi.", "Calculez à 0,01 près la probabilité $" + qP + "$."]
              }
            ]
          };
        } else {
          return {
            children: [
              "T suit une loi exponentielle d'espérance $E(T)=" + (E.tex()) + "$.", {
                type: "enumerate",
                children: ["Calculez le paramètre $\\lambda$ de cette loi.", "Calculez à 0,01 près la probabilité $" + qP + "$."]
              }
            ]
          };
        }
      } else {
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs), E = ref1[0], l = ref1[1], calcE = ref1[2], qP = ref1[3], pX = ref1[4];
          if (calcE) {
            return "$\\lambda = " + (l.tex()) + "$ et $" + qP + "$";
          } else {
            return "$\\E(T) = " + (E.tex()) + "$ et $" + qP + "$";
          }
        };
        return {
          children: [
            "Dans tous les cas suivants, T suit une loi exponentielle.", "Dans chaque cas, si on vous fournit le paramètre $\\lambda$, calculez l'espérance.", "Si on vous fournit l'espérance, calculez le paramètre.", "Calculez également la probabilité demandée à 0,01 près.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
