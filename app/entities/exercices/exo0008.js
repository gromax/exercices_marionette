define(["utils/math"], function(mM) {
  return {
    max: 10,
    init: function(inputs) {
      var antecedents, decimals, max, points, poly, x, xa, xi, ya, yi;
      max = this.max;
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
      var antecedents, fctGraph, initGraph, max, poly, ref, str_antecedents, x, xa, xi, ya, yi;
      max = this.max;
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
              tag: "Image"
            }, {
              type: "text",
              rank: 6,
              ps: ["Donnez un antécédent de " + (mM.misc.numToStr(ya)) + " à 0,2 près."]
            }, {
              type: "input",
              rank: 7,
              name: "a",
              tag: "Antécédent"
            }, {
              type: "validation",
              rank: 8
            }
          ],
          validations: {
            i: "number",
            a: "liste"
          },
          verifications: [
            {
              name: "i",
              rank: 5,
              tag: "Image",
              good: yi,
              parameters: {
                tolerance: .2
              }
            }, {
              name: "a",
              rank: 7,
              tag: "Antécédent",
              type: "some",
              good: antecedents,
              parameters: {
                tolerance: .2
              }
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, graphs, max, that;
      max = this.max;
      that = this;
      graphs = {};
      fct_item = function(inputs, index) {
        var antecedents, fctGraph, id, poly, ref, xa, xi, ya, yi;
        ref = that.init(inputs), poly = ref[0], xi = ref[1], yi = ref[2], xa = ref[3], ya = ref[4], antecedents = ref[5];
        id = "jsx" + Math.random();
        fctGraph = function(x) {
          return mM.float(poly, {
            x: x
          });
        };
        graphs[id] = {
          params: {
            axis: true,
            grid: true,
            boundingbox: [-max, max, max, -max],
            keepaspectratio: true
          },
          init: function(graph) {
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
            return graph.create('point', [max, fctGraph(max)], {
              fixed: true,
              fillColor: 'blue',
              strokeColor: 'blue',
              withlabel: false,
              size: 4
            });
          }
        };
        return {
          children: [
            {
              type: "text",
              children: ["On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[" + (-max) + ";" + max + "]$ par la courbe :"]
            }, {
              type: "graphique",
              divId: id
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
        ],
        graphs: graphs
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, max, that;
      that = this;
      max = this.max;
      fct_item = function(inputs, index) {
        var antecedents, poly, ref, xa, xi, ya, yi;
        ref = that.init(inputs, options), poly = ref[0], xi = ref[1], yi = ref[2], xa = ref[3], ya = ref[4], antecedents = ref[5];
        return [
          "On considère la fonction $f$ défnie sur l'intervalle $[" + (-max) + ";" + max + "]$ par la courbe :", {
            type: "tikz",
            left: -max,
            bottom: -max,
            right: max,
            top: max,
            index: index + 1,
            axes: [1, 1],
            courbes: [
              {
                color: 'blue',
                expression: String(poly).replace(/x/g, '(/x)')
              }
            ]
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
