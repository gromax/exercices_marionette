define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    max: 6,
    init: function(inputs, options) {
      var A, B, color, i, items, j, max, pts;
      max = this.max;
      items = [];
      pts = [];
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
            }
          ]
        }).save(inputs);
        color = colors.html(i);
        items.push({
          rank: i,
          text: "$" + mM.droite.par2pts(A, B).affineTex("", "x", true) + "$"
        });
        pts.push([A, B, color]);
      }
      return [_.shuffle(items), pts];
    },
    getBriques: function(inputs, options) {
      var initGraph, items, max, pts, ref;
      max = this.max;
      ref = this.init(inputs), items = ref[0], pts = ref[1];
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
              ps: ["On vous donne 5 courbes et 5 fonctions affines.", "Vous devez dire à quelle fonction correspond chaque courbe.", "Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"]
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
              list: help.fonction.affine.courbe
            }
          ],
          validations: {
            it: "color:5"
          },
          verifications: [
            {
              name: "it",
              colors: items
            }
          ]
        }
      ];
    }
  };
});
