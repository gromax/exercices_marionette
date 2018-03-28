define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var Xmax, Xmin, a, b, ens, sa, sb, symbs;
      if (typeof inputs.Xmin === "undefined") {
        inputs.Xmin = mM.alea.real({
          min: -5,
          max: 20
        });
      }
      Xmin = Number(inputs.Xmin);
      if (typeof inputs.Xmax === "undefined") {
        inputs.Xmax = mM.alea.real({
          min: Xmin + 10,
          max: 100
        });
      }
      Xmax = Number(inputs.Xmax);
      symbs = ["", "<", "\\leqslant"];
      if (typeof inputs.sa === "undefined") {
        inputs.sa = mM.alea.real([0, 1, 2]);
      }
      sa = Number(inputs.sa);
      if (sa === 0) {
        a = Xmin;
        ens = "X";
      } else {
        if (typeof inputs.a === "undefined") {
          inputs.a = mM.alea.real({
            min: Xmin,
            max: Xmax - 1
          });
        }
        a = Number(inputs.a);
        ens = a + " " + symbs[sa] + " X";
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
        b = Xmax;
      } else {
        if (typeof inputs.b === "undefined") {
          inputs.b = mM.alea.real({
            min: a + 1,
            max: Xmax
          });
        }
        b = Number(inputs.b);
        ens = ens + " " + symbs[sb] + " " + b;
      }
      return [Xmin, Xmax, a, b, ens];
    },
    getBriques: function(inputs, options) {
      var Xmax, Xmin, a, b, calcE, calcStd, ens, items, ref, ref1, ref2;
      calcE = Number((ref = options.a.value) != null ? ref : 0) === 0;
      calcStd = Number((ref1 = options.b.value) != null ? ref1 : 0) === 0;
      ref2 = this.init(inputs), Xmin = ref2[0], Xmax = ref2[1], a = ref2[2], b = ref2[3], ens = ref2[4];
      items = [
        {
          type: "text",
          rank: 1,
          ps: ["La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi uniforme</b> sur &nbsp; $[" + Xmin + ";" + Xmax + "]$.", "<b>Remarque :</b> on note parfois &nbsp; $\\mathcal{U}([" + Xmin + ";" + Xmax + "])$ &nbsp; cette loi."]
        }, {
          type: "input",
          rank: 2,
          waited: "number",
          tag: "$p(" + ens + ")$",
          name: "pX",
          description: "Valeur à 0,01 près",
          good: (b - a) / (Xmax - Xmin),
          arrondi: -2
        }, {
          type: "validation",
          rank: 5,
          clavier: ["aide"]
        }, {
          type: "aide",
          rank: 6,
          list: help.proba.binomiale.calculette
        }
      ];
      if (calcE) {
        items.push({
          type: "input",
          rank: 3,
          waited: "number",
          tag: "$E(X)$",
          name: "E",
          description: "Espérance à 0,01 près",
          good: (Xmin + Xmax) / 2,
          arrondi: -2
        });
      }
      if (calcStd) {
        items.push({
          type: "input",
          rank: 4,
          waited: "number",
          tag: "$\\sigma(X)$",
          name: "sig",
          description: "Ecart-type à 0,01 près",
          good: (Xmax - Xmin) / Math.sqrt(12),
          arrondi: -2
        });
      }
      return [
        {
          bareme: 100,
          items: items
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var calcE, calcStd, enonce, fct_item, ref, ref1, sup, that;
      that = this;
      calcE = Number((ref = options.a.value) != null ? ref : 0) === 0;
      calcStd = Number((ref1 = options.b.value) != null ? ref1 : 0) === 0;
      fct_item = function(inputs, index) {
        var Xmax, Xmin, a, b, ens, ref2;
        ref2 = that.init(inputs), Xmin = ref2[0], Xmax = ref2[1], a = ref2[2], b = ref2[3], ens = ref2[4];
        return "$X\\in [" + Xmin + ";" + Xmax + "]$, calculer &nbsp; $p(" + ens + ")$.";
      };
      enonce = ["La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi uniforme</b> sur &nbsp; $[X_{Min};X_{Max}]$.", "Faites les calculs de probabilités à 0,01 près."];
      if (calcE || calcStd) {
        sup = [];
        if (calcE) {
          sup.push("l'espérance &nbsp; $E(X)$");
        }
        if (calcStd) {
          sup.push("l'écart-type &nbsp; $\\sigma(X)$");
        }
        enonce.push("Dans chaque cas, calculez aussi " + (sup.join("&nbsp; et ")) + " &nbsp; à 0,01 près.");
      }
      return {
        children: [
          {
            type: "text",
            children: enonce
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
      var calcE, calcStd, children, fct_item, ref, ref1, sup, that;
      that = this;
      calcE = Number((ref = options.a.value) != null ? ref : 0) === 0;
      calcStd = Number((ref1 = options.b.value) != null ? ref1 : 0) === 0;
      fct_item = function(inputs, index) {
        var Xmax, Xmin, a, b, ens, ref2;
        ref2 = that.init(inputs), Xmin = ref2[0], Xmax = ref2[1], a = ref2[2], b = ref2[3], ens = ref2[4];
        return "$X\\in [" + Xmin + ";" + Xmax + "]$, calculer $p(" + ens + ")$.";
      };
      children = ["La variable aléatoire $X$ suit la \\textbf{loi uniforme} sur $[X_{Min};X_{Max}]$.", "Faites les calculs de probabilités à 0,01 près."];
      if (calcE || calcStd) {
        sup = [];
        if (calcE) {
          sup.push("l'espérance $E(X)$");
        }
        if (calcStd) {
          sup.push("l'écart-type $\\sigma(X)$");
        }
        children.push("Dans chaque cas, calculez aussi " + (sup.join(" et ")) + " à 0,01 près.");
      }
      children.push({
        type: "enumerate",
        children: _.map(inputs_list, fct_item)
      });
      return {
        children: children
      };
    }
  };
});
