define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options) {
      var col, max, optA, points, poly, polyDer, ref;
      max = this.max;
      optA = Number((ref = options.a.value) != null ? ref : 0) === 0;
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
      col = Math.floor(Math.random() * 2);
      return [
        [[poly, colors.html(col)], [polyDer, colors.html(1 - col)]], [
          {
            rank: col,
            text: "$" + (optA ? "f" : "F") + "$"
          }, {
            rank: 1 - col,
            text: "$" + (optA ? "f'" : "f") + "$"
          }
        ]
      ];
    },
    getBriques: function(inputs, options) {
      var initGraph, items, max, optA, polys, ref, ref1;
      optA = Number((ref = options.a.value) != null ? ref : 0) === 0;
      max = this.max;
      ref1 = this.init(inputs, options), polys = ref1[0], items = ref1[1];
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
              ps: optA ? ["On vous donne 2 courbes.", "L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à sa dérivée $f'$.", "Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $f'$."] : ["On vous donne 2 courbes.", "L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à une de ses primitive &nbsp; $F$.", "Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $F$."]
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
              list: items
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 5,
              list: optA ? help.derivee.variation : help.primitive.variation
            }
          ]
        }
      ];
    },
    tex: function(data) {
      var courbes, graphique, i, item, itemData, j, len, out, title;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        itemData = data[i];
        if (itemData.options.a.value === 0) {
          title = "Identifier la courbe de $f$ et celle de sa dérivée $f'$";
        } else {
          title = "Identifier la courbe de $f$ et celle de sa primitive $F$";
        }
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
        graphique = Handlebars.templates["tex_courbes"]({
          index: i + 1,
          max: this.max,
          courbes: courbes,
          scale: .6 * this.max / 6,
          center: true
        });
        out.push({
          title: title,
          content: graphique
        });
      }
      return out;
    }
  };
});
