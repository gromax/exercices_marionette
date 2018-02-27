define(["utils/math"], function(mM) {
  return {
    init: function(inputs) {
      var antecedents, decimals, max, points, poly, x, xa, xi, ya, yi;
      max = 10;
      decimals = 2;
      poly = null;
      if (typeof inputs.p !== "undefined") {
        poly = mM.polynome.make(inputs.p);
        if (!poly.isValid()) {
          poly = null;
        }
      }
      if (poly === null) {
        points = (function() {
          var j, len, ref, results;
          ref = [-1, -.5, 0, .5, 1];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            x = ref[j];
            results.push({
              x: x * max,
              y: mM.alea.real({
                min: -60,
                max: 60
              }) * max / 100
            });
          }
          return results;
        })();
        poly = mM.polynome.make({
          points: points,
          variable: "x"
        });
        inputs.p = String(poly);
      }
      if (typeof inputs.xi === "undefined") {
        xi = mM.alea.real({
          min: -max,
          max: max
        });
      } else {
        xi = inputs.xi = Number(inputs.xi);
      }
      if (typeof inputs.xa === "undefined") {
        xa = mM.alea.real({
          min: -max,
          max: max
        });
      } else {
        xa = Number(inputs.xa);
      }
      while (xa === xi) {
        xa = mM.alea.real({
          min: -max,
          max: max
        });
      }
      inputs.xa = xa;
      yi = mM.float(poly, {
        x: xi,
        decimals: decimals
      });
      ya = mM.float(poly, {
        x: xa,
        decimals: decimals
      });
      antecedents = mM.polynome.solve.numeric(poly, {
        bornes: {
          min: -max,
          max: max
        },
        decimals: decimals,
        y: ya
      });
      return [poly, xi, yi, xa, ya, antecedents];
    },
    getBriques: function(inputs, options) {
      var antecedents, fctGraph, initGraph, poly, ref, str_antecedents, x, xa, xi, ya, yi;
      ref = this.init(inputs), poly = ref[0], xi = ref[1], yi = ref[2], xa = ref[3], ya = ref[4], antecedents = ref[5];
      str_antecedents = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = antecedents.length; j < len; j++) {
          x = antecedents[j];
          results.push(mM.misc.numToStr(x, 1));
        }
        return results;
      })();
      fctGraph = function(x) {
        return mM.float(poly, {
          x: x
        });
      };
      initGraph = function(graph) {
        var curve;
        curve = graph.create('functiongraph', [fctGraph, -max, max], {
          strokeWidth: 3
        });
        graph.create('point', [-max, fctGraph(-max)], {
          fixed: true,
          fillColor: 'blue',
          strokeColor: 'blue',
          withlabel: false,
          size: 4
        });
        graph.create('point', [max, fctGraph(max)], {
          fixed: true,
          fillColor: 'blue',
          strokeColor: 'blue',
          withlabel: false,
          size: 4
        });
        return graph.create('glider', [-max / 2, 2, curve], {
          name: 'M'
        });
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère la fonction &nbsp; $f$ &nbsp; définie sur &nbsp; $[" + (-max) + ";" + max + "]$ &nbsp; dont la courbe est donnée ci-dessous.", "Vous pouvez déplacer le point M sur la courbe afin d'obtenir une meilleure lecture des coordonnées."]
            }, {
              type: "jsxgraph",
              rank: 2,
              divId: "jsx" + (Math.random()),
              params: {
                axis: true,
                grid: true,
                boundingbox: [-max, max, max, -max],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph],
              verification: function() {
                return {
                  add: {
                    type: "ul",
                    rank: 3,
                    list: [
                      {
                        type: "warning",
                        text: "La construction pour l'image est en orange. La construction pour les antécédents est en vert."
                      }
                    ]
                  },
                  post: function(graph) {
                    var anchorX, anchorY, i, j, len;
                    graph.create('line', [[0, ya], [1, ya]], {
                      color: 'green',
                      strokeWidth: 2,
                      fixed: true
                    });
                    if (ya > 0) {
                      anchorY = 'top';
                    } else {
                      anchorY = 'bottom';
                    }
                    for (i = j = 0, len = antecedents.length; j < len; i = ++j) {
                      x = antecedents[i];
                      graph.create('line', [[x, ya], [x, 0]], {
                        color: 'green',
                        straightFirst: false,
                        straightLast: false,
                        strokeWidth: 2,
                        dash: 2,
                        fixed: true
                      });
                      graph.create('text', [x, 0, str_antecedents[i]], {
                        color: 'green',
                        anchorX: 'middle',
                        anchorY: anchorY
                      });
                    }
                    graph.create('line', [[xi, 0], [xi, yi]], {
                      color: 'orange',
                      straightFirst: false,
                      straightLast: false,
                      strokeWidth: 2,
                      dash: 2,
                      fixed: true
                    });
                    graph.create('line', [[xi, yi], [0, yi]], {
                      color: 'orange',
                      straightFirst: false,
                      straightLast: false,
                      strokeWidth: 2,
                      dash: 2,
                      fixed: true
                    });
                    if (xi > 0) {
                      anchorX = 'right';
                    } else {
                      anchorX = 'left';
                    }
                    return graph.create('text', [0, yi, mM.misc.numToStr(yi)], {
                      color: 'orange',
                      anchorX: anchorX,
                      anchorY: 'middle'
                    });
                  }
                };
              }
            }, {
              type: "text",
              rank: 4,
              ps: ["Donnez l'image de " + (mM.misc.numToStr(xi)) + " à 0,2 près."]
            }, {
              type: "input",
              rank: 5,
              name: "i",
              tag: "Image",
              good: yi,
              tolerance: .2
            }, {
              type: "text",
              rank: 6,
              ps: ["Donnez un antécédent (un seul !) de " + (mM.misc.numToStr(ya)) + " à 0,2 près."]
            }, {
              type: "input",
              rank: 7,
              name: "a",
              tag: "Antécédent",
              good: antecedents,
              tolerance: .2
            }, {
              type: "validation",
              rank: 8,
              clavier: []
            }
          ]
        }
      ];
    },
    tex: function(data) {
      var courbe, graphique, i, itemData, j, len, out, questions, xi, ya;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        itemData = data[i];
        courbe = {
          color: "blue",
          expr: itemData.values.poly.toClone().simplify().toString().replace(/,/g, '.').replace(/x/g, '(\\x)')
        };
        xi = itemData.values.xi;
        ya = itemData.values.ya;
        questions = Handlebars.templates["tex_enumerate"]({
          items: ["Donnez l'image de " + xi, "Donnez le(s) antécédent(s) de " + ya]
        });
        graphique = Handlebars.templates["tex_courbes"]({
          index: i + 1,
          max: this.max,
          courbes: [courbe],
          scale: .4 * this.max / 10
        });
        out.push({
          title: this.title,
          contents: [graphique, questions]
        });
      }
      return out;
    }
  };
});
