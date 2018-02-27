define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs) {
      var A, B, cano, color, f, i, items, j, max, poly, polys, results;
      max = this.max;
      items = [];
      polys = [];
      results = [];
      for (i = j = 0; j <= 4; i = ++j) {
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
        color = colors.html(i);
        items.push({
          rank: i,
          text: "$x \\mapsto " + (poly.tex()) + "$"
        });
        results.push(polys.push([poly, color]));
      }
      return results;
    },
    getBriques: function(inputs, options) {
      var initGraph, items, max, polys, ref;
      max = this.max;
      ref = this.init(inputs), items = ref[0], polys = ref[1];
      initGraph = function(graph) {
        var fct, j, len, p, results;
        results = [];
        for (j = 0, len = polys.length; j < len; j++) {
          p = polys[j];
          fct = function(x) {
            return mM.float(p[0], {
              x: x
            });
          };
          results.push(graph.create('functiongraph', [fct, -max, max], {
            strokeWidth: 3,
            strokeColor: p[1],
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
              rank: 1,
              ps: ["On vous donne 5 courbes et 5 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque courbe.", "Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"]
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
              renderingFunctions: [initGraph]
            }, {
              type: "color-choice",
              rank: 3,
              name: "it",
              list: _.shuffle(items)
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 5,
              list: help.trinome.a_et_concavite_parabole.concat(help.trinome.canonique_et_parabole, help.trinome.c_et_parabole)
            }
          ]
        }
      ];
    },
    tex: function(data) {
      var courbes, graphique, i, item, itemData, j, len, out, questions;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        itemData = data[i];
        courbes = (function() {
          var k, len1, ref, results;
          ref = itemData.polys;
          results = [];
          for (k = 0, len1 = ref.length; k < len1; k++) {
            item = ref[k];
            results.push({
              color: item.color.tex,
              expr: item.obj.toClone().simplify().toString().replace(/,/g, '.').replace(/x/g, '(\\x)')
            });
          }
          return results;
        })();
        arrayShuffle(itemData.items);
        questions = Handlebars.templates["tex_enumerate"]({
          items: (function() {
            var k, len1, ref, results;
            ref = itemData.items;
            results = [];
            for (k = 0, len1 = ref.length; k < len1; k++) {
              item = ref[k];
              results.push(item.title);
            }
            return results;
          })()
        });
        graphique = Handlebars.templates["tex_courbes"]({
          index: i + 1,
          max: this.max,
          courbes: courbes,
          scale: .6 * this.max / 6
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
