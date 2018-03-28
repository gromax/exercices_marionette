define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var a, canoniqueTex, factoTex, normalTex, poly, polyCanonique, polyFacto, solutionsA, x1, x2, xA, xS, yA, yS;
      if (inputs.a != null) {
        a = mM.toNumber(inputs.a);
      } else {
        inputs.a = String(a = mM.alea.number({
          min: 1,
          max: 5,
          sign: true
        }));
      }
      if (inputs.x1 != null) {
        x1 = Number(inputs.x1);
      } else {
        inputs.x1 = String(x1 = mM.alea.real({
          min: -10,
          max: 10
        }));
      }
      if (inputs.x2 != null) {
        x2 = Number(inputs.x2);
      } else {
        inputs.x2 = String(x2 = mM.alea.real({
          min: -10,
          max: 10,
          no: [x1]
        }));
      }
      if (inputs.xA != null) {
        xA = Number(inputs.xA);
      } else {
        inputs.xA = String(xA = mM.alea.real({
          min: -20,
          max: 20,
          no: [x1, x2]
        }));
      }
      polyFacto = mM.exec([a, "x", x1, "-", "x", x2, "-", "*", "*"], {
        simplify: true
      });
      xS = mM.exec([x1, x2, "+", 2, "/"], {
        simplify: true
      });
      yS = mM.exec([a, xS, x1, "-", xS, x2, "-", "*", "*"], {
        simplify: true
      });
      polyCanonique = mM.exec([a, "x", xS, "-", 2, "^", "*", yS, "+"], {
        simplify: true
      });
      factoTex = polyFacto.tex();
      canoniqueTex = polyCanonique.tex();
      poly = mM.exec([polyFacto], {
        simplify: true,
        developp: true
      });
      normalTex = poly.tex();
      yA = mM.exec([a, xA, xS, "-", 2, "^", yS, "+"], {
        simplify: true
      });
      if (xA === (x1 + x2) / 2) {
        solutionsA = [mM.toNumber(xA)];
      } else {
        solutionsA = [mM.toNumber(xA), mM.toNumber(x1 + x2 - xA)];
      }
      return [normalTex, canoniqueTex, factoTex, xS, yS, [x1, x2], yA, solutionsA];
    },
    getBriques: function(inputs, options) {
      var canoniqueTex, factoTex, normalTex, racines, ref, solutionsA, xS, yA, yS;
      ref = this.init(inputs), normalTex = ref[0], canoniqueTex = ref[1], factoTex = ref[2], xS = ref[3], yS = ref[4], racines = ref[5], yA = ref[6], solutionsA = ref[7];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On propose la fonction &nbsp; $f$ &nbsp; définie par :", "$f(x)=" + normalTex + "$.", "La forme canonique est &nbsp; $f(x)=" + canoniqueTex + "$.", "La forme factorisée est &nbsp; $f(x)=" + factoTex + "$.", "En utilisant bien ces différentes formes, les deux premières questions ne nécessitent aucun calcul."]
            }, {
              type: "text",
              rank: 2,
              ps: ["Donnez les coordonnées de &nbsp; $S$, sommet de la courbe de &nbsp; $f$."]
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              name: "xS",
              tag: "$x_S$",
              description: "Abscisse de S",
              good: xS
            }, {
              type: "input",
              rank: 4,
              waited: "number",
              name: "yS",
              tag: "$y_S$",
              description: "Ordonnée de S",
              good: yS
            }, {
              type: "text",
              rank: 5,
              ps: ["Donnez les solutions de l'équation &nbsp; $f(x)=0$ &nbsp; séparée par ;"]
            }, {
              type: "input",
              rank: 6,
              waited: "liste:number",
              name: "racines",
              tag: "$\\mathcal{S}$",
              description: "Racines de f",
              good: racines
            }, {
              type: "text",
              rank: 7,
              ps: ["Donnez les solutions de l'équation &nbsp; $f(x)=" + yA + "$ &nbsp; séparée par ;"]
            }, {
              type: "input",
              rank: 8,
              waited: "liste:number",
              name: "sols",
              tag: "$\\mathcal{S}$",
              description: "Solutions",
              good: solutionsA
            }, {
              type: "validation",
              rank: 9,
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
        var canoniqueTex, factoTex, normalTex, racines, ref, solutionsA, xS, yA, yS;
        ref = that.init(inputs, options), normalTex = ref[0], canoniqueTex = ref[1], factoTex = ref[2], xS = ref[3], yS = ref[4], racines = ref[5], yA = ref[6], solutionsA = ref[7];
        return {
          type: "text",
          children: ["$f(x) = " + normalTex, "$f(x) = " + canoniqueTex, "$f(x) = " + factoTex + "$", "$A=yA.tex()$."]
        };
      };
      return {
        children: [
          {
            type: "text",
            children: ["On propose la fonction &nbsp; $f$ &nbsp; définie de trois façons différentes. :", "En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible.", "À chaque fois :"]
          }, {
            type: "enumerate",
            refresh: false,
            enumi: "a",
            children: ["Les coordonnées du sommet &nbsp; $S$ &nbsp; de la courbe de &nbsp; $f$", "Les racines de &nbsp; $f(x)$", "Les solultions, si elles existent, de &nbsp; $f(x) = A$"]
          }, {
            type: "enumerate",
            enumi: "1",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var canoniqueTex, factoTex, fct_item, normalTex, racines, ref, solutionsA, that, xS, yA, yS;
      if (inputs_list.length === 1) {
        ref = this.init(inputs_list[0], options), normalTex = ref[0], canoniqueTex = ref[1], factoTex = ref[2], xS = ref[3], yS = ref[4], racines = ref[5], yA = ref[6], solutionsA = ref[7];
        return {
          children: [
            "On propose la fonction $f$ définie de trois façons différentes. :", "$f(x) = " + normalTex, "$f(x) = " + canoniqueTex, "$f(x) = " + factoTex + "$", "En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible.", {
              type: "enumerate",
              enumi: "a)",
              children: ["Les coordonnées du sommet $S$ de la courbe de $f$", "Les racines de $f(x)$", "Les solultions, si elles existent, de $f(x) = " + (yA.tex()) + "$"]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), normalTex = ref1[0], canoniqueTex = ref1[1], factoTex = ref1[2], xS = ref1[3], yS = ref1[4], racines = ref1[5], yA = ref1[6], solutionsA = ref1[7];
          return {
            type: "enumerate",
            enumi: "a)",
            children: ["$f(x) = " + normalTex, "$f(x) = " + canoniqueTex, "$f(x) = " + factoTex + "$", "$A=yA.tex()$."]
          };
        };
        return {
          children: [
            "On propose la fonction $f$ définie de trois façons différentes. :", "En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible.", "À chaque fois :", {
              type: "enumerate",
              enumi: "A)",
              children: ["Les coordonnées du sommet $S$ de la courbe de $f$", "Les racines de $f(x)$", "Les solultions, si elles existent, de $f(x) = A$"]
            }, {
              type: "enumerate",
              enumi: "1)",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
