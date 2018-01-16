define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var a, al, b, c, d, dansR, item, poly, ref, x0;
      dansR = options.d.value === 0;
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
      poly = mM.polynome.make({
        coeffs: [c, b, a]
      });
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 20,
            title: "Discriminant",
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On considère le trinôme &nbsp; $P(x)=" + (poly.tex()) + "$.", "Donnez le discriminant &nbsp; $\\Delta$ &nbsp; de ce trinôme."]
              }, {
                type: "input",
                rank: 2,
                waited: "number",
                tag: "$\\Delta =$",
                name: "delta",
                description: "Discriminant",
                good: poly.discriminant()
              }, {
                type: "validation",
                rank: 3,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 4,
                list: help.trinome.discriminant
              }
            ]
          }, {
            bareme: 80,
            title: "Solutions",
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["Donnez les racines de &nbsp; $P(x)$ &nbsp; dans $\\mathbb{" + (dansR ? "R" : "C") + "}$.", "Autrement dit, donnez les solutions de &npsp; $" + (poly.tex()) + " = 0$", "Séparez les solutions par ;", "Si aucune solution, entrez ∅"]
              }, {
                type: "input",
                rank: 2,
                waited: "liste:number",
                tag: "$\\mathcal{S}$",
                name: "solutions",
                good: mM.polynome.solve.exact(poly, {
                  y: 0,
                  imaginaire: !dansR
                })
              }, {
                type: "validation",
                rank: 3,
                clavier: ["empty", "sqrt", "aide"]
              }, {
                type: "aide",
                rank: 4,
                list: help.trinome.racines
              }
            ]
          }
        ]
      };
    },
    tex: function(data) {
      var item, ref, title;
      if (!isArray(data)) {
        data = [data];
      }
      if (((ref = data[0]) != null ? ref.options.d.value : void 0) === 0) {
        title = "Résoudre dans $\\mathbb{R}$";
      } else {
        title = "Résoudre dans $\\mathbb{C}";
      }
      return {
        title: title,
        content: Handlebars.templates["tex_enumerate"]({
          items: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              results.push("$" + item.equation + "$");
            }
            return results;
          })(),
          large: false
        })
      };
    }
  };
  return Controller;
});
