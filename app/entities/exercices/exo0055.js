define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var a, b, coeffs, degre, i, j, poly, ref;
      if (typeof inputs.poly === "undefined") {
        degre = mM.alea.real({
          min: 1,
          max: 3
        });
        coeffs = [0];
        for (i = j = 0, ref = degre - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          coeffs.push(mM.alea.real({
            min: -7,
            max: 7
          }));
        }
        poly = mM.polynome.make({
          coeffs: coeffs
        });
        inputs.poly = String(poly);
      } else {
        poly = mM.polynome.make(inputs.poly);
      }
      if (typeof inputs.a === "undefined") {
        a = mM.alea.real({
          min: -3,
          max: 3
        });
        inputs.a = String(a);
      } else {
        a = Number(inputs.a);
      }
      if (typeof inputs.b === "undefined") {
        b = mM.alea.real({
          min: a + 1,
          max: 8
        });
        inputs.b = String(b);
      } else {
        b = Number(inputs.b);
      }
      a = mM.toNumber(a);
      b = mM.toNumber(b);
      return [
        poly.derivate(), a, b, mM.exec([poly.calc(b), poly.calc(a), "-"], {
          simplify: true
        }), mM.alea["in"](["t", "x"])
      ];
    },
    getBriques: function(inputs, options) {
      var a, b, fct, integrale, ref, variable;
      ref = this.init(inputs, options), fct = ref[0], a = ref[1], b = ref[2], integrale = ref[3], variable = ref[4];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: [
                "Calculez l'intégrale : &nbsp; $\\displaystyle \\mathcal{I} = \\int_{" + (a.tex()) + "}^{" + (b.tex()) + "} \\left(" + (fct.tex({
                  variable: variable
                })) + "\\right)\\:\\text{d}" + variable + "$", "Remarque : Ces intégrales peuvent être négatives."
              ]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\mathcal{I}=$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "I"
                }
              ]
            }, {
              type: "validation",
              clavier: ["pow", "sqrt"]
            }
          ],
          validations: {
            I: "number"
          },
          verifications: [
            {
              name: "I",
              tag: "$\\mathcal{I}$",
              good: integrale
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var a, b, fct, integrale, ref, variable;
        ref = that.init(inputs, options), fct = ref[0], a = ref[1], b = ref[2], integrale = ref[3], variable = ref[4];
        return "$\\displaystyle \\mathcal{I} = \\int_{" + (a.tex()) + "}^{" + (b.tex()) + "} \\left(" + (fct.tex({
          variable: variable
        })) + "\\right)\\:\\text{d}" + variable + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Calculez les intégrales suivantes.", "Remarque : Ces intégrales peuvent être négatives."]
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
        var a, b, fct, integrale, ref, variable;
        ref = that.init(inputs, options), fct = ref[0], a = ref[1], b = ref[2], integrale = ref[3], variable = ref[4];
        return "$\\displaystyle \\mathcal{I} = \\int_{" + (a.tex()) + "}^{" + (b.tex()) + "} \\left(" + (fct.tex({
          variable: variable
        })) + "\\right)\\:\\text{d}" + variable + "$";
      };
      return {
        children: [
          "Calculez les intégrales suivantes.", "\\textit{Ces intégrales peuvent être négatives.}", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
