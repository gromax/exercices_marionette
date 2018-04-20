define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, dansR) {
      var a, al, b, c, d, item, ref, x0;
      if ((typeof inputs.a !== "undefined") && (typeof inputs.b !== "undefined") && (typeof inputs.c !== "undefined")) {
        ref = (function() {
          var i, len, ref, results;
          ref = [inputs.a, inputs.b, inputs.c];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            results.push(mM.toNumber(item));
          }
          return results;
        })(), a = ref[0], b = ref[1], c = ref[2];
      } else {
        if (dansR) {
          al = mM.alea.real([1, 2, 3, 4]);
        } else {
          al = mM.alea.real([1, 2]);
        }
        a = mM.alea.number([-2, -1, 1, 2, 3]);
        x0 = mM.alea.number({
          min: -10,
          max: 10
        });
        b = mM.exec([-2, x0, a, "*", "*"], {
          simplify: true
        });
        d = mM.alea.number({
          min: 0,
          max: 10
        });
        if (al === 1) {
          c = mM.exec([x0, x0, "*", d, d, "*", "+", a, "*"], {
            simplify: true
          });
        } else {
          c = mM.exec([x0, d, "-", x0, d, "+", "*", a, "*"], {
            simplify: true
          });
        }
        inputs.a = String(a);
        inputs.b = String(b);
        inputs.c = String(c);
      }
      return mM.polynome.make({
        coeffs: [c, b, a]
      });
    },
    getBriques: function(inputs, options) {
      var dansR, poly;
      dansR = Number(options.d.value) === 0;
      poly = this.init(inputs, dansR);
      return [
        {
          bareme: 20,
          title: "Discriminant",
          items: [
            {
              type: "text",
              ps: ["On considère le trinôme &nbsp; $P(x)=" + (poly.tex()) + "$.", "Donnez le discriminant &nbsp; $\\Delta$ &nbsp; de ce trinôme."]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\Delta =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  name: "delta",
                  cols: 10,
                  latex: true
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "sqrt", "pow"]
            }, {
              type: "aide",
              list: help.trinome.discriminant
            }
          ],
          validations: {
            delta: "number"
          },
          verifications: [
            {
              name: "delta",
              tag: "$\\Delta$",
              good: poly.discriminant()
            }
          ]
        }, {
          bareme: 80,
          title: "Solutions",
          items: [
            {
              type: "text",
              ps: ["Donnez les racines de &nbsp; $P(x)$ &nbsp; dans $\\mathbb{" + (dansR ? "R" : "C") + "}$.", "Autrement dit, donnez les solutions de &npsp; $" + (poly.tex()) + " = 0$", "Séparez les solutions par ;", "Si aucune solution, entrez ∅"]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\mathcal{S} = $",
                  cols: 2,
                  "class": "text-right"
                }, {
                  name: "solutions",
                  cols: 10,
                  latex: true
                }
              ]
            }, {
              type: "validation",
              clavier: ["empty", "sqrt", "aide"]
            }, {
              type: "aide",
              list: help.trinome.racines
            }
          ],
          validations: {
            solutions: "liste"
          },
          verifications: [
            {
              name: "solutions",
              type: "all",
              tag: "$\\mathcal{S}$",
              good: mM.polynome.solve.exact(poly, {
                y: 0,
                imaginaire: !dansR
              })
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var dansR, ensemble, fct_item, that;
      dansR = Number(options.d.value) === 0;
      if (dansR) {
        ensemble = "R";
      } else {
        ensemble = "C";
      }
      that = this;
      fct_item = function(inputs, index) {
        var poly;
        poly = that.init(inputs, dansR);
        return "$P(x)=" + (poly.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Pour les polynomes suivants, donnez le discriminant et les racines dans &nbsp; $\\mathbb{" + ensemble + "}$ &nbsp; quand elles existent."]
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
      var dansR, ensemble, fct_item, that;
      dansR = Number(options.d.value) === 0;
      if (dansR) {
        ensemble = "R";
      } else {
        ensemble = "C";
      }
      that = this;
      fct_item = function(inputs, index) {
        var poly;
        poly = that.init(inputs, dansR);
        return "$P(x)=" + (poly.tex()) + "$";
      };
      return {
        children: [
          "Pour les polynomes suivants, donnez le discriminant et les racines dans $\\mathbb{" + ensemble + "}$ quand elles existent.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
