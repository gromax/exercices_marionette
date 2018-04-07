define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options) {
      var a, b, fct, integrale, max, prim;
      max = this.max;
      if ((typeof inputs.p !== "undefined") && (typeof inputs.f !== "undefined")) {
        prim = mM.parse(inputs.p);
        fct = mM.parse(inputs.f);
      } else {
        fct = mM.exec(["x", "*-", "exp", "x", "*"]);
        prim = mM.exec(["x", 1, "+", "x", "*-", "exp", "*", "*-"]);
      }
      if (typeof inputs.a === "undefined") {
        a = mM.alea.real({
          min: 0,
          max: 8
        }) * max / 20;
        inputs.a = String(a);
      } else {
        a = Number(inputs.a);
      }
      if (typeof inputs.b === "undefined") {
        b = mM.alea.real({
          min: 12,
          max: 20
        }) * max / 20;
        inputs.b = String(b);
      } else {
        b = Number(inputs.b);
      }
      integrale = mM.float(prim, {
        x: b
      }) - mM.float(prim, {
        x: a
      });
      return [prim, fct, a, b, integrale];
    },
    getBriques: function(inputs, options) {
      var a, b, fct, initGraph, integrale, max, prim, ref;
      max = this.max;
      ref = this.init(inputs, options), prim = ref[0], fct = ref[1], a = ref[2], b = ref[3], integrale = ref[4];
      initGraph = function(graph) {
        var fctCalc;
        fctCalc = function(x) {
          return mM.float(fct, {
            x: x
          });
        };
        return graph.create('functiongraph', [fctCalc, 0, max], {
          strokeWidth: 3,
          strokeColor: colors.html(0),
          fixed: true
        });
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On vous donne la courbe de &nbsp; $x\\mapsto " + (fct.tex()) + "$.", "On sait que la primitive de cette fonction est &nbsp; $x \\mapsto " + (prim.tex()) + "$.", "On cherche l'aire de la zone sous la courbe allant de &nbsp; $x=" + a + "$ &nbsp; à &nbsp; $x=" + b + "$.", "Donnez cette aire à 0,01 près."]
            }, {
              type: "jsxgraph",
              rank: 2,
              divId: "jsx" + (Math.random()),
              params: {
                axis: true,
                grid: true,
                boundingbox: [0, max, max, 0],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph]
            }, {
              type: "input",
              rank: 3,
              tag: "Aire",
              name: "A",
              description: "Aire sous la courbe",
              good: integrale,
              approx: -2,
              waited: "number"
            }, {
              type: "validation",
              rank: 4,
              clavier: []
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
