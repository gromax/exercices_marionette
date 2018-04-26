define(["utils/math", "utils/help", "utils/colors", "utils/tab"], function(mM, help, colors, TabVarApi) {
  return {
    init: function(inputs) {
      var i, it, iteratee, liste, max, ranks;
      max = 15;
      if ((inputs.ranks != null)) {
        ranks = (function() {
          var j, len, ref, results;
          ref = inputs.ranks.split(";");
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            it = ref[j];
            results.push(Number(it));
          }
          return results;
        })();
      } else {
        ranks = _.shuffle([0, 1, 2, 3]);
        inputs.ranks = ranks.join(";");
      }
      liste = [
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
      ];
      iteratee = function(i) {
        var cano, cas, poly, polyTex, tab, tabX, variations, xA, xB, yA, yB;
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
        polyTex = "$x \\mapsto " + poly.tex({
          canonique: cano
        }) + "$";
        tabX = ["$-\\infty$", "$" + xA + "$", "$+\\infty$"];
        if (yB > yA) {
          variations = "+/$+\\infty$,-/$" + yA + "$,+/$+\\infty$";
        } else {
          variations = "-/$-\\infty$,+/$" + yA + "$,-/$-\\infty$";
        }
        tab = (TabVarApi.make(tabX, {
          hauteur_ligne: 25,
          color: colors.html(ranks[i])
        })).addVarLine(variations);
        return [polyTex, tab, ranks[i]];
      };
      return _.unzip((function() {
        var j, results;
        results = [];
        for (i = j = 0; j <= 3; i = ++j) {
          results.push(iteratee(i));
        }
        return results;
      })());
    },
    getBriques: function(inputs, options) {
      var initTabs, items, ranks, ref, tabs;
      ref = this.init(inputs), items = ref[0], tabs = ref[1], ranks = ref[2];
      tabs = _.shuffle(tabs);
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
              ps: ["On vous donne 4 tableaux de variations et 4 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque tableau.", "Pour cela appuyez sur les carrés pour sélectionner la bonne couleur."]
            }, {
              type: "def",
              renderingFunctions: [initTabs]
            }, {
              type: "color-choice",
              name: "it",
              list: items
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.trinome.canonique_et_parabole.concat(help.trinome.a_et_concavite_parabole)
            }
          ],
          validations: {
            it: "color:4"
          },
          verifications: [
            {
              name: "it",
              colors: ranks,
              items: items
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, renderingFunctions, that;
      that = this;
      renderingFunctions = [];
      fct_item = function(inputs, index) {
        var divId, initTabs, items, ranks, ref, tabs;
        ref = that.init(inputs, options), items = ref[0], tabs = ref[1], ranks = ref[2];
        tabs = _.shuffle(tabs);
        divId = "tabs" + Math.round(Math.random() * 10000);
        initTabs = function(view) {
          var $container, initOneTab;
          $container = $("#" + divId, view.$el);
          initOneTab = function(tab) {
            var $el;
            $el = $("<div></div>");
            $container.append($el);
            return tab.render($el[0]);
          };
          return _.each(tabs, initOneTab);
        };
        renderingFunctions.push(initTabs);
        return {
          children: [
            {
              divId: divId
            }, {
              type: "enumerate",
              enumi: "a",
              children: items
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré.", "À chaque fois, vous devez dire à quelle fonction correspond chaque tableau."]
          }, {
            type: "subtitles",
            enumi: "A",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ],
        renderingFunctions: renderingFunctions
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var items, ranks, ref, tab, tabs;
        ref = that.init(inputs, options), items = ref[0], tabs = ref[1], ranks = ref[2];
        tabs = _.shuffle(tabs);
        return ((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = tabs.length; j < len; j++) {
            tab = tabs[j];
            results.push(tab.toTexTpl());
          }
          return results;
        })()).concat([
          {
            type: "enumerate",
            enumi: "a)",
            children: items
          }
        ]);
      };
      if (inputs_list.length === 1) {
        return {
          children: ["On vous donne 4 tableaux de variations et 4 fonctions du second degré.", "Vous devez dire à quelle fonction correspond chaque tableau."].concat(fct_item(inputs_list[0], 0))
        };
      } else {
        return {
          children: [
            "Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré.", "À chaque fois, vous devez dire à quelle fonction correspond chaque tableau.", {
              type: "enumerate",
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
