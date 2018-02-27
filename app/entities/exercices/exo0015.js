define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options) {
      var A, B, N, color, i, items, j, max, pts, ref;
      N = Number(options.n.value + 2);
      max = this.max;
      items = [];
      pts = [];
      for (i = j = 0, ref = N; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
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
        color = colors.html(i);
        items.push({
          rank: i,
          text: "$" + (mM.droite.par2pts(A, B).reduiteTex()) + "$"
        });
        pts.push([A, B, color]);
      }
      return [items, pts];
    },
    getBriques: function(inputs, options) {
      var initGraph, items, max, pts, ref;
      max = this.max;
      ref = this.init(inputs, options), items = ref[0], pts = ref[1];
      initGraph = function(graph) {
        var AB, j, len, results;
        results = [];
        for (j = 0, len = pts.length; j < len; j++) {
          AB = pts[j];
          results.push(graph.create('line', [AB[0].toJSXcoords(), AB[1].toJSXcoords()], {
            strokeColor: AB[2],
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
              rank: 1,
              ps: ["On vous donne des droites et des équations de droites.", "Vous devez dire à quelle équation correspond chaque droite.", "Cliquez sur les rectangles pour choisir la couleur de la droite correspondant à chaque équation, puis validez"]
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
              list: help.droite.associer_equation
            }
          ]
        }
      ];
    }
  };
});
