define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options, der) {
      var it, max, points, poly, polyDer, ranks;
      max = this.max;
      if ((inputs.ranks != null)) {
        ranks = (function() {
          var j, len, ref, results;
          ref = inputs.ranks.split(";");
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            it = ref[j];
            results.push(Number(it));
          }
          return results;
        })();
      } else {
        ranks = _.shuffle([0, 1]);
        inputs.ranks = ranks.join(";");
      }
      poly = null;
      if (typeof inputs.p !== "undefined") {
        poly = mM.polynome.make(inputs.p);
        if (!poly.isValid()) {
          poly = null;
        }
      }
      if (poly === null) {
        points = [
          {
            x: -max,
            y: mM.alea.real({
              min: -40,
              max: 40
            }) / 100 * max
          }, {
            x: -max / 2,
            y: mM.alea.real({
              min: -40,
              max: 40
            }) / 100 * max
          }, {
            x: 0,
            y: mM.alea.real({
              min: -40,
              max: 40
            }) / 100 * max
          }, {
            x: max / 2,
            y: mM.alea.real({
              min: -40,
              max: 40
            }) / 100 * max
          }, {
            x: max,
            y: mM.alea.real({
              min: -40,
              max: 40
            }) / 100 * max
          }
        ];
        poly = mM.polynome.make({
          points: points,
          variable: "x"
        });
        inputs.p = String(poly);
      }
      polyDer = poly.derivate();
      return [[poly, polyDer], ["$" + (der ? "f" : "F") + "$", "$" + (der ? "f'" : "f") + "$"], ranks];
    },
    getBriques: function(inputs, options, fixedSettings) {
      var initGraph, items, max, polys, ranks, ref;
      max = this.max;
      ref = this.init(inputs, options, fixedSettings.derivee), polys = ref[0], items = ref[1], ranks = ref[2];
      initGraph = function(graph) {
        var fct, i, j, len, p, results;
        results = [];
        for (i = j = 0, len = polys.length; j < len; i = ++j) {
          p = polys[i];
          fct = function(x) {
            return mM.float(p, {
              x: x
            });
          };
          results.push(graph.create('functiongraph', [fct, -max, max], {
            strokeWidth: 3,
            strokeColor: colors.html(ranks[i]),
            fixed: true
          }));
        }
        return results;
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: fixedSettings.derivee ? ["On vous donne 2 courbes.", "L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à sa dérivée $f'$.", "Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $f'$."] : ["On vous donne 2 courbes.", "L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à une de ses primitive &nbsp; $F$.", "Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $F$."]
            }, {
              type: "jsxgraph",
              divId: "jsx" + (Math.random()),
              params: {
                axis: true,
                grid: true,
                boundingbox: [-max, max, max, -max],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph]
            }, {
              type: "color-choice",
              name: "it",
              list: items
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: fixedSettings.derivee ? help.derivee.variation : help.primitive.variation
            }
          ],
          validations: {
            it: "color:2"
          },
          verifications: [
            {
              name: "it",
              colors: ranks,
              items: items
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options, fixedSettings) {
      var fct_item, graphs, max, sujet, that;
      max = this.max;
      that = this;
      graphs = {};
      if (fixedSettings.derivee) {
        sujet = ["Dans chaque cas, on vous donne 2 courbes.", "L'une représente une fonction &nbsp; $f$ &nbsp; et la seconde représente sa dérivée &nbsp; $f'$.", "Indiquez à chaque fois quelle courbe correspond à &nbsp; $f$ &nbsp; et quelle courbe correspond à &nbsp; $f'$."];
      } else {
        sujet = ["Dans chaque cas, on vous donne 2 courbes.", "L'une représente une fonction &nbsp; $f$ &nbsp; et la seconde représente une primitive &nbsp; $F$.", "Indiquez à chaque fois quelle courbe correspond à &nbsp; $f$ &nbsp; et quelle courbe correspond à &nbsp; $F$."];
      }
      fct_item = function(inputs, index) {
        var id, items, polys, ranks, ref;
        ref = that.init(inputs, options, fixedSettings.derivee), polys = ref[0], items = ref[1], ranks = ref[2];
        id = "jsx" + Math.random();
        graphs[id] = {
          params: {
            axis: true,
            grid: true,
            boundingbox: [-max, max, max, -max],
            keepaspectratio: true
          },
          init: function(graph) {
            var fct, i, j, len, p, results;
            results = [];
            for (i = j = 0, len = polys.length; j < len; i = ++j) {
              p = polys[i];
              fct = function(x) {
                return mM.float(p, {
                  x: x
                });
              };
              results.push(graph.create('functiongraph', [fct, -max, max], {
                strokeWidth: 3,
                strokeColor: colors.html(ranks[i]),
                fixed: true
              }));
            }
            return results;
          }
        };
        return {
          children: [
            {
              type: "graphique",
              divId: id
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "text",
            children: sujet
          }, {
            type: "subtitles",
            enumi: "A",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ],
        graphs: graphs
      };
    },
    getTex: function(inputs_list, options, fixedSettings) {
      var fct_item, max, sujet, that;
      that = this;
      max = this.max;
      fct_item = function(inputs, index) {
        var i, items, p, polys, ranks, ref;
        ref = that.init(inputs, options, fixedSettings.derivee), polys = ref[0], items = ref[1], ranks = ref[2];
        return [
          {
            type: "tikz",
            left: -max,
            bottom: -max,
            right: max,
            top: max,
            index: index + 1,
            axes: [1, 1],
            courbes: (function() {
              var j, len, results;
              results = [];
              for (i = j = 0, len = polys.length; j < len; i = ++j) {
                p = polys[i];
                results.push({
                  color: colors.tex(ranks[i]),
                  expression: String(p).replace(/x/g, '(/x)')
                });
              }
              return results;
            })()
          }
        ];
      };
      if (inputs_list.length === 1) {
        if (fixedSettings.derivee) {
          sujet = ["On vous donne 2 courbes.", "L'une représente une fonction $f$ et la seconde représente sa dérivée $f'$.", "Indiquez quelle courbe correspond à $f$ et quelle courbe correspond à $f'$."];
        } else {
          sujet = ["On vous donne 2 courbes.", "L'une représente une fonction $f$ et la seconde représente une primitive $F$.", "Indiquez quelle courbe correspond à $f$ et quelle courbe correspond à $F$."];
        }
        return {
          children: sujet.concat(fct_item(inputs_list[0], 0))
        };
      } else {
        if (fixedSettings.derivee) {
          sujet = ["Dans chaque cas, on vous donne 2 courbes.", "L'une représente une fonction $f$ et la seconde représente sa dérivée $f'$.", "Indiquez à chaque fois quelle courbe correspond à $f$ et quelle courbe correspond à $f'$."];
        } else {
          sujet = ["Dans chaque cas, on vous donne 2 courbes.", "L'une représente une fonction $f$ et la seconde représente une primitive $F$.", "Indiquez à chaque fois quelle courbe correspond à $f$ et quelle courbe correspond à $F$."];
        }
        return {
          children: [
            {
              type: "enumerate",
              enumi: "1)",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
