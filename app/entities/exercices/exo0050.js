define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var A, N, _a, _b, a, b, calculInterpolation, chgTex, cv, ecart, i, j, max, min, r, ref, ref1, ref2, results, serie_x, serie_y, serie_z, table_x, table_y, tables, x, y;
      calculInterpolation = Number((ref = options.c.value) != null ? ref : 0) === 1;
      if (typeof inputs.cv !== "undefined") {
        cv = Number(inputs.cv);
      } else {
        if (options.b.value === 0) {
          cv = inputs.cv = 0;
        } else {
          cv = inputs.cv = mM.alea.real([1, 2, 3]);
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
          var j, ref1, results;
          results = [];
          for (i = j = 0, ref1 = N; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
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
      ref1 = serie_x.ajustement(serie_z, 3), a = ref1.a, b = ref1.b, r = ref1.r;
      if (calculInterpolation) {
        if (typeof inputs.i === "undefined") {
          i = inputs.i = min + Math.floor(ecart * 10 * (mM.alea.real((function() {
            results = [];
            for (var j = 1, ref2 = N - 2; 1 <= ref2 ? j <= ref2 : j >= ref2; 1 <= ref2 ? j++ : j--){ results.push(j); }
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
              rank: 1,
              ps: ["On considère la série statistique donnée par le tableau suivant :"]
            }, {
              type: "tableau",
              rank: 2,
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
          rank: 3,
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
              rank: 1,
              ps: ["Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;" + tagVar + "_i\\right)$.", "Donnez ses coordonnées à 0,01 près"]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$x_G$",
              name: "xG",
              description: "Abscisse de G",
              good: serie_x.moyenne(),
              arrondi: -2
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$y_G$",
              name: "yG",
              description: "Ordonnée de G",
              good: serie_z.moyenne(),
              arrondi: -2
            }, {
              type: "validation",
              rank: 6,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 7,
              list: help.stats.centre
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
            rank: 1,
            ps: ["Donnez les coefficients de l'ajustement affine : &nbsp; $" + tagVar + "=ax+b$ &nbsp; à 0,001 près", "Donnez ses coordonnées à 0,01 près"]
          }, {
            type: "input",
            rank: 2,
            waited: "number",
            tag: "$a$",
            name: "a",
            description: "à 0,001 près",
            good: a,
            arrondi: -3
          }, {
            type: "input",
            rank: 3,
            waited: "number",
            tag: "$b$",
            name: "b",
            description: "à 0,001 près",
            good: b,
            arrondi: -3
          }, {
            type: "validation",
            rank: 6,
            clavier: ["aide"]
          }, {
            type: "aide",
            rank: 7,
            list: help.stats.ajustement.concat(help.stats.variance, help.stats.covariance)
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
              rank: 1,
              ps: ["Donnez la valeur de &nbsp; $y$ &nbsp; pour &nbsp; $x = " + (mM.misc.numToStr(i, 1)) + "$ &nbsp; à 0,01 près"]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$y$",
              name: "y",
              description: "à 0,01 près",
              good: y,
              arrondi: -2
            }, {
              type: "validation",
              rank: 6,
              clavier: []
            }
          ]
        });
      }
      return briques;
    },
    tex: function(data) {
      var A, cv, ennonce, i, itData, its, j, len, out, tables, tagVar, tex_chgt, xs, ys;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (j = 0, len = data.length; j < len; j++) {
        itData = data[j];
        cv = Number(itData.inputs.cv);
        tables = itData.inputs.table.split("_");
        xs = tables[0].split(";");
        ys = tables[1].split(";");
        xs.unshift("$x_i$");
        ys.unshift("$y_i$");
        ennonce = Handlebars.templates["tex_tabular"]({
          pre: "On considère la série statistique donnée par le tableau suivant :",
          lines: [xs, ys],
          cols: xs.length,
          large: false
        });
        switch (cv) {
          case 1:
            tex_chgt = "On propose le changement de variable suivant : $z = \\ln(y)$.";
            break;
          case 2:
            A = Number(itData.inputs.A);
            tex_chgt = "On propose le changement de variable suivant : $z = \\ln\\left(\\dfrac{" + A + "}{y}-1\\right)$.";
            break;
          case 3:
            A = Number(itData.inputs.A);
            tex_chgt = "On propose le changement de variable suivant : $z = \\ln(" + A + "-y)$.";
            break;
          default:
            tex_chgt = "";
        }
        if (cv === 0) {
          tagVar = "y";
        } else {
          tagVar = "z";
        }
        its = [];
        if (itData.options.a.value !== 0) {
          its.push("Donnez les coordonnées de $G$, centre du nuage des $M_i\\left(x_i;" + tagVar + "_i\\right)$ à $0,01$ près.");
        }
        its.push("Donnez les coefficients de l'ajustement affine : $" + tagVar + "=ax+b$ à 0,001 près");
        if (itData.options.c.value !== 0) {
          i = Number(itData.inputs.i);
          its.push("Donnez la valeur de $y$ pour $x = " + (numToStr(i, 1)) + "$ à 0,01 près");
        }
        out.push({
          title: this.title,
          content: ennonce + Handlebars.templates["tex_enumerate"]({
            pre: tex_chgt,
            items: its,
            large: false
          })
        });
      }
      return out;
    }
  };
});
