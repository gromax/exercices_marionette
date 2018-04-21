define(["utils/math"], function(mM) {
  return {
    max: 10,
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
      max = this.max;
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
              ps: ["On considère la droite &nbsp; $\\mathcal{D}$ &nbsp; d'équation réduite &nbsp; $" + (droite.reduiteTex()) + "$.", "Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB) = \\mathcal{D}$."]
            }, {
              type: "jsxgraph",
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
              postVerification: function(graph, data) {
                var i, len, pt, ref1;
                ref1 = graph.points;
                for (i = 0, len = ref1.length; i < len; i++) {
                  pt = ref1[i];
                  pt.setAttribute({
                    fixed: true,
                    x: data["x" + pt.name].processed,
                    y: data["y" + pt.name].processed
                  });
                }
                return graph.create('line', droite.float_2_points(max), {
                  strokeColor: 'blue',
                  strokeWidth: 2,
                  fixed: true
                });
              }
            }, {
              type: "validation"
            }
          ],
          validations: {
            xA: "real",
            yA: "real",
            xB: "real",
            yB: "real"
          },
          verifications: [
            function(data) {
              var dA, dAB, dB, messages, note, u;
              note = 0;
              u = {
                A: {
                  x: data.xA.processed,
                  y: data.yA.processed
                },
                B: {
                  x: data.xB.processed,
                  y: data.yB.processed
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
                    list: messages
                  }
                ]
              };
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, max, that;
      max = this.max;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, droite, ref;
        ref = that.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
        return "$" + (droite.reduiteTex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Tracez dans un repère les droites dont les équations sont :"]
          }, {
            type: "enumerate",
            refresh: true,
            enumi: "1",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, max, that;
      that = this;
      max = this.max;
      fct_item = function(inputs, index) {
        var A, B, droite, ref;
        ref = that.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
        return "$" + (droite.reduiteTex()) + "$";
      };
      if (inputs_list.length === 1) {
        return {
          children: [
            "Tracez dans le repère la droite d'équation : " + (fct_item(inputs_list[0], 0)), {
              type: "tikz",
              left: -max,
              bottom: -max,
              right: max,
              top: max,
              axes: [1, 1]
            }
          ]
        };
      } else {
        return {
          children: [
            "Tracez dans le repère les droites d'équations :", {
              type: "enumerate",
              enumi: "A",
              children: _.map(inputs_list, fct_item)
            }, {
              type: "tikz",
              left: -max,
              bottom: -max,
              right: max,
              top: max,
              axes: [1, 1]
            }
          ]
        };
      }
    }
  };
});
