define(["utils/math"], function(mM) {
  return {
    getBriques: function(inputs, options) {
      var briqueEnnonce, displayedPts, iPts, initGraph, max, name, optA, pt, ref, strNames, strPts;
      max = 11;
      iPts = this.init(inputs);
      displayedPts = (function() {
        var j, len, ref, results;
        ref = ["A", "B", "C", "D", "E"];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          name = ref[j];
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
          var j, len, results;
          results = [];
          for (j = 0, len = iPts.length; j < len; j++) {
            pt = iPts[j];
            results.push("$" + (pt.texLine()) + "$");
          }
          return results;
        })()).join(", &nbsp;");
        briqueEnnonce = {
          type: "text",
          rank: 1,
          ps: ["On se place dans le repère &nbsp; $(O;I,J)$.", "Vous devez placer les point suivants :", strPts + "."]
        };
      } else {
        strPts = ((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = iPts.length; j < len; j++) {
            pt = iPts[j];
            results.push("$z_" + pt.name + " = " + (pt.affixe().tex()) + "$");
          }
          return results;
        })()).join(", &nbsp;");
        strNames = ((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = iPts.length; j < len; j++) {
            pt = iPts[j];
            results.push("$" + pt.name + "$");
          }
          return results;
        })()).join(", &nbsp;");
        briqueEnnonce = {
          type: "text",
          rank: 1,
          ps: ["On se place dans le plan complexe.", "Vous devez placer les point  : &nbsp; " + strNames + " &nbsp; dont les affixes sont :", strPts + "."]
        };
      }
      initGraph = function(graph) {
        return graph.points = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = displayedPts.length; j < len; j++) {
            pt = displayedPts[j];
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
              rank: 2,
              divId: "jsx" + (Math.random()),
              name: ["xA", "yA", "xB", "yB", "xC", "yC", "xD", "yD", "xE", "yE"],
              params: {
                axis: true,
                grid: true,
                boundingbox: [-max, max, max, -max],
                keepaspectratio: true
              },
              renderingFunctions: [initGraph],
              getData: function(graph) {
                var j, k, len, len1, out, p, ref1, ref2;
                out = {};
                ref1 = graph.points;
                for (j = 0, len = ref1.length; j < len; j++) {
                  p = ref1[j];
                  out["x" + p.name] = p.X();
                }
                ref2 = graph.points;
                for (k = 0, len1 = ref2.length; k < len1; k++) {
                  p = ref2[k];
                  out["y" + p.name] = p.Y();
                }
                return out;
              },
              verification: function(answers_data) {
                var a_x, a_y, d2, g_x, g_y, j, len, messages, note;
                note = 0;
                messages = [];
                for (j = 0, len = iPts.length; j < len; j++) {
                  pt = iPts[j];
                  g_x = mM.float(pt.x);
                  g_y = mM.float(pt.y);
                  a_x = Number(answers_data["x" + pt.name]);
                  a_y = Number(answers_data["y" + pt.name]);
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
                      rank: 3,
                      list: messages
                    }
                  ],
                  post: function(graph) {
                    var k, l, len1, len2, ref1, results;
                    ref1 = graph.points;
                    for (k = 0, len1 = ref1.length; k < len1; k++) {
                      pt = ref1[k];
                      pt.setAttribute({
                        fixed: true
                      });
                    }
                    results = [];
                    for (l = 0, len2 = iPts.length; l < len2; l++) {
                      pt = iPts[l];
                      name = pt.name;
                      g_x = mM.float(pt.x);
                      g_y = mM.float(pt.y);
                      results.push(graph.create('point', [g_x, g_y], {
                        name: name,
                        fixed: true,
                        size: 4,
                        color: 'green'
                      }));
                    }
                    return results;
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
    },
    init: function(inputs) {
      var name;
      return (function() {
        var j, len, ref, results;
        ref = ["A", "B", "C", "D", "E"];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          name = ref[j];
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
    tex: function(data) {
      var i, itemData, j, len, out;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        itemData = data[i];
        out.push({
          title: this.title,
          contents: [
            Handlebars.templates["tex_courbes"]({
              max: this.max,
              scale: .03 * this.max
            }), itemData.tex.enonce + " " + itemData.tex.liste.join(" ; ")
          ]
        });
      }
      return out;
    }
  };
});
