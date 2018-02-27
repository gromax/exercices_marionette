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
    tex: function(data) {
      var i, itemData, len, out;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = 0, len = data.length; i < len; i++) {
        itemData = data[i];
        out.push({
          title: "Choix de la meilleure forme",
          contents: [
            "On donne $f(x)$ sous trois formes :", "\\[f(x) = " + itemData.tex.normale + "\\]", "\\[f(x) = " + itemData.tex.canonique + "\\]", "\\[f(x) = " + itemData.tex.facto + "\\]", Handlebars.templates["tex_enumerate"]({
              pre: "Sans, ou avec peu de calcul, en utilisant la forme la plus adaptée, donnez :",
              items: ["Les coordonnées du sommet $S$ de la courbe de $f$", "Les solutions de $f(x) = 0$", "Les solultions, si elles existent, de $f(x) = " + itemData.tex.yA + "$"]
            })
          ]
        });
      }
      return out;
    }
  };
});
