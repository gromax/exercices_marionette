define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var Xmax, Xmin, a, b, ens, items, sa, sb, symbs;
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
      items = [
        {
          type: "text",
          rank: 1,
          ps: ["La variable aléatoire $X$ suit la <b>loi uniforme</b> sur $[" + Xmin + ";" + Xmax + "]$.", "<b>Remarque :</b> on note parfois $\\mathcal{U}([" + Xmin + ";" + Xmax + "])$ cette loi."]
        }, {
          type: "input",
          rank: 2,
          waited: "number",
          tag: "$p(" + ens + ")$",
          name: "pX",
          description: "Valeur à 0,01 près",
          good: (b - a) / (Xmax - Xmin),
          arrondi: -2
        }
      ];
      if (options.a.value === 0) {
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
      if (options.b.value === 0) {
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
      items.push({
        type: "validation",
        rank: 5,
        clavier: ["aide"]
      });
      items.push({
        type: "aide",
        rank: 6,
        list: help.proba.binomiale.calculette
      });
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            items: items
          }
        ]
      };
    },
    tex: function(data) {
      var a, b, ens, i, itData, its, itsQuest, len, sa, sb, symbs;
      symbs = ["", "<", "\\leqslant"];
      if (!isArray(data)) {
        data = [data];
      }
      its = [];
      for (i = 0, len = data.length; i < len; i++) {
        itData = data[i];
        sa = Number(itData.inputs.sa);
        if (sa === 0) {
          ens = "X";
        } else {
          a = Number(itData.inputs.a);
          ens = a + " " + symbs[sa] + " X";
        }
        sb = Number(itData.inputs.sb);
        if (sb !== 0) {
          b = Number(itData.inputs.b);
          ens = ens + " " + symbs[sb] + " " + b;
        }
        if ((itData.options.a !== 0) || (itData.options.b !== 0)) {
          itsQuest = ["Donnez $p(" + ens + ")$"];
          if (itData.options.a !== 0) {
            itsQuest.push("Donnez $E(X)$ à $0,01$ près.");
          }
          if (itData.options.b !== 0) {
            itsQuest.push("Donnez $\\sigma(X)$ à $0,01$ près.");
          }
          its.push(Handlebars.templates["tex_enumerate"]({
            pre: "La variable $X$ suit la loi uniforme sur $[" + itData.inputs.Xmin + ";" + itData.inputs.Xmax + "]$.",
            items: itsQuest
          }));
        } else {
          its.push("La variable $X$ suit la loi uniforme sur $[" + itData.inputs.Xmin + ";" + itData.inputs.Xmax + "]$.\n\nDonnez $p(" + ens + ")$");
        }
      }
      if (its.length > 1) {
        return [
          {
            title: this.title,
            content: Handlebars.templates["tex_enumerate"]({
              items: its,
              numero: "1)",
              large: false
            })
          }
        ];
      } else {
        return [
          {
            title: this.title,
            content: Handlebars.templates["tex_plain"]({
              content: its[0],
              large: false
            })
          }
        ];
      }
    }
  };
  return Controller;
});
