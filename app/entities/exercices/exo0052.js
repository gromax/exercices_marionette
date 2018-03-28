define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var Xa, Xb, a, b, ens, mu, sa, sb, std, symbs;
      if (typeof inputs.std === "undefined") {
        inputs.std = mM.alea.real({
          min: 1,
          max: 50
        });
      }
      std = Number(inputs.std);
      if (typeof inputs.mu === "undefined") {
        inputs.mu = mM.alea.real({
          min: 0,
          max: 10,
          coeff: std
        });
      }
      mu = Number(inputs.mu);
      symbs = ["", "<", "\\leqslant"];
      if (typeof inputs.sa === "undefined") {
        inputs.sa = mM.alea.real([0, 1, 2]);
      }
      sa = Number(inputs.sa);
      if (sa === 0) {
        Xa = -1000 * std + mu;
        a = -101;
        ens = "X";
      } else {
        if (typeof inputs.a === "undefined") {
          inputs.a = mM.alea.real({
            min: -100,
            max: 80
          });
        }
        a = Number(inputs.a);
        Xa = Math.floor(a * 2 * std) / 100 + mu;
        ens = (mM.misc.numToStr(Xa, 2)) + " " + symbs[sa] + " X";
      }
      if (typeof inputs.sb === "undefined") {
        if (sa === 0) {
          inputs.sb = mM.alea.real([1, 2]);
        } else {
          inputs.sb = mM.alea.real([0, 1, 2]);
        }
      }
      sb = Number(inputs.sb);
      if (sb === 0) {
        Xb = 1000 * std + mu;
      } else {
        if (typeof inputs.b === "undefined") {
          inputs.b = mM.alea.real({
            min: a + 1,
            max: 100
          });
        }
        b = Number(inputs.b);
        Xb = Math.floor(b * 2 * std) / 100 + mu;
        ens = ens + " " + symbs[sb] + " " + (mM.misc.numToStr(Xb, 2));
      }
      return [
        mu, std, ens, mM.repartition.gaussian({
          min: Xa,
          max: Xb
        }, {
          moy: mu,
          std: std
        })
      ];
    },
    getBriques: function(inputs, options) {
      var ens, mu, p, ref, std;
      ref = this.init(inputs), mu = ref[0], std = ref[1], ens = ref[2], p = ref[3];
      return [
        {
          bareme: 100,
          title: "Calculs de probabilités",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi normale</b> de moyenne &nbsp; $\\mu = " + mu + "$ &nbsp; et d'écart-type &nbsp; $\\sigma = " + std + "$.", "<b>Remarque :</b> on note &nbsp; $\\mathcal{N}(" + mu + ";" + std + ")$ &nbsp; cette loi."]
            }, {
              type: "input",
              rank: 2,
              tag: "$p(" + ens + ")$",
              name: "pX",
              description: "Valeur à 0,01 près",
              good: p,
              waited: "number",
              arrondi: -2
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
        var ens, mu, p, ref, std;
        ref = that.init(inputs), mu = ref[0], std = ref[1], ens = ref[2], p = ref[3];
        return "$\\mu = " + mu + "$ &nbsp; et &nbsp; $\\sigma = " + std + "$. Calculer &nbsp; $p(" + ens + ")$.";
      };
      return {
        children: [
          {
            type: "text",
            children: ["La variable aléatoire &nbsp; $X$ &nbsp; suit la loi normale &nbsp; $\\mathcal{N}(\\mu;\\sigma)$.", "Dans les cas suivants, calculez les probabilités à 0,01 près."]
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
        var ens, mu, p, ref, std;
        ref = that.init(inputs), mu = ref[0], std = ref[1], ens = ref[2], p = ref[3];
        return "$\\mu = " + mu + "$ et $\\sigma = " + std + "$. Calculer $p(" + ens + ")$.";
      };
      return {
        children: [
          "La variable aléatoire $X$ suit la loi normale $\\mathcal{N}(\\mu;\\sigma)$.", "Dans les cas suivants, calculez les probabilités à 0,01 près.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
