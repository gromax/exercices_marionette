define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
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
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            title: "Calculs de probabilités",
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["La variable aléatoire $X$ suit la <b>loi normale</b> de moyenne $\\mu = " + mu + "$ et d'écart-type $\\sigma = " + std + "$.", "<b>Remarque :</b> on note $\\mathcal{N}(" + mu + ";" + std + ")$ cette loi."]
              }, {
                type: "input",
                rank: 2,
                tag: "$p(" + ens + ")$",
                name: "pX",
                description: "Valeur à 0,01 près",
                good: mM.repartition.gaussian({
                  min: Xa,
                  max: Xb
                }, {
                  moy: mu,
                  std: std
                }),
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
        ]
      };
    }
  };
  return Controller;
});
