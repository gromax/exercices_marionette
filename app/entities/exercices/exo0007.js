define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var a, antecedents, b, borne_inf, borne_sup, c, d, fct, i, j, results, tabx, taby, x, xa, xi, ya, yi;
      borne_inf = -7;
      borne_sup = 7;
      if (typeof inputs.a === "undefined") {
        a = inputs.a = mM.alea.real({
          min: 0,
          max: 1
        });
      } else {
        a = Number(inputs.a);
      }
      if (typeof inputs.b === "undefined") {
        b = inputs.b = mM.alea.real({
          min: -5,
          max: 5
        });
      } else {
        b = Number(inputs.b);
      }
      if (typeof inputs.c === "undefined") {
        c = inputs.c = mM.alea.real({
          min: 1,
          max: 9
        });
      } else {
        c = Number(inputs.c);
      }
      if (typeof inputs.d === "undefined") {
        d = inputs.d = mM.alea.real({
          min: -20,
          max: 20
        });
      } else {
        d = Number(inputs.d);
      }
      if (typeof inputs.xi === "undefined") {
        xi = inputs.xi = mM.alea.real({
          min: borne_inf,
          max: borne_sup
        });
      } else {
        xi = Number(inputs.xi);
      }
      if (typeof inputs.xa === "undefined") {
        xa = inputs.xa = mM.alea.real({
          min: borne_inf,
          max: borne_sup
        });
      } else {
        xa = Number(inputs.xa);
      }
      fct = function(x) {
        return ((((a * x) + b) * x) + c) * x + d;
      };
      yi = fct(xi);
      ya = fct(xa);
      tabx = (function() {
        results = [];
        for (var j = borne_inf; borne_inf <= borne_sup ? j <= borne_sup : j >= borne_sup; borne_inf <= borne_sup ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this);
      taby = (function() {
        var k, len, results1;
        results1 = [];
        for (k = 0, len = tabx.length; k < len; k++) {
          x = tabx[k];
          results1.push(fct(x));
        }
        return results1;
      })();
      antecedents = (function() {
        var k, len, results1;
        results1 = [];
        for (i = k = 0, len = tabx.length; k < len; i = ++k) {
          x = tabx[i];
          if (taby[i] === ya) {
            results1.push(x);
          }
        }
        return results1;
      })();
      tabx.unshift("$x$");
      taby.unshift("$f(x)$");
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[" + borne_inf + ";" + borne_sup + "]$.", "On donne le tableau de valeur suivant :"]
              }, {
                type: "tableau",
                rank: 2,
                entetes: false,
                lignes: [tabx, taby]
              }, {
                type: "text",
                rank: 3,
                ps: ["Donnez l'image de " + xi + " par &nbsp; $f$."]
              }, {
                type: "input",
                rank: 4,
                waited: "number",
                tag: "Image",
                description: "Image de " + xi,
                name: "i",
                good: yi
              }, {
                type: "text",
                rank: 5,
                ps: ["Donnez un antécédent (un seul !) de " + ya + " par &nbsp; $f$."]
              }, {
                type: "input",
                rank: 6,
                waited: "number",
                tag: "Antécédent",
                description: "Antécédent de " + ya,
                name: "a",
                good: antecedents
              }, {
                type: "validation",
                rank: 7,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 8,
                list: help.fonction.image_antecedent
              }
            ]
          }
        ]
      };
    }
  };
  return Controller;
});
