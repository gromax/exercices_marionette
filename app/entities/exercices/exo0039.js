define(["utils/math", "utils/help", "utils/colors", "utils/tabVar"], function(mM, help, colors, TabVarApi) {
  return {
    init: function(inputs) {
      var cano, cas, i, item, items, j, len, liste, max, poly, tab, tabX, tabs, variations, xA, xB, yA, yB;
      max = 6;
      items = [];
      liste = _.shuffle([
        {
          cano: true,
          convexe: true
        }, {
          cano: true,
          convexe: false
        }, {
          cano: false,
          convexe: true
        }, {
          cano: false,
          convexe: false
        }
      ]);
      tabs = [];
      for (i = j = 0, len = liste.length; j < len; i = ++j) {
        cas = liste[i];
        if ((typeof inputs["xA" + i] !== "undefined") && (typeof inputs["yA" + i] !== "undefined") && (typeof inputs["xB" + i] !== "undefined") && (typeof inputs["yB" + i] !== "undefined") && (typeof inputs["c" + i] !== "undefined")) {
          xA = Number(inputs["xA" + i]);
          yA = Number(inputs["yA" + i]);
          xB = Number(inputs["xB" + i]);
          yB = Number(inputs["yB" + i]);
          cano = Boolean(inputs["c" + i]);
        } else {
          xA = inputs["xA" + i] = xB = mM.alea.real({
            min: -max,
            max: max
          });
          while (xA === xB) {
            xB = inputs["xB" + i] = mM.alea.real({
              min: -max,
              max: max
            });
          }
          if (cas.convexe) {
            yA = inputs["yA" + i] = mM.alea.real({
              min: 1,
              max: max - 1
            });
            yB = inputs["yB" + i] = mM.alea.real({
              min: -max,
              max: yA - 1
            });
          } else {
            yA = inputs["yA" + i] = mM.alea.real({
              min: -max + 1,
              max: -1
            });
            yB = inputs["yB" + i] = mM.alea.real({
              min: yA + 1,
              max: max
            });
          }
          cano = inputs["c" + i] = cas.cano;
        }
        poly = mM.exec([yB, yA, "-", xB, xA, "-", 2, "^", "/", "x", xA, "-", 2, "^", "*", yA, "+"], {
          simplify: true,
          developp: !cano
        });
        item = {
          rank: i,
          text: "$x \\mapsto " + poly.tex({
            canonique: cano
          }) + "$"
        };
        tabX = ["$-\\infty$", "$" + xA + "$", "$+\\infty$"];
        if (yB > yA) {
          variations = "+/$+\\infty$,-/$" + yA + "$,+/$+\\infty$";
        } else {
          variations = "-/$-\\infty$,+/$" + yA + "$,-/$-\\infty$";
        }
        tab = (TabVarApi.make(tabX, {
          hauteur_ligne: 25,
          color: colors.html(i),
          texColor: colors.tex(i)
        })).addVarLine(variations);
        tabs.push(tab);
        items.push(item);
      }
      return [tabs, items];
    },
    getBriques: function(inputs, options) {
      var initTabs, items, ref, tabs;
      ref = this.init(inputs), tabs = ref[0], items = ref[1];
      initTabs = function($container) {
        var initOneTab;
        initOneTab = function(tab) {
          var $el;
          $el = $("<div></div>");
          $container.append($el);
          return tab.render($el[0]);
        };
        return _.each(tabs, initOneTab);
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On vous donne 4 tableaux de variations et 4 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque tableau.", "Pour cela appuyez sur les carrés pour sélectionner la bonne couleur."]
            }, {
              type: "def",
              rank: 2,
              renderingFunctions: [initTabs]
            }, {
              type: "color-choice",
              rank: 3,
              name: "it",
              list: _.shuffle(items)
            }, {
              type: "validation",
              rank: 5,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 6,
              list: help.trinome.canonique_et_parabole.concat(help.trinome.a_et_concavite_parabole)
            }
          ]
        }
      ];
    },
    tex: function(data) {
      var item, itemData, j, len, out, tab;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (j = 0, len = data.length; j < len; j++) {
        itemData = data[j];
        out.push({
          title: "Associer tableaux et fonctions",
          contents: ((function() {
            var k, len1, ref, results;
            ref = itemData.tabs;
            results = [];
            for (k = 0, len1 = ref.length; k < len1; k++) {
              tab = ref[k];
              results.push(tab.tex({
                color: false
              }));
            }
            return results;
          })()).concat(Handlebars.templates["tex_enumerate"]({
            items: (function() {
              var k, len1, ref, results;
              ref = itemData.items;
              results = [];
              for (k = 0, len1 = ref.length; k < len1; k++) {
                item = ref[k];
                results.push(item.title);
              }
              return results;
            })()
          }))
        });
      }
      return out;
    }
  };
});
