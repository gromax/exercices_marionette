define(["utils/math", "utils/help", "utils/colors", "utils/tab"], function(mM, help, colors, TabSignApi) {
  return {
    init: function(inputs) {
      var a, a_is_plus, b, c, ensemble_solution, goodTab, im, ineq, ineqSign, poly, polyTex, racines, re, sol_is_ext, sol_xor, tabS1, tabS2, tabX, tabs, x1, x2;
      if ((typeof inputs.a !== "undefined") && (typeof inputs.b !== "undefined") && (typeof inputs.c !== "undefined") && (typeof inputs.ineq !== "undefined")) {
        a = Number(inputs.a);
        b = Number(inputs.b);
        c = Number(inputs.c);
        ineq = Number(inputs.ineq);
      } else {
        ineq = inputs.ineq = mM.alea.real([0, 1, 2, 3]);
        a = mM.alea.real({
          min: 1,
          max: 3,
          sign: true
        });
        if (mM.alea.dice(1, 4)) {
          im = mM.alea.real({
            min: 1,
            max: 10
          });
          re = mM.alea.real({
            min: -10,
            max: 10
          });
          b = -2 * re * a;
          c = (re * re + im * im) * a;
        } else {
          x1 = mM.alea.real({
            min: -10,
            max: 10
          });
          x2 = mM.alea.real({
            min: -10,
            max: 10
          });
          b = (-x1 - x2) * a;
          c = x1 * x2 * a;
        }
        inputs.a = a;
        inputs.b = b;
        inputs.c = c;
      }
      poly = mM.polynome.make({
        coeffs: [c, b, a]
      });
      a_is_plus = a > 0;
      sol_is_ext = a_is_plus === ((ineq === 1) || (ineq === 3));
      sol_xor = (ineq >= 2) !== sol_is_ext;
      racines = mM.polynome.solve.exact(poly, {
        y: 0
      });
      switch (racines.length) {
        case 1:
          if (sol_xor) {
            ensemble_solution = mM.ensemble.singleton(racines[0]);
          } else {
            ensemble_solution = mM.ensemble.vide();
          }
          tabX = ["$-\\infty$", "$x_0$", "$+\\infty$"];
          tabS1 = ",-,z,-,";
          tabS2 = ",+,z,+,";
          break;
        case 2:
          ensemble_solution = mM.ensemble.intervalle(sol_xor, racines[0], racines[1], sol_xor);
          tabX = ["$-\\infty$", "$x_1$", "$x_2$", "$+\\infty$"];
          tabS1 = ",-,z,+,z,-,";
          tabS2 = ",+,z,-,z,+,";
          break;
        default:
          ensemble_solution = mM.ensemble.vide();
          tabX = ["$-\\infty$", "$+\\infty$"];
          tabS1 = ",-,";
          tabS2 = ",+,";
      }
      tabs = [
        (TabSignApi.make(tabX, {
          hauteur_ligne: 25,
          color: colors.html(0),
          texColor: colors.tex(0)
        })).addSignLine(tabS1), (TabSignApi.make(tabX, {
          hauteur_ligne: 25,
          color: colors.html(1),
          texColor: colors.tex(1)
        })).addSignLine(tabS2)
      ];
      if (sol_is_ext) {
        ensemble_solution.inverse();
      }
      if (a_is_plus) {
        goodTab = 1;
      } else {
        goodTab = 0;
      }
      ineqSign = ["<", ">", "\\leqslant", "\\geqslant"];
      polyTex = poly.tex();
      return [polyTex + " " + ineqSign[ineq] + " 0", polyTex, poly, racines, ensemble_solution, tabs, goodTab];
    },
    getBriques: function(inputs, options) {
      var ensemble_solution, goodTab, ineqTex, initTabs, poly, polyTex, racines, ref, tabs;
      ref = this.init(inputs), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_solution = ref[4], tabs = ref[5], goodTab = ref[6];
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
          bareme: 20,
          title: "Discriminant",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère l'inéquation &nbsp; $" + ineqTex + "$.", "Commencez par donner le discriminant de &nbsp; $" + polyTex + "$."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              name: "delta",
              tag: "$\\Delta$",
              description: "Discriminant",
              good: poly.discriminant()
            }, {
              type: "validation",
              rank: 7,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 8,
              list: help.trinome.discriminant
            }
          ]
        }, {
          bareme: 40,
          title: "Racines",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Donnez les racines de &nbsp; $" + polyTex + "$.", "Séparez les par ; s'il y en a plusieurs.", "Répondez &nbsp; $\\varnothing$ &nbsp; s'il n'y a pas de racines."]
            }, {
              type: "input",
              rank: 2,
              waited: "liste:number",
              name: "racines",
              tag: "Racines",
              description: "Racines",
              good: racines
            }, {
              type: "validation",
              rank: 7,
              clavier: ["empty", "aide"]
            }, {
              type: "aide",
              rank: 8,
              list: help.trinome.racines
            }
          ]
        }, {
          bareme: 20,
          title: "Tableau de signe",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Choisissez le tableau de signe correspondant à &nbsp; $f(x)=" + polyTex + "$."]
            }, {
              type: "def",
              rank: 2,
              renderingFunctions: [initTabs]
            }, {
              type: "color-choice",
              rank: 3,
              name: "it",
              list: [
                {
                  rank: goodTab,
                  text: "Bon tableau"
                }
              ],
              maxValue: 1
            }, {
              type: "validation",
              rank: 4,
              clavier: []
            }
          ]
        }, {
          bareme: 20,
          title: "Ensemble solution",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Donnez l'ensemble solution de &nbsp; $" + ineqTex + "$."]
            }, {
              type: "input",
              rank: 2,
              waited: "ensemble",
              name: "ensemble",
              tag: "$\\mathcal{S}$",
              description: "Ensemble solution",
              good: ensemble_solution
            }, {
              type: "validation",
              rank: 7,
              clavier: ["union", "intersection", "reels", "empty", "infini"]
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ensemble_solution, ineqTex, poly, polyTex, racines, ref;
        ref = that.init(inputs, options), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_solution = ref[4];
        return {
          type: "enumerate",
          enumi: "1",
          children: ["Donnez les racines de &nbsp; $polyTex$", "Faites le tableau de signe de &nbsp; $polyTex$", "Déduisez-en l'ensemble solution de &nbsp; $ineqTex$."]
        };
      };
      return {
        children: [
          {
            type: "subtitles",
            enumi: "A",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ensemble_solution, ineqTex, poly, polyTex, racines, ref;
        ref = that.init(inputs, options), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_solution = ref[4];
        return {
          type: "enumerate",
          enumi: "1",
          children: ["Donnez les racines de $polyTex$", "Faites le tableau de signe de $polyTex$", "Déduisez-en l'ensemble solution de $ineqTex$."]
        };
      };
      return {
        children: [
          {
            type: "enumerate",
            enumi: "A",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
