define(["utils/math", "utils/help"], function(mM, help) {
  return {
    m: -7,
    M: 7,
    init: function(inputs) {
      var a, antecedents, b, borne_inf, borne_sup, c, d, fct, i, j, results, tabx, taby, x, xa, xi, ya;
      borne_inf = this.m;
      borne_sup = this.M;
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
      return [xi, fct(xi), xa, ya, tabx, taby, antecedents];
    },
    getBriques: function(inputs, options) {
      var antecedents, ref, tabx, taby, xa, xi, ya, yi;
      ref = this.init(inputs), xi = ref[0], yi = ref[1], xa = ref[2], ya = ref[3], tabx = ref[4], taby = ref[5], antecedents = ref[6];
      tabx.unshift("$x$");
      taby.unshift("$f(x)$");
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[" + this.m + ";" + this.M + "]$.", "On donne le tableau de valeur suivant :"]
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
              ps: ["Donnez un antécédent de " + ya + " par &nbsp; $f$."]
            }, {
              type: "input",
              rank: 6,
              tag: "Antécédent",
              description: "Antécédent de " + ya,
              name: "a"
            }, {
              type: "validation",
              rank: 7,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 8,
              list: help.fonction.image_antecedent
            }
          ],
          validations: {
            i: "number",
            a: "liste"
          },
          verifications: [
            {
              name: "i",
              rank: 4,
              tag: "Image",
              good: yi
            }, {
              name: "a",
              rank: 6,
              type: "some",
              tag: "Antécédent",
              good: antecedents
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that, xhigh, xlow;
      xlow = this.m;
      xhigh = this.M;
      that = this;
      fct_item = function(inputs, index) {
        var antecedents, ref, tabx, taby, xa, xi, ya, yi;
        ref = that.init(inputs), xi = ref[0], yi = ref[1], xa = ref[2], ya = ref[3], tabx = ref[4], taby = ref[5], antecedents = ref[6];
        tabx.unshift("$x$");
        taby.unshift("$f(x)$");
        return {
          children: [
            {
              type: "text",
              children: ["On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[" + xlow + ";" + xhigh + "]$.", "On donne le tableau de valeur suivant :"]
            }, {
              type: "tableau",
              lignes: [tabx, taby]
            }, {
              type: "enumerate",
              enumi: "1",
              children: ["Donnez l'image de " + xi + " par &nbsp; $f$", "Donnez un antécédent de " + (mM.misc.numToStr(ya)) + " par &nbsp; $f$"]
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "subtitles",
            enumi: "A",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that, xhigh, xlow;
      xlow = this.m;
      xhigh = this.M;
      that = this;
      fct_item = function(inputs, index) {
        var antecedents, ref, tabx, taby, xa, xi, ya, yi;
        ref = that.init(inputs), xi = ref[0], yi = ref[1], xa = ref[2], ya = ref[3], tabx = ref[4], taby = ref[5], antecedents = ref[6];
        tabx.unshift("$x$");
        taby.unshift("$f(x)$");
        return [
          "On considère la fonction $f$ défnie sur l'intervalle $[" + xlow + ";" + xhigh + "]$.", "On donne le tableau de valeur suivant :", {
            type: "tableau",
            setup: "|*{ " + tabx.length + " }{c|}",
            lignes: [tabx, taby]
          }, {
            type: "enumerate",
            children: ["Donnez l'image de " + xi + " par $f$", "Donnez un antécédent de " + (mM.misc.numToStr(ya)) + " par $f$"]
          }
        ];
      };
      if (inputs_list.length === 1) {
        return fct_item(inputs_list[0], 0);
      } else {
        return {
          children: [
            {
              type: "enumerate",
              enumi: "A",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
