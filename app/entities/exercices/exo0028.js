define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var a, aPol, b, coeff, derivee, deriveeForTex, f2a, fa, fct, operands, optA, optD, optE, p, ref, ref1, ref2, t, x, xmax, xmin;
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
        p = mM.misc.toPrecision(-mM.float(derivee, {
          x: x
        }) * x + mM.float(fct, {
          x: x
        }), 2);
        console.log(p);
        t = mM.exec([f2a, "x", "*", p, "+"], {
          simplify: true
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
              ps: ["Soit $f(x) = " + (fct.tex()) + "$", "Donnez l'expression de $f'$, fonction dérivée de $f$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$f'(x) =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "d"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "sqrt", "pow"]
            }, {
              type: "aide",
              list: help.derivee.basics
            }
          ],
          validations: {
            d: "number"
          },
          verifications: [
            {
              name: "d",
              good: derivee,
              tag: "$f'(x)$",
              parameters: {
                goodTex: deriveeForTex.tex(),
                formes: {
                  fraction: true,
                  distribution: true
                },
                developp: true
              }
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
              tag: "$f(" + x + ")$",
              name: "fa",
              description: "Valeur de f(a) à 0,01"
            }, {
              type: "input",
              tag: "$f'(" + x + ")$",
              name: "f2a",
              description: "Valeur de f'(a) à 0,01"
            }, {
              type: "validation"
            }
          ],
          validations: {
            fa: "number",
            f2a: "number"
          },
          verifications: [
            {
              name: "fa",
              tag: "$f(" + x + ")$",
              good: fa,
              parameters: {
                arrondi: -2
              }
            }, {
              name: "f2a",
              tag: "$f'(" + x + ")$",
              good: f2a,
              parameters: {
                arrondi: -2
              }
            }
          ]
        });
        briques.push({
          title: "Équation de la tangente $\\mathcal{T}_{" + x + "}$ à l'abscisse $" + x + "$",
          bareme: 100,
          items: [
            {
              type: "input",
              format: [
                {
                  text: "$\\mathcal{T} :$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "e"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.derivee.tangente
            }
          ],
          validations: {
            e: function(user) {
              var out, pattern, result;
              pattern = /y\s*=([^=]+)/;
              result = pattern.exec(userValue);
              if (result) {
                out = mM.verification.numberValidation(result, {});
                out.user = user;
              } else {
                out = {
                  processed: false,
                  user: user,
                  error: "L'équation doit être de la forme y=..."
                };
              }
              return out;
            }
          },
          verifications: [
            function(data) {
              var list, out, ver;
              ver = mM.verification.isSame(data.e.processed, t, {
                developp: true,
                formes: "FRACTION"
              });
              if (ver.note === 0) {
                ver.goodMessage = {
                  type: "error",
                  text: "La bonne réponse était &nbsp; $y = " + (t.tex()) + "$."
                };
              }
              list = [
                {
                  type: "normal",
                  text: "<b>" + tag + "</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $y = " + data.e.processed.tex + "$"
                }, ver.goodMessage
              ];
              return out = {
                note: ver.note,
                add: {
                  type: "ul",
                  list: list.concat(ver.errors)
                }
              };
            }
          ]
        });
      }
      return briques;
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, optE, ref, that;
      optE = Number((ref = options.e.value) != null ? ref : 0);
      that = this;
      fct_item = function(inputs, index) {
        var derivee, deriveeForTex, f2a, fa, fct, ref1, t, x;
        ref1 = that.init(inputs, options), fct = ref1[0], derivee = ref1[1], deriveeForTex = ref1[2], x = ref1[3], fa = ref1[4], f2a = ref1[5], t = ref1[6];
        if (optE === 1) {
          return "$f(x) = " + (fct.tex()) + "$ et $a=" + x + "$";
        } else {
          return "$f(x) = " + (fct.tex()) + "$";
        }
      };
      if (optE === 1) {
        return {
          children: [
            {
              type: "text",
              children: ["Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        return {
          children: [
            {
              type: "text",
              children: ["Dans tous les cas, déterminer l'expression de $f'(x)$."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    },
    getTex: function(inputs_list, options) {
      var fct_item, optE, ref, that;
      optE = Number((ref = options.e.value) != null ? ref : 0);
      that = this;
      fct_item = function(inputs, index) {
        var derivee, deriveeForTex, f2a, fa, fct, ref1, t, x;
        ref1 = that.init(inputs, options), fct = ref1[0], derivee = ref1[1], deriveeForTex = ref1[2], x = ref1[3], fa = ref1[4], f2a = ref1[5], t = ref1[6];
        if (optE === 1) {
          return "$f(x) = " + (fct.tex()) + "$ et $a=" + x + "$";
        } else {
          return "$f(x) = " + (fct.tex()) + "$";
        }
      };
      if (optE === 1) {
        return {
          children: [
            "Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$.", {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        return {
          children: [
            "Dans tous les cas, déterminer l'expression de $f'(x)$.", {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
