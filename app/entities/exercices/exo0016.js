define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs) {
      var i, it, iteratee, max, ranks;
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
        ranks = _.shuffle([0, 1, 2, 3, 4]);
        inputs.ranks = ranks.join(";");
      }
      iteratee = function(i) {
        var A, B, cano, f, poly;
        A = mM.alea.vector({
          name: "A" + i,
          def: inputs,
          values: [
            {
              min: -max,
              max: max
            }
          ]
        }).save(inputs);
        B = mM.alea.vector({
          name: "B" + i,
          def: inputs,
          values: [
            {
              min: -max,
              max: max
            }
          ],
          forbidden: [
            {
              axe: "x",
              coords: A
            }, {
              axe: "y",
              coords: A
            }
          ]
        }).save(inputs);
        if (inputs["f" + i] != null) {
          f = Number(inputs["f" + i]);
        } else {
          if (cano = mM.alea.dice(1, 3)) {
            f = 1;
          } else {
            f = 0;
          }
          inputs["f" + i] = String(f);
        }
        poly = mM.exec([B.y, A.y, "-", B.x, A.x, "-", 2, "^", "/", "x", A.x, "-", 2, "^", "*", A.y, "+"], {
          simplify: true,
          developp: f !== 1
        });
        return [
          {
            text: "$x \\mapsto " + (poly.tex()) + "$"
          }, poly, ranks[i]
        ];
      };
      return _.unzip((function() {
        var j, results;
        results = [];
        for (i = j = 0; j <= 4; i = ++j) {
          results.push(iteratee(i));
        }
        return results;
      })());
    },
    getBriques: function(inputs, options) {
      var initGraph, items, max, polys, ranks, ref;
      max = this.max;
      ref = this.init(inputs), items = ref[0], polys = ref[1], ranks = ref[2];
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
              ps: ["On vous donne 5 courbes et 5 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque courbe.", "Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"]
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
              list: help.trinome.a_et_concavite_parabole.concat(help.trinome.canonique_et_parabole, help.trinome.c_et_parabole)
            }
          ],
          validations: {
            it: "color:5"
          },
          verifications: [
            {
              name: "it",
              items: items,
              colors: ranks
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
        var id, items, polys, ranks, ref;
        ref = that.init(inputs), items = ref[0], polys = ref[1], ranks = ref[2];
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
              type: "text",
              children: ["On vous donne 5 courbes et 5 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque courbe."]
            }, {
              type: "graphique",
              divId: id
            }, {
              type: "enumerate",
              enumi: "a",
              children: items
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
        var i, items, p, polys, ranks, ref;
        ref = that.init(inputs, options), items = ref[0], polys = ref[1], ranks = ref[2];
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
          }, {
            type: "enumerate",
            enumi: "a)",
            children: items
          }
        ];
      };
      if (inputs_list.length === 1) {
        return {
          children: ["On vous donne 5 courbes et 5 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque courbe."].concat(fct_item(inputs_list[0], 0))
        };
      } else {
        return {
          children: [
            "Dans chaque cas, on vous donne 5 courbes et 5 fonctions du second degré.", "Vous devez dire à chaque fois quelle fonction correspond chaque courbe.", {
              type: "enumerate",
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
