define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var a, aPol, b, coeff, derivee, deriveeForTex, f2a, fa, fct, operands, optA, optD, optE, ref, ref1, ref2, t, x, xmax, xmin;
      optA = Number((ref = options.a.value) != null ? ref : 0);
      optD = Number((ref1 = options.d.value) != null ? ref1 : 0);
      optE = Number((ref2 = options.e.value) != null ? ref2 : 0);
      xmin = -10;
      xmax = 10;
      if (inputs.poly) {
        inputs.fct = inputs.poly;
      }
      if (typeof inputs.fct === "undefined") {
        if (optD === 0) {
          operands = [
            mM.alea.number({
              denominator: [1, 2, 3],
              values: {
                min: -10,
                max: 10
              }
            })
          ];
        } else {
          operands = [
            mM.alea.poly({
              degre: {
                min: 1,
                max: optD
              },
              coeffDom: [1, 2, 3],
              denominators: [1, 2, 3],
              values: {
                min: -10,
                max: 10
              }
            })
          ];
        }
        if ((optA === 1) || (optA === 2)) {
          if (mM.alea.dice(2, 3)) {
            coeff = mM.exec([
              mM.alea.poly({
                degre: [0, 1],
                coeffDom: [1, 2, 3],
                values: {
                  min: -10,
                  max: 10
                }
              }), "x", "*"
            ], {
              simplify: true,
              developp: true
            });
          } else {
            coeff = mM.alea.number({
              denominators: [1, 2],
              values: {
                min: -10,
                max: 10
              }
            });
          }
          operands.push(coeff);
          if (optA === 2) {
            a = mM.alea.real({
              min: 1,
              max: 10
            });
            b = mM.alea.real({
              min: -10,
              max: 10
            });
            xmin = (1 - b) / a;
            xmax = (20 - b) / a;
            operands.push(a, "x", "*", b, "+");
          } else {
            operands.push("x");
            xmin = 1;
            xmax = 20;
          }
          operands.push("ln", "*", "+");
        }
        if ((optA === 3) || (optA === 4)) {
          if (optA === 4) {
            aPol = mM.alea.real({
              min: 0.01,
              max: 0.5,
              real: 2,
              sign: true
            });
            xmin = -2 / Math.abs(aPol);
            xmax = 2 / Math.abs(aPol);
            operands.push(aPol, "x", "*");
          } else {
            operands.push("x");
            xmin = -2;
            xmax = 2;
          }
          operands.push("exp", "*");
        }
        fct = mM.exec(operands, {
          simplify: true
        });
        inputs.fct = String(fct);
      } else {
        fct = mM.parse(inputs.fct);
      }
      derivee = fct.derivate("x").simplify(null, true);
      deriveeForTex = mM.factorisation(derivee, /exp\(([x*+-\d]+)\)$/i, {
        simplify: true,
        developp: true
      });
      if (optE === 1) {
        if (typeof inputs.x !== "undefined") {
          x = Number(inputs.x);
        } else {
          x = mM.alea.real({
            min: xmin,
            max: xmax
          });
          inputs.x = String(x);
        }
        fa = mM.float(fct, {
          x: x,
          decimals: 2
        });
        f2a = mM.float(derivee, {
          x: x,
          decimals: 2
        });
        t = mM.exec([f2a, "x", x, "-", "*", fa, "+"], {
          simplify: true,
          developp: true
        });
      } else {
        x = false;
        fa = false;
        f2a = false;
        t = false;
      }
      return [fct, derivee, deriveeForTex, x, fa, f2a, t];
    },
    getBriques: function(inputs, options) {
      var briques, derivee, deriveeForTex, f2a, fa, fct, optE, ref, ref1, t, x;
      optE = Number((ref = options.e.value) != null ? ref : 0);
      ref1 = this.init(inputs, options), fct = ref1[0], derivee = ref1[1], deriveeForTex = ref1[2], x = ref1[3], fa = ref1[4], f2a = ref1[5], t = ref1[6];
      briques = [
        {
          title: "Expression de $f'$",
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Soit $f(x) = " + (fct.tex()) + "$", "Donnez l'expression de $f'$, fonction dérivée de $f$."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$f'(x)$",
              name: "d",
              description: "Expression de la dérivée",
              good: derivee,
              developp: true,
              goodTex: deriveeForTex.tex(),
              formes: {
                fraction: true,
                distribution: true
              }
            }, {
              type: "validation",
              rank: 3,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 4,
              list: help.derivee.basics
            }
          ]
        }
      ];
      if (optE === 1) {
        briques.push({
          title: "Calcul de $f(a)$ et $f'(a)$ en $a=" + x + "$",
          bareme: 100,
          items: [
            {
              type: "input",
              rank: 1,
              waited: "number",
              tag: "$f(" + x + ")$",
              name: "fa",
              description: "Valeur de f(a) à 0,01",
              good: fa,
              arrondi: -2
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$f'(" + x + ")$",
              name: "f2a",
              description: "Valeur de f'(a) à 0,01",
              good: f2a,
              arrondi: -2
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        });
        briques.push({
          title: "Équation de la tangente $\\mathcal{T}_{" + x + "}$ à l'abscisse $" + x + "$",
          bareme: 100,
          items: [
            {
              type: "input",
              rank: 1,
              waited: "number",
              tag: "$y=$",
              name: "e",
              description: "Équation de la tangente",
              good: t,
              developp: true,
              cor_prefix: "y=",
              formes: "FRACTION"
            }, {
              type: "validation",
              rank: 2,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 3,
              list: help.derivee.tangente
            }
          ]
        });
      }
      return briques;
    },
    tex: function(data) {
      var item, ref, ref1;
      if (!isArray(data)) {
        data = [data];
      }
      if (((ref = data[0]) != null ? (ref1 = ref.options.e) != null ? ref1.value : void 0 : void 0) === 1) {
        return {
          title: this.title,
          content: Handlebars.templates["tex_enumerate"]({
            pre: "Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$.",
            items: (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = data.length; i < len; i++) {
                item = data[i];
                results.push("$x \\mapsto " + item.fct + "$ et $a=" + item.inputs.x + "$");
              }
              return results;
            })(),
            large: false
          })
        };
      } else {
        return {
          title: this.title,
          content: Handlebars.templates["tex_enumerate"]({
            pre: "Donnez les dérivées des fonctions suivantes :",
            items: (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = data.length; i < len; i++) {
                item = data[i];
                results.push("$x \\mapsto " + item.fct + "$");
              }
              return results;
            })(),
            large: false
          })
        };
      }
    }
  };
});
