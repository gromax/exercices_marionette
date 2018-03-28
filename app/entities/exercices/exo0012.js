define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
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
      var A, B, dmax, droite, initGraph, max, ref;
      max = 10;
      dmax = .3;
      ref = this.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
      initGraph = function(graph) {
        var pA, pB;
        pA = graph.create("point", [-max + 1, 1], {
          name: 'A',
          fixed: false,
          size: 4,
          snapToGrid: false,
          color: 'blue',
          showInfoBox: true
        });
        pB = graph.create("point", [max - 1, 1], {
          name: 'B',
          fixed: false,
          size: 4,
          snapToGrid: false,
          color: 'blue',
          showInfoBox: true
        });
        graph.droite = graph.create('line', ["A", "B"], {
          strokeColor: '#00ff00',
          strokeWidth: 2
        });
        return graph.points = [pA, pB];
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère la fonction affine &nbsp; $" + (droite.affineTex("f", "x")) + "$.", "Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB)$ &nbsp; soit la courbe représentative de la fonction."]
            }, {
              type: "jsxgraph",
              rank: 2,
              divId: "jsx" + (Math.random()),
              name: ["xA", "yA", "xB", "yB"],
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
                var dA, dAB, dB, messages, note, u;
                note = 0;
                u = {
                  A: {
                    x: Number(answers_data["xA"]),
                    y: Number(answers_data["yA"])
                  },
                  B: {
                    x: Number(answers_data["xB"]),
                    y: Number(answers_data["yB"])
                  }
                };
                dA = droite.float_distance(u.A.x, u.A.y);
                dB = droite.float_distance(u.B.x, u.B.y);
                dAB = Math.sqrt((u.A.x - u.B.x) ^ 2 + (u.A.y - u.B.y) ^ 2);
                messages = [];
                if (dA < dmax) {
                  messages.push({
                    type: "success",
                    text: "Le point A est bien placé."
                  });
                  note += .5;
                } else {
                  messages.push({
                    type: "error",
                    text: "Le point A est mal placé."
                  });
                }
                if ((dB < dmax) && (dAB < dmax) && (dA < dmax)) {
                  messages.push({
                    type: "success",
                    text: "Le point B est bien placé, mais est trop proche de A."
                  });
                  note += .25;
                } else if (dB < dmax) {
                  messages.push({
                    type: "success",
                    text: "Le point B est bien placé."
                  });
                  note += .5;
                } else {
                  messages.push({
                    type: "error",
                    text: "Le point B est mal placé."
                  });
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
                    var i, len, pt, ref1;
                    ref1 = graph.points;
                    for (i = 0, len = ref1.length; i < len; i++) {
                      pt = ref1[i];
                      pt.setAttribute({
                        fixed: true,
                        x: u[pt.name].x,
                        y: u[pt.name].y
                      });
                    }
                    return graph.create('line', droite.float_2_points(max), {
                      strokeColor: 'blue',
                      strokeWidth: 2,
                      fixed: true
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
