define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs) {
      var a, cas, color, delta, i, items, j, liste, max, poly, polys, xA, xB, yA, yB;
      max = this.max;
      items = [];
      polys = [];
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
      liste = _.shuffle(liste);
      for (i = j = 0; j <= 4; i = ++j) {
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
        color = colors.html(i);
        items.push({
          rank: i,
          text: "$\\Delta = " + (delta.tex()) + "$ &nbsp; et &nbsp; $a = " + (a.tex()) + "$"
        });
        polys.push([poly, color]);
      }
      return [items, polys];
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
              ps: ["On vous donne 5 cas de fonctions du second degré, donc de la forme &nbsp;& $f:x\\mapsto ax^2+bx+c$.", "On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$.", "Vous devez les associer aux courbes en cliquant sur les rectangles pour sélectionner la bonne couleur."]
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
              list: help.trinome.a_et_concavite_parabole.concat(help.trinome.delta_et_parabole)
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
          scale: .5
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
