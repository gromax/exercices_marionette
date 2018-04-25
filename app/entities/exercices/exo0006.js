define(["utils/math"], function(mM) {
  return {
    max: 11,
    init: function(inputs) {
      var max, name;
      max = this.max;
      return (function() {
        var i, len, ref, results;
        ref = ["A", "B", "C", "D", "E"];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          name = ref[i];
          results.push(mM.alea.vector({
            name: name,
            def: inputs,
            values: [
              {
                min: -max + 1,
                max: max - 1
              }
            ]
          }).save(inputs));
        }
        return results;
      })();
    },
    getBriques: function(inputs, options) {
      var briqueEnnonce, displayedPts, iPts, initGraph, max, name, optA, pt, ref, strNames, strPts;
      max = this.max;
      iPts = this.init(inputs);
      displayedPts = (function() {
        var i, len, ref, results;
        ref = ["A", "B", "C", "D", "E"];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          name = ref[i];
          results.push(mM.alea.vector({
            name: name,
            values: [
              {
                min: -max + 1,
                max: max - 1
              }
            ]
          }));
        }
        return results;
      })();
      optA = Number((ref = options.a.value) != null ? ref : 0);
      if (optA === 0) {
        strPts = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = iPts.length; i < len; i++) {
            pt = iPts[i];
            results.push("$" + (pt.texLine()) + "$");
          }
          return results;
        })()).join(", &nbsp;");
        briqueEnnonce = {
          type: "text",
          ps: ["On se place dans le repère &nbsp; $(O;I,J)$.", "Vous devez placer les point suivants :", strPts + "."]
        };
      } else {
        strPts = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = iPts.length; i < len; i++) {
            pt = iPts[i];
            results.push("$z_" + pt.name + " = " + (pt.affixe().tex()) + "$");
          }
          return results;
        })()).join(", &nbsp;");
        strNames = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = iPts.length; i < len; i++) {
            pt = iPts[i];
            results.push("$" + pt.name + "$");
          }
          return results;
        })()).join(", &nbsp;");
        briqueEnnonce = {
          type: "text",
          ps: ["On se place dans le plan complexe.", "Vous devez placer les point  : &nbsp; " + strNames + " &nbsp; dont les affixes sont :", strPts + "."]
        };
      }
      initGraph = function(graph) {
        return graph.points = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = displayedPts.length; i < len; i++) {
            pt = displayedPts[i];
            results.push(graph.create('point', mM.float([pt.x, pt.y]), {
              name: pt.name,
              fixed: false,
              size: 4,
              snapToGrid: true,
              color: 'blue',
              showInfoBox: false
            }));
          }
          return results;
        })();
      };
      return [
        {
          bareme: 100,
          items: [
            briqueEnnonce, {
              type: "jsxgraph",
              divId: "jsx" + (Math.random()),
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
              postVerification: function(view, data) {
                var g_x, g_y, i, j, len, len1, ref1, results;
                ref1 = view.graph.points;
                for (i = 0, len = ref1.length; i < len; i++) {
                  pt = ref1[i];
                  pt.setAttribute({
                    fixed: true
                  });
                }
                results = [];
                for (j = 0, len1 = iPts.length; j < len1; j++) {
                  pt = iPts[j];
                  name = pt.name;
                  g_x = mM.float(pt.x);
                  g_y = mM.float(pt.y);
                  results.push(view.graph.create('point', [g_x, g_y], {
                    name: name,
                    fixed: true,
                    size: 4,
                    color: 'green'
                  }));
                }
                return results;
              }
            }, {
              type: "validation"
            }
          ],
          validations: {
            xA: "real",
            yA: "real",
            xB: "real",
            yB: "real",
            xC: "real",
            yC: "real",
            xD: "real",
            yD: "real",
            xE: "real",
            yE: "real"
          },
          verifications: [
            function(data) {
              var a_x, a_y, d2, g_x, g_y, i, len, messages, note;
              note = 0;
              messages = [];
              for (i = 0, len = iPts.length; i < len; i++) {
                pt = iPts[i];
                g_x = mM.float(pt.x);
                g_y = mM.float(pt.y);
                a_x = data["x" + pt.name].processed;
                a_y = data["y" + pt.name].processed;
                d2 = (a_x - g_x) * (a_x - g_x) + (a_y - g_y) * (a_y - g_y);
                if (d2 < 0.2) {
                  messages.push({
                    type: "success",
                    text: "Le point " + pt.name + " est bien placé."
                  });
                  note += .2;
                } else {
                  messages.push({
                    type: "error",
                    text: "Le point " + pt.name + " est mal placé."
                  });
                }
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
    getExamBriques: function(inputs_list, options, fixedSettings) {
      var complexes, fct_item, max, ref, that;
      max = this.max;
      that = this;
      complexes = Number((ref = options.a.value) != null ? ref : 0) === 1;
      fct_item = function(inputs, index) {
        var iPts, pt;
        iPts = that.init(inputs);
        if (complexes) {
          return ((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = iPts.length; i < len; i++) {
              pt = iPts[i];
              results.push("$z_" + pt.name + " = " + (pt.affixe().tex()) + "$");
            }
            return results;
          })()).join(", &nbsp;");
        } else {
          return ((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = iPts.length; i < len; i++) {
              pt = iPts[i];
              results.push("$" + (pt.texLine()) + "$");
            }
            return results;
          })()).join(", &nbsp;");
        }
      };
      return {
        children: [
          {
            type: "text",
            children: complexes ? ["Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Placez ces points dans un plan complexe."] : ["Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Placez ces points dans un repère."]
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
      var complexes, fct_item, max, ref, sujet, that;
      that = this;
      max = this.max;
      complexes = Number((ref = options.a.value) != null ? ref : 0) === 1;
      fct_item = function(inputs, index) {
        var iPts, pt;
        iPts = that.init(inputs);
        if (complexes) {
          return [
            ((function() {
              var i, len, results;
              results = [];
              for (i = 0, len = iPts.length; i < len; i++) {
                pt = iPts[i];
                results.push("$z_" + pt.name + " = " + (pt.affixe().tex()) + "$");
              }
              return results;
            })()).join(", "), {
              type: "tikz",
              left: -max,
              bottom: -max,
              right: max,
              top: max,
              Ouv: true
            }
          ];
        } else {
          return [
            ((function() {
              var i, len, results;
              results = [];
              for (i = 0, len = iPts.length; i < len; i++) {
                pt = iPts[i];
                results.push("$" + (pt.texLine()) + "$");
              }
              return results;
            })()).join(", "), {
              type: "tikz",
              left: -max,
              bottom: -max,
              right: max,
              top: max,
              axes: [1, 1]
            }
          ];
        }
      };
      if (inputs_list.length === 1) {
        if (complexes) {
          sujet = ["On donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Placez ces points dans un plan complexe."];
        } else {
          sujet = ["On donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Placez ces points dans un repère."];
        }
        return {
          children: sujet.concat(fct_item(inputs_list[0], 0))
        };
      } else {
        if (complexes) {
          sujet = ["Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Placez ces points dans un plan complexe."];
        } else {
          sujet = ["Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$.", "Places ces points dans un repère."];
        }
        return {
          children: sujet.concat([
            {
              type: "enumerate",
              enumi: "1)",
              children: _.map(inputs_list, fct_item)
            }
          ])
        };
      }
    }
  };
});
