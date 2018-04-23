define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs) {
      var i, it, iteratee, liste, max, ranks;
      max = this.max;
      liste = [
        {
          ap: false,
          d: -1
        }, {
          ap: false,
          d: 0
        }, {
          ap: false,
          d: 1
        }, {
          ap: true,
          d: -1
        }, {
          ap: true,
          d: 0
        }, {
          ap: true,
          d: 1
        }
      ];
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
        ranks = _.shuffle([0, 1, 2, 3, 4, 5]);
        inputs.ranks = ranks.join(";");
      }
      iteratee = function(i) {
        var a, cas, delta, poly, xA, xB, yA, yB;
        if (typeof inputs["xA" + i] !== "undefined") {
          xA = Number(inputs["xA" + i]);
          yA = Number(inputs["yA" + i]);
          xB = Number(inputs["xB" + i]);
          yB = Number(inputs["yB" + i]);
        } else {
          cas = liste.shift();
          xA = inputs["xA" + i] = xB = mM.alea.real({
            min: -max + 1,
            max: max - 1
          });
          while (xA === xB) {
            xB = mM.alea.real({
              min: -max + 1,
              max: max - 1
            });
          }
          inputs["xB" + i] = xB;
          switch (false) {
            case !(cas.ap && (cas.d === -1)):
              yA = mM.alea.real({
                min: 1,
                max: max - 1
              });
              yB = mM.alea.real({
                min: yA + 1,
                max: max
              });
              break;
            case !(!cas.ap && (cas.d === 1)):
              yA = mM.alea.real({
                min: 1,
                max: max - 1
              });
              yB = mM.alea.real({
                min: -max,
                max: yA - 1
              });
              break;
            case !(!cas.ap && (cas.d === -1)):
              yA = mM.alea.real({
                min: -max + 1,
                max: -1
              });
              yB = mM.alea.real({
                min: -max,
                max: yA - 1
              });
              break;
            case !(cas.ap && (cas.d === 1)):
              yA = mM.alea.real({
                min: -max + 1,
                max: -1
              });
              yB = mM.alea.real({
                min: yA + 1,
                max: max
              });
              break;
            case !cas.ap:
              yA = 0;
              yB = mM.alea.real({
                min: 1,
                max: max
              });
              break;
            default:
              yA = 0;
              yB = mM.alea.real({
                min: -max,
                max: -1
              });
          }
          inputs["yA" + i] = yA;
          inputs["yB" + i] = yB;
        }
        a = mM.exec([yB, yA, "-", xB, xA, "-", 2, "^", "/"], {
          simplify: true
        });
        poly = mM.exec([a, "x", xA, "-", 2, "^", "*", yA, "+"], {
          simplify: true
        });
        delta = mM.exec([-4, a, yA, "*", "*"], {
          simplify: true
        });
        return ["$\\Delta = " + (delta.tex()) + "$ &nbsp; et &nbsp; $a = " + (a.tex()) + "$", poly, ranks[i]];
      };
      return _.unzip((function() {
        var j, results;
        results = [];
        for (i = j = 0; j <= 5; i = ++j) {
          if (ranks[i] < 5) {
            results.push(iteratee(i));
          }
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
              ps: ["On vous donne 5 cas de fonctions du second degré, donc de la forme &nbsp;& $f:x\\mapsto ax^2+bx+c$.", "On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$.", "Vous devez les associer aux courbes en cliquant sur les rectangles pour sélectionner la bonne couleur."]
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
              list: help.trinome.a_et_concavite_parabole.concat(help.trinome.delta_et_parabole)
            }
          ],
          validations: {
            it: "color:5"
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
              children: ["On vous donne 5 cas de fonctions du second degré, donc de la forme &nbsp; $f:x\\mapsto ax^2+bx+c$.", "On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$."]
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
          "On vous donne 5 cas de fonctions du second degré, donc de la forme $f:x\\mapsto ax^2+bx+c$.", "On ne connaît que les valeurs de $\\Delta$ et de $a$.", {
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
