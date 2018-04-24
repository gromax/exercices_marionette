define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options, affine) {
      var N, i, it, iteratee, j, max, ranks, results;
      N = Number(options.n.value + 2);
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
        ranks = _.shuffle((function() {
          results = [];
          for (var j = 0; 0 <= N ? j <= N : j >= N; 0 <= N ? j++ : j--){ results.push(j); }
          return results;
        }).apply(this));
        inputs.ranks = ranks.join(";");
      }
      iteratee = function(i) {
        var A, B, droite, tex;
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
            }
          ]
        }).save(inputs);
        droite = mM.droite.par2pts(A, B);
        if (affine) {
          tex = "$" + droite.affineTex("", "x", true) + "$";
        } else {
          tex = "$" + (droite.reduiteTex()) + "$";
        }
        return [tex, [A, B], droite, ranks[i]];
      };
      return _.unzip((function() {
        var k, ref, results1;
        results1 = [];
        for (i = k = 0, ref = N; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          results1.push(iteratee(i));
        }
        return results1;
      })());
    },
    getBriques: function(inputs, options, fixedSettings) {
      var droites, exo_help, initGraph, items, max, pts, ranks, ref, sujet;
      max = this.max;
      ref = this.init(inputs, options, fixedSettings.affine), items = ref[0], pts = ref[1], droites = ref[2], ranks = ref[3];
      if (fixedSettings.affine) {
        sujet = ["On vous donne 5 courbes et 5 fonctions affines.", "Vous devez dire à quelle fonction correspond chaque courbe.", "Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"];
        exo_help = help.fonction.affine.courbe;
      } else {
        sujet = ["On vous donne des droites et des équations de droites.", "Vous devez dire à quelle équation correspond chaque droite.", "Cliquez sur les rectangles pour choisir la couleur de la droite correspondant à chaque équation, puis validez"];
        exo_help = help.droite.associer_equation;
      }
      initGraph = function(graph) {
        var AB, i, j, len, results;
        results = [];
        for (i = j = 0, len = pts.length; j < len; i = ++j) {
          AB = pts[i];
          results.push(graph.create('line', [AB[0].toJSXcoords(), AB[1].toJSXcoords()], {
            strokeColor: colors.html(ranks[i]),
            strokeWidth: 4,
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
              ps: sujet
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
              list: exo_help
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
    getExamBriques: function(inputs_list, options, fixedSettings) {
      var fct_item, graphs, max, sujet, that;
      max = this.max;
      that = this;
      graphs = {};
      if (fixedSettings.affine) {
        sujet = ["On vous donne 5 courbes et 5 fonctions affines.", "Vous devez dire à quelle fonction correspond chaque courbe."];
      } else {
        sujet = ["On vous donne 5 droites et 5 équations de droites.", "Vous devez dire à quelle équation correspond chaque droite."];
      }
      fct_item = function(inputs, index) {
        var droites, id, items, pts, ranks, ref;
        ref = that.init(inputs, options, fixedSettings.affine), items = ref[0], pts = ref[1], droites = ref[2], ranks = ref[3];
        id = "jsx" + Math.random();
        graphs[id] = {
          params: {
            axis: true,
            grid: true,
            boundingbox: [-max, max, max, -max],
            keepaspectratio: true
          },
          init: function(graph) {
            var AB, i, j, len, results;
            results = [];
            for (i = j = 0, len = pts.length; j < len; i = ++j) {
              AB = pts[i];
              results.push(graph.create('line', [AB[0].toJSXcoords(), AB[1].toJSXcoords()], {
                strokeColor: colors.html(ranks[i]),
                strokeWidth: 4,
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
        var d, droites, fct_droite_to_tex, i, items, pts, ranks, ref, tex;
        ref = that.init(inputs, options, fixedSettings.affine), items = ref[0], pts = ref[1], droites = ref[2], ranks = ref[3];
        fct_droite_to_tex = function(d, index) {
          var color, x, y1, y2;
          color = colors.tex(ranks[index]);
          if (d.verticale()) {
            x = d.float_x(0);
            return "\\draw[line width=1pt, " + color + "] (" + x + "," + (-max - 1) + ") -- (" + x + "," + (max + 1) + ");";
          } else {
            y1 = d.float_y(-max - 1);
            y2 = d.float_y(max + 1);
            return "\\draw[line width=1pt, " + color + "] (" + (-max - 1) + "," + y1 + ") -- (" + (max + 1) + "," + y2 + ");";
          }
        };
        tex = ("\\begin{scope}\\clip(" + (-max) + "," + (-max) + ") rectangle(" + max + "," + max + ");") + ((function() {
          var j, len, results;
          results = [];
          for (index = j = 0, len = droites.length; j < len; index = ++j) {
            d = droites[index];
            results.push(fct_droite_to_tex(d, index));
          }
          return results;
        })()).join(" ") + "\\end{scope};";
        return [
          {
            type: "tikz",
            left: -max,
            bottom: -max,
            right: max,
            top: max,
            index: index + 1,
            axes: [1, 1],
            misc: tex
          }, {
            type: "enumerate",
            enumi: "a)",
            children: (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = ranks.length; j < len; j++) {
                i = ranks[j];
                results.push(it[i]);
              }
              return results;
            })()
          }
        ];
      };
      if (inputs_list.length === 1) {
        if (fixedSettings.affine) {
          sujet = ["On vous donne 5 courbes et 5 fonctions affines.", "Vous devez dire à quelle fonction correspond chaque courbe."];
        } else {
          sujet = ["On vous donne 5 droites et 5 équations de droites.", "Vous devez dire à quelle équation correspond chaque droite."];
        }
        return {
          children: sujet.concat(fct_item(inputs_list[0], 0))
        };
      } else {
        if (fixedSettings.affine) {
          sujet = ["Dans chaque cas, on vous donne 5 courbes et 5 fonctions affines.", "Vous devez dire à chaque fois quelle fonction correspond chaque courbe."];
        } else {
          sujet = ["Dans chaque cas, on vous donne 5 droites et 5 équations de droites.", "Vous devez dire à chaque fois quelle équation correspond chaque droite."];
        }
        return {
          children: sujet.concat([
            {
              type: "enumerate",
              enumi: "A",
              children: _.map(inputs_list, fct_item)
            }
          ])
        };
      }
    }
  };
});
