define(["utils/math", "utils/help", "utils/colors", "utils/tab"], function(mM, help, colors, TabSignApi) {
  return {
    init: function(inputs) {
      var a, a_is_plus, b, c, ensemble_exterieur, ensemble_interieur, ensemble_solution, goodTab, im, ineq, ineqSign, poly, polyTex, racines, re, sol_is_ext, sol_xor, tabS1, tabS2, tabX, tabs, x1, x2;
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
            ensemble_interieur = mM.ensemble.singleton(racines[0]);
          } else {
            ensemble_solution = mM.ensemble.vide();
          }
          tabX = ["$-\\infty$", "$x_0$", "$+\\infty$"];
          tabS1 = ",-,z,-,";
          tabS2 = ",+,z,+,";
          break;
        case 2:
          ensemble_interieur = mM.ensemble.intervalle(sol_xor, racines[0], racines[1], sol_xor);
          tabX = ["$-\\infty$", "$x_1$", "$x_2$", "$+\\infty$"];
          tabS1 = ",-,z,+,z,-,";
          tabS2 = ",+,z,-,z,+,";
          break;
        default:
          ensemble_interieur = mM.ensemble.vide();
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
      ensemble_exterieur = ensemble_interieur.toClone().inverse();
      if (a_is_plus) {
        goodTab = 1;
      } else {
        goodTab = 0;
      }
      ineqSign = ["<", ">", "\\leqslant", "\\geqslant"];
      polyTex = poly.tex();
      return [polyTex + " " + ineqSign[ineq] + " 0", polyTex, poly, racines, ensemble_interieur.tex(), ensemble_exterieur.tex(), sol_is_ext, tabs, goodTab];
    },
    getBriques: function(inputs, options) {
      var ensemble_exterieur, ensemble_interieur, goodTab, ineqTex, initTabs, poly, polyTex, racines, ref, sol_is_ext, tabs;
      ref = this.init(inputs), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_interieur = ref[4], ensemble_exterieur = ref[5], sol_is_ext = ref[6], tabs = ref[7], goodTab = ref[8];
      initTabs = function(view) {
        var $container, initOneTab;
        $container = view.$el;
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
              ps: ["On considère l'inéquation &nbsp; $" + ineqTex + "$.", "Commencez par donner le discriminant de &nbsp; $" + polyTex + "$."]
            }, {
              type: "input",
              name: "delta",
              tag: "$\\Delta$",
              description: "Discriminant"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.trinome.discriminant
            }
          ],
          validations: {
            delta: "number"
          },
          verifications: [
            {
              name: "delta",
              tag: "$\\Delta$",
              good: poly.discriminant()
            }
          ]
        }, {
          bareme: 40,
          title: "Racines",
          items: [
            {
              type: "text",
              ps: ["Donnez les racines de &nbsp; $" + polyTex + "$.", "Séparez les par ; s'il y en a plusieurs.", "Répondez &nbsp; $\\varnothing$ &nbsp; s'il n'y a pas de racines."]
            }, {
              type: "input",
              format: [
                {
                  text: "Racines :",
                  cols: 3,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 7,
                  name: "racines"
                }
              ]
            }, {
              type: "validation",
              clavier: ["empty", "pow", "sqrt", "aide"]
            }, {
              type: "aide",
              list: help.trinome.racines
            }
          ],
          validations: {
            racines: "liste"
          },
          verifications: [
            {
              name: "racines",
              type: "all",
              tag: "Racines",
              good: racines
            }
          ]
        }, {
          bareme: 20,
          title: "Tableau de signe",
          items: [
            {
              type: "text",
              ps: ["Choisissez le tableau de signe correspondant à &nbsp; $f(x)=" + polyTex + "$."]
            }, {
              type: "def",
              renderingFunctions: [initTabs]
            }, {
              type: "ul",
              list: [
                {
                  type: "warning",
                  text: "Affichez avec un zoom à 100% pour un affichage correct."
                }
              ]
            }, {
              type: "color-choice",
              name: "it",
              list: ["Bon tableau"],
              maxValue: 1
            }, {
              type: "validation"
            }
          ],
          validations: {
            it: "color:1"
          },
          verifications: [
            {
              name: "it",
              colors: goodTab === 1 ? [1, 0] : [0, 1],
              items: ["Bon tableau"]
            }
          ]
        }, {
          bareme: 20,
          title: "Ensemble solution",
          items: [
            {
              type: "text",
              ps: ["Choisissez l'ensemble solution de &nbsp; $" + ineqTex + "$."]
            }, {
              type: "radio",
              tag: "$\\mathcal{S}$",
              name: "s",
              radio: ["$" + ensemble_interieur + "$", "$" + ensemble_exterieur + "$"]
            }, {
              type: "validation"
            }
          ],
          validations: {
            s: "radio:2"
          },
          verifications: [
            {
              radio: ["$" + ensemble_interieur + "$", "$" + ensemble_exterieur + "$"],
              name: "s",
              tag: "$\\mathcal{S}$",
              good: sol_is_ext ? 1 : 0
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ensemble_exterieur, ensemble_interieur, goodTab, ineqTex, poly, polyTex, racines, ref, sol_is_ext, tabs;
        ref = that.init(inputs, options), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_interieur = ref[4], ensemble_exterieur = ref[5], sol_is_ext = ref[6], tabs = ref[7], goodTab = ref[8];
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
        var ensemble_exterieur, ensemble_interieur, goodTab, ineqTex, poly, polyTex, racines, ref, sol_is_ext, tabs;
        ref = that.init(inputs, options), ineqTex = ref[0], polyTex = ref[1], poly = ref[2], racines = ref[3], ensemble_interieur = ref[4], ensemble_exterieur = ref[5], sol_is_ext = ref[6], tabs = ref[7], goodTab = ref[8];
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
