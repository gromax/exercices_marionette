define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var A, N, _a, _b, a, b, calculInterpolation, changementVariable, chgTex, cv, ecart, i, j, max, min, r, ref, ref1, ref2, ref3, results, serie_x, serie_y, serie_z, table_x, table_y, tables, x, y;
      calculInterpolation = Number((ref = options.c.value) != null ? ref : 0) === 1;
      changementVariable = Number((ref1 = options.b.value) != null ? ref1 : 0) === 1;
      if (typeof inputs.cv !== "undefined") {
        cv = Number(inputs.cv);
      } else {
        if (changementVariable(cv = inputs.cv = mM.alea.real([1, 2, 3]))) {

        } else {
          cv = inputs.cv = 0;
        }
      }
      if (typeof inputs.table === "undefined") {
        N = mM.alea.real({
          min: 6,
          max: 8
        });
        ecart = mM.alea.real([1, 2, 4, 5, 10]);
        min = mM.alea.real([0, 1, 2, 3, 4, 5]) * ecart;
        max = (N - 1) * ecart + min;
        table_x = (function() {
          var j, ref2, results;
          results = [];
          for (i = j = 0, ref2 = N; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
            results.push(i * ecart + min);
          }
          return results;
        })();
        serie_x = new SerieStat(table_x);
        switch (cv) {
          case 1:
            _a = 2 * (1 + Math.random()) / (max - min);
            _b = 1 + Math.random() * 4 - _a * min;
            table_y = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = table_x.length; j < len; j++) {
                x = table_x[j];
                results.push(Number((Math.exp(_a * x + _b)).toFixed(0)));
              }
              return results;
            })();
            break;
          case 2:
            A = mM.alea.real({
              min: 200,
              max: 800
            });
            inputs.A = String(A);
            _a = -2 * (1 + Math.random()) / (max - min);
            _b = 2 + Math.random() - _a * min;
            table_y = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = table_x.length; j < len; j++) {
                x = table_x[j];
                results.push(Number((A / (1 + Math.exp(_a * x + _b))).toFixed(0)));
              }
              return results;
            })();
            break;
          case 3:
            A = mM.alea.real({
              min: 200,
              max: 500
            });
            inputs.A = String(A);
            _a = -2 * (1 + Math.random()) / (max - min);
            _b = Math.log(A) - Math.random() - _a * min;
            table_y = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = table_x.length; j < len; j++) {
                x = table_x[j];
                results.push(Number((A - Math.exp(_a * x + _b)).toFixed(0)));
              }
              return results;
            })();
            break;
          default:
            _a = 1.1 + Math.random() * 10 / ecart;
            _b = Math.random() * (min + max) / 2;
            table_y = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = table_x.length; j < len; j++) {
                x = table_x[j];
                results.push(Number((_a * x + _b).toFixed(0)));
              }
              return results;
            })();
        }
        serie_y = new SerieStat(table_y);
        inputs.table = serie_x.storeInString() + "_" + serie_y.storeInString();
      } else {
        tables = inputs.table.split("_");
        serie_x = new SerieStat(tables[0]);
        serie_y = new SerieStat(tables[1]);
        if ((cv === 2) || (cv === 3)) {
          A = Number(inputs.A);
        }
      }
      switch (cv) {
        case 1:
          serie_z = serie_y.transform(function(x) {
            return Math.log(x);
          });
          chgTex = "$z = \\ln(y)$";
          break;
        case 2:
          serie_z = serie_y.transform(function(x) {
            return Math.log(A / x - 1);
          });
          chgTex = "$z = \\ln\\left(\\dfrac{" + A + "}{y}-1\\right)$";
          break;
        case 3:
          serie_z = serie_y.transform(function(x) {
            return Math.log(A - x);
          });
          chgTex = "$z = \\ln(" + A + "-y)$";
          break;
        default:
          serie_z = serie_y;
          chgTex = false;
      }
      ref2 = serie_x.ajustement(serie_z, 3), a = ref2.a, b = ref2.b, r = ref2.r;
      if (calculInterpolation) {
        if (typeof inputs.i === "undefined") {
          i = inputs.i = min + Math.floor(ecart * 10 * (mM.alea.real((function() {
            results = [];
            for (var j = 1, ref3 = N - 2; 1 <= ref3 ? j <= ref3 : j >= ref3; 1 <= ref3 ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this)) + .2 + Math.random() * .6)) / 10;
        } else {
          i = Number(inputs.i);
        }
        switch (cv) {
          case 1:
            y = Math.exp(a * i + b);
            break;
          case 2:
            y = A / (1 + Math.exp(a * i + b));
            break;
          case 3:
            y = A - Math.exp(a * i + b);
            break;
          default:
            y = a * i + b;
        }
      } else {
        i = false;
        y = false;
      }
      return [serie_x, serie_y, serie_z, chgTex, a, b, i, y];
    },
    getBriques: function(inputs, options) {
      var a, b, briques, calculG, chgTex, i, ref, ref1, serie_x, serie_y, serie_z, tagVar, y;
      calculG = Number((ref = options.a.value) != null ? ref : 0) === 1;
      ref1 = this.init(inputs, options), serie_x = ref1[0], serie_y = ref1[1], serie_z = ref1[2], chgTex = ref1[3], a = ref1[4], b = ref1[5], i = ref1[6], y = ref1[7];
      briques = [
        {
          items: [
            {
              type: "text",
              ps: ["On considère la série statistique donnée par le tableau suivant :"]
            }, {
              type: "tableau",
              entetes: false,
              lignes: [_.flatten(["$x_i$", serie_x.getValues()]), _.flatten(["$y_i$", serie_y.getValues()])]
            }
          ]
        }
      ];
      if (chgTex === false) {
        tagVar = "y";
      } else {
        tagVar = "z";
        briques[0].items.push({
          type: "text",
          ps: ["On propose le changement de variable suivant : &nbsp; " + chgTex + "."]
        });
      }
      if (calculG) {
        briques.push({
          bareme: 50,
          title: "Centre du nuage",
          items: [
            {
              type: "text",
              ps: ["Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;" + tagVar + "_i\\right)$.", "Donnez ses coordonnées à 0,01 près"]
            }, {
              type: "input",
              format: [
                {
                  text: "G (",
                  cols: 3,
                  "class": "text-right h4"
                }, {
                  name: "xG",
                  cols: 2,
                  latex: true
                }, {
                  text: ";",
                  cols: 1,
                  "class": "text-center h4"
                }, {
                  name: "yG",
                  cols: 2,
                  latex: true
                }, {
                  text: ")",
                  cols: 1,
                  "class": "h4"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.stats.centre
            }
          ],
          validations: {
            xG: "number",
            yG: "number"
          },
          verifications: [
            {
              name: "xG",
              tag: "$x_G$",
              good: serie_x.moyenne(),
              parameters: {
                arrondi: -2
              }
            }, {
              name: "yG",
              tag: "$y_G$",
              good: serie_z.moyenne(),
              parameters: {
                arrondi: -2
              }
            }
          ]
        });
      }
      briques.push({
        bareme: 100,
        title: "Ajustement",
        items: [
          {
            type: "text",
            ps: ["Donnez les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$ &nbsp; à 0,001 près"]
          }, {
            type: "input",
            tag: "a",
            name: "a",
            description: "à 0,001 près"
          }, {
            type: "input",
            tag: "$b$",
            name: "b",
            description: "à 0,001 près"
          }, {
            type: "validation",
            clavier: ["aide"]
          }, {
            type: "aide",
            list: help.stats.ajustement.concat(help.stats.variance, help.stats.covariance)
          }
        ],
        validations: {
          a: "number",
          b: "number"
        },
        verifications: [
          {
            name: "a",
            good: a,
            parameters: {
              arrondi: -3
            }
          }, {
            name: "b",
            good: b,
            parameters: {
              arrondi: -3
            }
          }
        ]
      });
      if (i !== false) {
        briques.push({
          bareme: 50,
          title: "Interpolation / Extrapolation",
          items: [
            {
              type: "text",
              ps: ["Donnez la valeur de &nbsp; $y$ &nbsp; pour &nbsp; $x = " + (mM.misc.numToStr(i, 1)) + "$ &nbsp; à 0,01 près"]
            }, {
              type: "input",
              tag: "$y$",
              name: "y",
              description: "à 0,01 près"
            }, {
              type: "validation"
            }
          ],
          validations: {
            y: "number"
          },
          verifications: [
            {
              name: "y",
              good: y,
              parameters: {
                arrondi: -2
              }
            }
          ]
        });
      }
      return briques;
    },
    getExamBriques: function(inputs_list, options) {
      var calculG, calculInterpolation, changementVariable, children, fct_item, questions, ref, ref1, ref2, tagVar, that;
      calculG = Number((ref = options.a.value) != null ? ref : 0) === 1;
      changementVariable = Number((ref1 = options.b.value) != null ? ref1 : 0) === 1;
      calculInterpolation = Number((ref2 = options.c.value) != null ? ref2 : 0) === 1;
      that = this;
      fct_item = function(inputs, index) {
        var a, b, chgTex, children, i, ps, ref3, serie_x, serie_y, serie_z, y;
        ref3 = that.init(inputs, options), serie_x = ref3[0], serie_y = ref3[1], serie_z = ref3[2], chgTex = ref3[3], a = ref3[4], b = ref3[5], i = ref3[6], y = ref3[7];
        children = [
          {
            type: "tableau",
            lignes: [_.flatten(["$x_i$", serie_x.getValues()]), _.flatten(["$y_i$", serie_y.getValues()])]
          }
        ];
        ps = [];
        if (chgTex !== false) {
          ps.push("On propose le changement de variable suivant : &nbsp; " + chgTex + ".");
        }
        if (i !== false) {
          ps.push("Interpolation en &nbsp; $x = " + (mM.misc.numToStr(i, 1)) + "$");
        }
        if (ps.length > 0) {
          children.push({
            type: "text",
            ps: ps
          });
        }
        return {
          children: children
        };
      };
      if (changementVariable) {
        tagVar = "z";
      } else {
        tagVar = "y";
      }
      if (!(calculG || calculInterpolation)) {
        children = [
          {
            type: "text",
            children: ["On donne les séries statistiques suivantes.", "Dans tous les cas, donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$"]
          }
        ];
      } else {
        questions = [];
        if (calculG) {
          questions.push("Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;" + tagVar + "_i\\right)$. Donnez ses coordonnées à 0,01 près");
        }
        questions.push("Donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$");
        if (calculInterpolation) {
          questions.push("Donnez, à 0,01 près, l'interpolation de la valeur de &nbsp; $y$ &nbsp; pour la valeur de &nbsp; $x$ &nbsp; indiquée.");
        }
        children = [
          {
            type: "text",
            children: ["On donne les séries statistiques suivantes.", "Dans tous les cas :"]
          }, {
            type: "enumerate",
            enumi: "1",
            children: questions
          }
        ];
      }
      children.push({
        type: "subtitles",
        enumi: "A",
        refresh: true,
        children: _.map(inputs_list, fct_item)
      });
      return {
        children: children
      };
    },
    getTex: function(inputs_list, options) {
      var calculG, calculInterpolation, changementVariable, children, fct_item, questions, ref, ref1, ref2, tagVar, that;
      calculG = Number((ref = options.a.value) != null ? ref : 0) === 1;
      changementVariable = Number((ref1 = options.b.value) != null ? ref1 : 0) === 1;
      calculInterpolation = Number((ref2 = options.c.value) != null ? ref2 : 0) === 1;
      that = this;
      fct_item = function(inputs, index) {
        var a, b, chgTex, children, i, ps, ref3, serie_x, serie_y, serie_z, y;
        ref3 = that.init(inputs, options), serie_x = ref3[0], serie_y = ref3[1], serie_z = ref3[2], chgTex = ref3[3], a = ref3[4], b = ref3[5], i = ref3[6], y = ref3[7];
        children = [
          {
            type: "tableau",
            lignes: [_.flatten(["$x_i$", serie_x.getValues()]), _.flatten(["$y_i$", serie_y.getValues()])]
          }
        ];
        ps = [];
        if (chgTex !== false) {
          ps.push("On propose le changement de variable suivant : " + chgTex + ".");
        }
        if (i !== false) {
          ps.push("Interpolation en $x = " + (mM.misc.numToStr(i, 1)) + "$");
        }
        if (ps.length > 0) {
          children.push({
            type: "text",
            ps: ps
          });
        }
        return children;
      };
      if (changementVariable) {
        tagVar = "z";
      } else {
        tagVar = "y";
      }
      if (inputs_list.length === 1) {
        if (!(calculG || calculInterpolation)) {
          children = ["On donne la série statistique suivante.", "Donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$"];
        } else {
          questions = [];
          if (calculG) {
            questions.push("Soit &nbsp; $G$ &nbsp; le point moyen du nuage $M_i\\left(x_i;" + tagVar + "_i\\right)$. Donnez ses coordonnées à 0,01 près");
          }
          questions.push("Donnez, à 0,001 près, les coefficients de l'ajustement affine : $" + tagVar + "=ax+b$");
          if (calculInterpolation) {
            questions.push("Donnez, à 0,01 près, l'interpolation de la valeur de $y$ pour la valeur de $x$ indiquée.");
          }
          children = [
            "On donne la séries statistique suivante.", {
              type: "enumerate",
              enumi: "1",
              children: questions
            }
          ];
        }
        children.push(fct_item(inputs_list[0]));
        return {
          children: children
        };
      } else {
        if (!(calculG || calculInterpolation)) {
          children = ["On donne les séries statistiques suivantes.", "Dans tous les cas, donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$"];
        } else {
          questions = [];
          if (calculG) {
            questions.push("Soit &nbsp; $G$ &nbsp; le point moyen du nuage $M_i\\left(x_i;" + tagVar + "_i\\right)$. Donnez ses coordonnées à 0,01 près");
          }
          questions.push("Donnez, à 0,001 près, les coefficients de l'ajustement affine : $" + tagVar + "=ax+b$");
          if (calculInterpolation) {
            questions.push("Donnez, à 0,01 près, l'interpolation de la valeur de $y$ pour la valeur de $x$ indiquée.");
          }
          children = [
            "On donne les séries statistiques suivantes.", "Dans tous les cas :", {
              type: "enumerate",
              enumi: "1",
              children: questions
            }
          ];
        }
        children.push({
          type: "enumerate",
          enumi: "A)",
          children: _.map(inputs_list, fct_item)
        });
        return {
          children: children
        };
      }
    }
  };
});
