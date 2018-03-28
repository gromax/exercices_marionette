define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var k, n, p;
      if (typeof inputs.n === "undefined") {
        inputs.n = n = mM.alea.real({
          min: 10,
          max: 40
        });
      } else {
        n = Number(inputs.n);
      }
      if (typeof inputs.p === "undefined") {
        inputs.p = p = mM.alea.real({
          min: 1,
          max: 99
        });
      } else {
        p = Number(inputs.p);
      }
      if (p < 1) {
        p = Math.round(p * 100);
      }
      if (typeof inputs.k === "undefined") {
        inputs.k = k = Math.round(inputs.n * inputs.p / 100);
      } else {
        k = Math.min(Number(inputs.k, n - 1));
      }
      return [n, p, k, mM.distribution.binomial(n, p, k), mM.repartition.binomial(n, p, k)];
    },
    getBriques: function(inputs, options) {
      var k, n, p, pXegalK_good, pXinfK_good, ref;
      ref = this.init(inputs), n = ref[0], p = ref[1], k = ref[2], pXegalK_good = ref[3], pXinfK_good = ref[4];
      return [
        {
          bareme: 100,
          title: "Calculs de probabilités",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi binomiale</b> de paramètres &nbsp; $n = " + n + "$ &nbsp; et &nbsp; $p = " + p + "\\,\\%$.", "<b>Remarque :</b> on note &nbsp; $\\mathcal{B}(" + n + "\\,;" + p + "\\,\\%)$ &nbsp; cette loi.", "Calculez les probabilités suivantes à 0,001 près."]
            }, {
              type: "input",
              rank: 2,
              tag: "$p(X=" + inp.k + ")$",
              name: "pXegalK",
              description: "Valeur à 0,001 près",
              good: pXegalK_good,
              waited: "number",
              arrondi: -3
            }, {
              type: "input",
              rank: 2,
              tag: "$p(X\\leqslant " + inp.k + ")$",
              name: "pXinfK",
              description: "Valeur à 0,001 près",
              good: pXinfK_good,
              waited: "number",
              arrondi: -3
            }, {
              type: "validation",
              rank: 3,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 4,
              list: help.proba.binomiale.calculette
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var k, n, p, pXegalK_good, pXinfK_good, ref;
        ref = that.init(inputs), n = ref[0], p = ref[1], k = ref[2], pXegalK_good = ref[3], pXinfK_good = ref[4];
        return "$n = " + n + "$ &nbsp; ; &nbsp; $p = " + p + "\\,\\%$ &nbsp; et &nbsp; $k=" + k + "$.";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans tous les cas, &nbsp; $X$ est une variable aléatoire qui suit la loi &nbsp; $\\mathcal{B}(n\\,; p)$.", "Calculez à chaque fois &nbsp; $p(X=k)$ &nbsp; et &nbsp; $p(X\\leqslant k)$ &nbsp; à 0,001 près."]
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
        var k, n, p, pXegalK_good, pXinfK_good, ref;
        ref = that.init(inputs), n = ref[0], p = ref[1], k = ref[2], pXegalK_good = ref[3], pXinfK_good = ref[4];
        return "$n = " + n + "$ ; $p = " + p + "\\,\\%$ et $k=" + k + "$.";
      };
      return {
        children: [
          "Dans tous les cas, $X$ est une variable aléatoire qui suit la loi $\\mathcal{B}(n\\,; p)$.", "Dans les cas suivants, calculez les probabilités à 0,01 près.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
