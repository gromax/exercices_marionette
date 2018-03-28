define(["utils/math"], function(mM) {
  return {
    init: function(inputs) {
      var deg;
      if (inputs.deg != null) {
        deg = mM.toNumber(inputs.deg);
      } else {
        deg = mM.alea.number({
          min: 3,
          max: 8,
          sign: true,
          coeff: [30, 45]
        });
        inputs.deg = String(deg);
      }
      return [deg, mM.trigo.degToRad(deg)];
    },
    getBriques: function(inputs, options) {
      var ang, deg, initGraph, ref;
      ref = this.init(inputs), deg = ref[0], ang = ref[1];
      initGraph = function(graph) {
        var circle;
        circle = graph.create("circle", [[0, 0], 1], {
          fixed: true,
          strokeColor: 'red'
        });
        return graph.M = graph.create("glider", [circle], {
          name: "M",
          fixed: false,
          size: 4,
          color: 'blue',
          showInfoBox: true
        });
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Vous devez placer sur le cercle le point &nbsp; $M$ &nbsp; correspondant à la mesure &nbsp; $" + (ang.tex()) + "$ &nbsp; en radians."]
            }, {
              type: "jsxgraph",
              rank: 2,
              divId: "jsx" + (Math.random()),
              name: ["a"],
              params: {
                axis: true,
                grid: true,
                boundingbox: [-1.5, 1.5, 1.5, -1.5],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph],
              getData: function(graph) {
                var dU;
                dU = Math.round((Math.acos(graph.M.X())) * 180 / Math.PI);
                if (graph.M.Y() < 0) {
                  dU *= -1;
                }
                return {
                  a: dU
                };
              },
              verification: function(answers_data) {
                var ecart, ok, radG, radU, user;
                user = Number(answers_data.a);
                radU = user * Math.PI / 180;
                radG = deg * Math.PI / 180;
                ecart = Math.abs(deg - user);
                while (ecart >= 355) {
                  ecart -= 360;
                }
                ok = Math.abs(ecart) <= 5;
                if (ok) {
                  return {
                    note: 100,
                    add: [
                      {
                        type: "ul",
                        rank: 3,
                        list: [
                          {
                            type: "success",
                            text: "$M$ &nbsp; est bien placé."
                          }
                        ]
                      }
                    ],
                    post: function(graph) {
                      graph.removeObject(graph.M);
                      return graph.create("point", [Math.cos(radU), Math.sin(radU)], {
                        name: "M",
                        fixed: true,
                        size: 4,
                        color: 'green'
                      });
                    }
                  };
                } else {
                  return {
                    note: 0,
                    add: [
                      {
                        type: "ul",
                        rank: 3,
                        list: [
                          {
                            type: "error",
                            text: "$M$ &nbsp; est mal placé."
                          }
                        ]
                      }
                    ],
                    post: function(graph) {
                      graph.removeObject(graph.M);
                      graph.create("point", [Math.cos(radU), Math.sin(radU)], {
                        name: "",
                        fixed: true,
                        size: 4,
                        color: 'red'
                      });
                      return graph.create("point", [Math.cos(radG), Math.sin(radG)], {
                        name: "M",
                        fixed: true,
                        size: 4,
                        color: 'green'
                      });
                    }
                  };
                }
              }
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ang, deg, ref;
        ref = that.init(inputs, options), deg = ref[0], ang = ref[1];
        return "$" + (ang.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Placez sur un cercle trigonométrique les points dont les mesures sont données en radians :"]
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
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ang, deg, ref;
        ref = that.init(inputs, options), deg = ref[0], ang = ref[1];
        return "$" + (ang.tex()) + "$";
      };
      return {
        children: [
          "Placez sur un cercle trigonométrique les points dont les mesures sont données en radians :", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
