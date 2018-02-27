define(["utils/math", "utils/help"], function(mM, help) {
  return {
    max: 10,
    init: function(inputs) {
      var A, B, max;
      max = 10;
      A = mM.alea.vector({
        name: "A",
        def: inputs,
        values: [
          {
            min: -max,
            max: max
          }, {
            min: 1,
            max: max
          }
        ]
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        values: [
          {
            min: -max,
            max: max
          }, {
            min: -max,
            max: -1
          }
        ],
        forbidden: [
          {
            axe: "x",
            coords: A
          }
        ]
      }).save(inputs);
      return [A, B, mM.droite.par2pts(A, B)];
    },
    getBriques: function(inputs, options) {
      var A, B, droite, initGraph, max, ref;
      max = this.max;
      ref = this.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
      initGraph = function(graph) {
        var pt, pts;
        pts = [
          {
            name: "A",
            x: -max + 1,
            y: max - 1
          }, {
            name: "B",
            x: 0,
            y: -max + 1
          }, {
            name: "C",
            x: max - 1,
            y: max - 1
          }
        ];
        graph.points = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = pts.length; i < len; i++) {
            pt = pts[i];
            results.push(graph.create('point', [pt.x, pt.y], {
              name: pt.name,
              fixed: false,
              size: 4,
              color: 'blue',
              showInfoBox: false
            }));
          }
          return results;
        })();
        graph.create('line', ["A", "B"], {
          strokeColor: '#00ff00',
          strokeWidth: 2,
          straightLast: false
        });
        graph.create('line', ["B", "C"], {
          strokeColor: '#00ff00',
          strokeWidth: 2,
          straightFirst: false
        });
        return graph.on('move', function() {
          if (this.points[0].X() > this.points[1].X() - .1) {
            this.points[0].moveTo([this.points[1].X() - .1, this.points[0].Y()]);
          }
          if (this.points[2].X() < this.points[1].X() + .1) {
            return this.points[2].moveTo([this.points[1].X() + .1, this.points[2].Y()]);
          }
        });
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Dans le repère ci-contre, on vous demande de tracer la courbe de la fonction &nbsp; $f$ &nbsp;:", "$f:x\\mapsto\\left|" + (droite.reduiteObject().tex()) + "\\right|$.", "Pour cela, ajustez les positions des points &nbsp; $A$, &nbsp; $B$ et &nbsp; $C$."]
            }, {
              type: "jsxgraph",
              rank: 2,
              divId: "jsx" + (Math.random()),
              name: ["xA", "yA", "xB", "yB", "xC", "yC"],
              params: {
                axis: true,
                grid: true,
                boundingbox: [-max, max, max, -max],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph],
              getData: function(graph) {
                var i, j, len, len1, out, p, ref1, ref2;
                out = {};
                ref1 = graph.points;
                for (i = 0, len = ref1.length; i < len; i++) {
                  p = ref1[i];
                  out["x" + p.name] = p.X();
                }
                ref2 = graph.points;
                for (j = 0, len1 = ref2.length; j < len1; j++) {
                  p = ref2[j];
                  out["y" + p.name] = p.Y();
                }
                return out;
              },
              verification: function(answers_data) {
                var d, dmax, i, len, messages, note, p, ref1, x, y;
                dmax = .2;
                messages = [];
                note = 0;
                ref1 = ["A", "B", "C"];
                for (i = 0, len = ref1.length; i < len; i++) {
                  p = ref1[i];
                  x = Number(answers_data["x" + p]);
                  y = Number(answers_data["y" + p]);
                  if (droite.float_y(x) > 0) {
                    d = droite.float_distance(x, y);
                  } else {
                    d = droite.float_distance(x, -y);
                  }
                  if (d < dmax) {
                    messages.push({
                      type: "success",
                      text: "Le point " + p + " est bien placé."
                    });
                    note += .34;
                  } else {
                    messages.push({
                      type: "error",
                      text: "Le point " + p + " est mal placé."
                    });
                  }
                }
                if (note > 1) {
                  note = 1;
                }
                return {
                  note: note,
                  add: [
                    {
                      type: "ul",
                      rank: 3,
                      list: messages
                    }
                  ],
                  post: function(graph) {
                    var j, len1, pt, ref2, x0, y1, y2;
                    ref2 = graph.points;
                    for (j = 0, len1 = ref2.length; j < len1; j++) {
                      pt = ref2[j];
                      pt.setAttribute({
                        fixed: true
                      });
                    }
                    y1 = Math.abs(droite.float_y(-max));
                    y2 = Math.abs(droite.float_y(max));
                    x0 = droite.float_x(0);
                    graph.create('line', [[-max, y1], [x0, 0]], {
                      strokeColor: 'blue',
                      strokeWidth: 2,
                      fixed: true,
                      straightLast: false
                    });
                    graph.create('line', [[x0, 0], [max, y2]], {
                      strokeColor: 'blue',
                      strokeWidth: 2,
                      fixed: true,
                      straightFirst: false
                    });
                    return graph.create('line', mM.float([[A.x, A.y], [B.x, B.y]]), {
                      strokeColor: 'blue',
                      strokeWidth: 1,
                      fixed: true,
                      dash: 2
                    });
                  }
                };
              }
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        }
      ];
    }
  };
});
