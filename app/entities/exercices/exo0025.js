define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var IF, Xdeb, Xdeb2, Xfin, Xfin2, Xhigh, Xlow, fhigh, flow, i, j, k, k_values, l, n, nf, p, p_values, ref, results, results1, results2;
      if (typeof inputs.n === "undefined") {
        n = inputs.n = mM.alea.real({
          min: 20,
          max: 100
        });
      } else {
        n = Number(inputs.n);
      }
      if (typeof inputs.p === "undefined") {
        p = inputs.p = mM.alea.real({
          min: 1,
          max: 19
        });
      } else {
        p = Number(inputs.p);
      }
      if (typeof inputs.nf === "undefined") {
        nf = inputs.nf = Math.min(Xhigh + mM.alea.real({
          min: -2,
          max: 2
        }), n);
      } else {
        nf = Number(inputs.nf);
      }
      ref = mM.intervalle_fluctuation.binomial(n, p / 100), Xlow = ref.Xlow, Xhigh = ref.Xhigh;
      Xdeb = Math.max(Xlow - mM.alea.real({
        min: 1,
        max: 3
      }), 0);
      Xfin = Math.min(Xlow + mM.alea.real({
        min: 1,
        max: 3
      }), Xhigh);
      Xdeb2 = Math.max(Xhigh - mM.alea.real({
        min: 1,
        max: 3
      }), Xlow);
      Xfin2 = Math.min(Xhigh + mM.alea.real({
        min: 1,
        max: 3
      }), n);
      if (Xdeb2 <= Xfin) {
        k_values = (function() {
          results = [];
          for (var i = Xdeb; Xdeb <= Xfin2 ? i <= Xfin2 : i >= Xfin2; Xdeb <= Xfin2 ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this);
      } else {
        k_values = (function() {
          results2 = [];
          for (var l = Xdeb; Xdeb <= Xfin ? l <= Xfin : l >= Xfin; Xdeb <= Xfin ? l++ : l--){ results2.push(l); }
          return results2;
        }).apply(this).concat((function() {
          results1 = [];
          for (var j = Xdeb2; Xdeb2 <= Xfin2 ? j <= Xfin2 : j >= Xfin2; Xdeb2 <= Xfin2 ? j++ : j--){ results1.push(j); }
          return results1;
        }).apply(this));
      }
      p_values = (function() {
        var len, m, results3;
        results3 = [];
        for (m = 0, len = k_values.length; m < len; m++) {
          k = k_values[m];
          results3.push(numToStr(mM.repartition.binomial(n, p / 100, k), 3));
        }
        return results3;
      })();
      flow = Xlow / n;
      fhigh = Xhigh / n;
      IF = mM.ensemble.intervalle("[", fixNumber(flow, 2), fixNumber(fhigh, 2), "]");
      return [p, n, nf, Xlow, Xhigh, k_values, p_values, IF];
    },
    getBriques: function(inputs, options) {
      var IF, Xhigh, Xlow, k_values, n, nf, p, p_values, ref;
      ref = this.init(inputs, options), p = ref[0], n = ref[1], nf = ref[2], Xlow = ref[3], Xhigh = ref[4], k_values = ref[5], p_values = ref[6], IF = ref[7];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Une usine fabrique des tuyaux en caoutchouc.", "Le fabriquant affirme que " + p + " % des tuyaux sont poreux. On prélève " + n + " tuyaux dans la production.", "On obtient " + nf + " tuyaux poreux.", "Donnez les résultats des calculs suivants :"]
            }, {
              type: "input",
              rank: 2,
              tag: "$E(X)=$",
              name: "esp",
              description: "Espérance à 0,01 près",
              good: n * p / 100,
              waited: "number",
              arrondi: -2
            }, {
              type: "input",
              rank: 3,
              tag: "$\\sigma(X)$",
              name: "std",
              description: "Écart-type à 0,001 près",
              good: Math.sqrt(n * p * (100 - p)) / 100,
              waited: "number",
              arrondi: -2
            }, {
              type: "text",
              rank: 4,
              ps: ["On cherche les bornes de l'intervalle de fluctuation.", "Pour cela on va chercher &nbsp; $a$, c'est à dire la valeur de &nbsp; $k$ &nbsp; pour laquelle &nbsp; $P(X\\leqslant k)$ &nbsp; dépasse strictement &nbsp; $0,025=2,5\\,\\%$, et &nbsp; $b$, c'est à dire la valeur de &nbsp; $k$ &nbsp; pour laquelle &nbsp; $P(X\\leqslant k)$ &nbsp; dépasse ou atteint $0,975=97,5\\,\\%$.", "On sait que &nbsp; $a$ &nbsp; doit être proche de &nbsp; $E(X)-2\\sigma(X)$ &nbsp; et que &nbsp; $b$ &nbsp; doit être proche de &nbsp; $E(X)+2\\sigma(X)$", "On donne le tableau suivant (pour faire gagner du temps car les valeurs du tableau peuvent être obtenues avec une calculatrice)"]
            }, {
              type: "tableau",
              rank: 5,
              entetes: false,
              lignes: [_.flatten(["$k$", k_values]), _.flatten(["$p(X\\leqslant k)$", p_values])]
            }, {
              type: "input",
              rank: 4,
              tag: "$a$",
              name: "a",
              description: "Borne inférieure",
              good: Xlow,
              waited: "number"
            }, {
              type: "input",
              rank: 5,
              tag: "$b$",
              name: "b",
              description: "Borne supérieure",
              good: Xhigh,
              waited: "number"
            }, {
              type: "input",
              rank: 6,
              tag: "$I_F$",
              name: "IF",
              description: "Intervalle de fluctuation à 0,01 près",
              good: IF,
              waited: "ensemble",
              tolerance: 0.005
            }, {
              type: "text",
              rank: 7,
              ps: ["On a obtenu " + nf + " tuyaux poreux.", "Faut-il accepter ou rejeter l'affirmation du fabriquant ?"]
            }, {
              type: "radio",
              rank: 8,
              tag: "Décision",
              name: "d",
              radio: ["Accepter", "Refuser"],
              good: (nf >= Xlow) && (nf <= Xhigh) ? 0 : 1
            }, {
              type: "validation",
              rank: 9,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 10,
              list: ["Épreuve élémentaire : Prélever un tuyau ; succès : Le tuyau est poreux ; probabilité du succès : &nbsp; $p=" + p + "\\,\\%$", "L'expérience est répétée &nbsp; $n=" + n + "$ &nbsp; fois de façon indépendante (production assez importante).", "$X$ &nbsp; est le nombre de succès (tuyaux poreux). On peut donc dire que &nbsp; $X$ &nbsp; suit une loi binomiale &nbsp; $\\mathcal{B}(" + n + " ; " + p + "\\,\\%)$.", "L'espérance est la valeur attendue. Si on a un fréquence &nbsp; $p\\,\\%$ &nbsp; de tuyaux poreux dans la production, si on prélève &nbsp; $n$ &nbsp; tuyaux, on s'attend à obtenir &nbsp; $E(X)=n\\times p$ &nbsp; tuyaux poreux en moyenne.", "Naturellement, le nombre de tuyau réellement obtenu dans un prélèvement va varier aléatoirement. Pour un résultat donné, pour savoir s'il est loin ou proche de la valeur attendue, on utilise l'écart-type qui se cacule : &nbsp; $\\sigma(X)=\\sqrt{np(1-p)}$. Jusqu'à &nbsp; $2\\sigma$, on est assez proche de la valeur espérée. Au-delà de &nbsp; $2\\sigma$, on est loin."].concat(help.proba.binomiale.IF_1)
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var IF, Xhigh, Xlow, k_values, n, nf, p, p_values, ref;
        ref = that.init(inputs, options), p = ref[0], n = ref[1], nf = ref[2], Xlow = ref[3], Xhigh = ref[4], k_values = ref[5], p_values = ref[6], IF = ref[7];
        return {
          children: [
            {
              type: "text",
              children: ["$p=" + p + "$ &nbsp; (en %), &nbsp; $n=" + n + "$ &nbsp; et &nbsp; $k=" + nf + "$.", "Pour vous aider, on donne les résultats suivants :"]
            }, {
              type: "tableau",
              lignes: [_.flatten(["$k$", k_values]), _.flatten(["$p(X\\leqslant k)$", p_values])]
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "text",
            ps: ["Une usine fabrique des tuyaux en caoutchouc.", "Le fabriquant affirme que &nbsp; $p\\,\\%$ &nbsp; des tuyaux sont poreux.", "On prélève &nbsp; $n$ &nbsp; tuyaux dans la production.", "On obtient &nbsp; $k$ &nbsp; tuyaux poreux.", "Soit &nbsp; $X$ &nbsp; le nombre de tuyau poreux dans un tel échantillon.", "Pour les différentes valeurs de &nbsp; $p$, &nbsp; $n$ &nbsp; et &nbsp; $k$, déterminez :"]
          }, {
            type: "enumerate",
            enumi: "a",
            children: ["L'espérance &nbsp; $E(X)$ &nbsp; et l'écart-type &nbsp; $\\sigma(X)$", "L'intervalle de fluctuation au seuil de 95 \\%", "Considérant la valeur de &nbsp; $k$, l'affirmation doit-elle être acceptée/rejetée ?"]
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
            {
              type: "text",
              ps: ["Une usine fabrique des tuyaux en caoutchouc.", "Le fabriquant affirme que " + p + " \\% des tuyaux sont poreux.", "On prélève " + n + " tuyaux dans la production.", "Soit $X$ le nombre de tuyau poreux dans un tel échantillon."]
            }, {
              type: "tableau",
              lignes: [_.flatten(["$k$", k_values]), _.flatten(["$p(X\\leqslant k)$", p_values])]
            }, {
              type: "enumerate",
              enumi: "1",
              children: ["Calculez l'espérance $E(X)$ et l'écart-type $\\sigma(X)$", "Déterminez l'intervalle de fluctuation au seuil de 95 \\%. Aidez-vous du tableau ci-dessus.", "On a prélevé un échantillon et on a trouvé " + nf + " tuyaux poreux. L'affirmation doit-elle être acceptée/rejetée ?"]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), p = ref1[0], n = ref1[1], nf = ref1[2], Xlow = ref1[3], Xhigh = ref1[4], k_values = ref1[5], p_values = ref1[6], IF = ref1[7];
          return [
            "$p=" + p + "$ (en \\%), $n=" + n + "$ et $k=" + nf + "$.", "Pour vous aider, on donne les résultats suivants :", {
              type: "tableau",
              lignes: [_.flatten(["$k$", k_values]), _.flatten(["$p(X\\leqslant k)$", p_values])]
            }
          ];
        };
        return {
          children: [
            {
              type: "text",
              ps: ["Une usine fabrique des tuyaux en caoutchouc.", "Le fabriquant affirme que $p\\,\\%$ des tuyaux sont poreux.", "On prélève $n$ tuyaux dans la production.", "On obtient $k$ tuyaux poreux.", "Soit $X$ le nombre de tuyau poreux dans un tel échantillon.", "Pour les différentes valeurs de $p$, $n$ et $k$, déterminez :"]
            }, {
              type: "enumerate",
              enumi: "a",
              children: ["L'espérance $E(X)$ et l'écart-type $\\sigma(X)$", "L'intervalle de fluctuation au seuil de 95 \\%", "Considérant la valeur de $k$, l'affirmation doit-elle être acceptée/rejetée ?"]
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
