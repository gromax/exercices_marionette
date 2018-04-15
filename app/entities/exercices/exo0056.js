define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var IF, Xhigh, Xlow, esp, n, nf, p, std;
      if (typeof inputs.n === "undefined") {
        n = inputs.n = mM.alea.real({
          min: 40,
          max: 400
        });
      } else {
        n = Number(inputs.n);
      }
      if (typeof inputs.p === "undefined") {
        p = inputs.p = mM.alea.real({
          min: Math.ceil(5 / n * 100),
          max: 19
        });
      } else {
        p = Number(inputs.p);
      }
      esp = n * p / 100;
      std = Math.sqrt(esp * (100 - p) / 100);
      Xlow = esp - 1.96 * std;
      Xhigh = esp + 1.96 * std;
      if (typeof inputs.nf === "undefined") {
        nf = inputs.nf = Math.min(Math.round(Xhigh) + mM.alea.real({
          min: -2,
          max: 2
        }), n);
      } else {
        nf = Number(inputs.nf);
      }
      IF = mM.ensemble.intervalle("[", mM.misc.toPrecision(Xlow / n, 2), mM.misc.toPrecision(Xhigh / n, 2), "]");
      return [p, n, esp, std, Xlow, Xhigh, nf, IF];
    },
    getBriques: function(inputs, options) {
      var IF, Xhigh, Xlow, esp, n, nf, p, ref, std;
      ref = this.init(inputs, options), p = ref[0], n = ref[1], esp = ref[2], std = ref[3], Xlow = ref[4], Xhigh = ref[5], nf = ref[6], IF = ref[7];
      return [
        {
          bareme: 40,
          title: "Loi binomiale",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Une usine fabrique des pièces de laboratoire.", "Le fabriquant affirme que " + p + " % des pièces sont non conformes.", "On prélève au hasard " + n + " pièces dans la production.", "$X$ &nbsp; représente le nombre de pièces non conformes dans un échantillon.", "On sait que &nbsp; $X$ &nbsp; suit une loi &nbsp; $\\mathcal{B}(" + n + "\\,; " + p + "\\,\\%)$.", "Donnez les résultats des calculs suivants :"]
            }, {
              type: "input",
              rank: 2,
              tag: "$E(X)=$",
              name: "esp",
              description: "Espérance à 0,01 près",
              good: esp,
              waited: "number",
              arrondi: -2
            }, {
              type: "input",
              rank: 3,
              tag: "$\\sigma(X)$",
              name: "std",
              description: "Écart-type à 0,01 près",
              good: std,
              waited: "number",
              arrondi: -2
            }, {
              type: "validation",
              rank: 4,
              clavier: []
            }
          ]
        }, {
          bareme: 30,
          title: "Intervalle de fluctuation",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On choisit d'approximer la loi de &nbsp; $X$ &nbsp; par une loi normale.", "Déduisez-en l'intervalle de fluctuation asymptotique, au seuil de 95 %, de la fréquence de pièces non conformes dans un échantillon."]
            }, {
              type: "input",
              rank: 2,
              tag: "$I_F$",
              name: "IF",
              format: [
                {
                  text: "[",
                  cols: 1,
                  "class": "text-right h3"
                }, {
                  name: "low",
                  cols: 2
                }, {
                  text: ";",
                  cols: 1,
                  "class": "text-center h3"
                }, {
                  name: "high",
                  cols: 2
                }, {
                  text: "]",
                  cols: 1,
                  "class": "h3"
                }
              ],
              good: IF,
              waited: "ensemble",
              tolerance: 0.005
            }, {
              type: "validation",
              rank: 4,
              clavier: []
            }
          ]
        }, {
          bareme: 30,
          title: "Décision",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On a obtenu " + nf + " pièces non conformes.", "Faut-il accepter ou rejeter l'affirmation du fabriquant ?"]
            }, {
              type: "radio",
              rank: 2,
              tag: "Décision",
              name: "d",
              radio: ["Accepter", "Refuser"],
              good: (nf >= Xlow) && (nf <= Xhigh) ? 0 : 1
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var IF, Xhigh, Xlow, esp, n, nf, p, ref, std;
        ref = that.init(inputs, options), p = ref[0], n = ref[1], esp = ref[2], std = ref[3], Xlow = ref[4], Xhigh = ref[5], nf = ref[6], IF = ref[7];
        return {
          children: [
            {
              type: "text",
              children: ["$p=" + p + "\\,\\%$ &nbsp; (en %), &nbsp; $n=" + n + "$ &nbsp; et &nbsp; $k=" + nf + "$."]
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "text",
            ps: ["Une usine fabrique des pièces de laboratoire.", "Le fabriquant affirme qu'une proportion &nbsp; $p$ &nbsp; des pièces sont non conformes.", "On prélève au hasard &nbsp; $n$ &nbsp; pièces dans la production.", "Soit &nbsp; $X$ &nbsp; le nombre de pièces non conformes dans un tel échantillon.", "On sait que &nbsp; $X$ &nbsp; suit une loi binomiale.", "Faites les calculs suivants pour les différents cas."]
          }, {
            type: "enumerate",
            enumi: "a",
            children: ["L'espérance &nbsp; $E(X)$ &nbsp; et l'écart-type &nbsp; $\\sigma(X)$", "L'intervalle de fluctuation asymptotique au seuil de 95 \\%", "On a réalisé l'échantillon et obtenu &nbsp; $k$ &nbsp; pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"]
          }, {
            type: "enumerate",
            enumi: "1",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var IF, Xhigh, Xlow, fct_item, k_values, n, nf, p, p_values, ref, that;
      if (inputs_list.length === 1) {
        ref = this.init(inputs_list[0], options), p = ref[0], n = ref[1], nf = ref[2], Xlow = ref[3], Xhigh = ref[4], k_values = ref[5], p_values = ref[6], IF = ref[7];
        return {
          children: [
            "Une usine fabrique des pièces de laboratoire.", "Le fabriquant affirme qu'une proportion $p$ des pièces sont non conformes.", "On prélève au hasard $n$ pièces dans la production.", "Soit $X$ le nombre de pièces non conformes dans un tel échantillon.", "On sait que $X$ suit une loi binomiale.", {
              type: "enumerate",
              enumi: "1",
              children: ["L'espérance $E(X)$ et l'écart-type $\\sigma(X)$", "L'intervalle de fluctuation asymptotique au seuil de 95 \\%", "On a réalisé l'échantillon et obtenu " + nf + " pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), p = ref1[0], n = ref1[1], nf = ref1[2], Xlow = ref1[3], Xhigh = ref1[4], k_values = ref1[5], p_values = ref1[6], IF = ref1[7];
          return "$p=" + p + "$ (en \\%), $n=" + n + "$ et $k=" + nf + "$.";
        };
        return {
          children: [
            "Une usine fabrique des pièces de laboratoire.", "Le fabriquant affirme qu'une proportion $p$ des pièces sont non conformes.", "On prélève au hasard $n$ pièces dans la production.", "Soit $X$ le nombre de pièces non conformes dans un tel échantillon.", "On sait que $X$ suit une loi binomiale.", "Faites les calculs suivants pour les différents cas.", {
              type: "enumerate",
              enumi: "a",
              children: ["L'espérance $E(X)$ et l'écart-type $\\sigma(X)$", "L'intervalle de fluctuation asymptotique au seuil de 95 \\%", "On a réalisé l'échantillon et obtenu $k$ pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"]
            }, {
              type: "enumerate",
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
