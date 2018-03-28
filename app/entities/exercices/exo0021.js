define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var N, i, max, min, moy, resolution, serie, std, table;
      if (typeof inputs.table === "undefined") {
        resolution = mM.alea.real([0.5, 1, 5, 10]);
        std = mM.alea.real({
          min: 100,
          max: 200
        }) / 100 * resolution;
        moy = mM.alea.real({
          min: 4,
          max: 10
        }) * std;
        min = quantifyNumber(moy, resolution) - 5 * resolution;
        max = quantifyNumber(moy, resolution) + 5 * resolution;
        N = mM.alea.real({
          min: 50,
          max: 200
        });
        table = (function() {
          var j, ref, results;
          results = [];
          for (i = j = 1, ref = N; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results.push(mM.alea.real({
              gaussian: {
                moy: moy,
                std: std,
                min: min,
                max: max,
                delta: resolution
              }
            }));
          }
          return results;
        })();
        serie = new SerieStat(table);
        serie.countEffectifs();
        inputs.table = serie.storeInString();
      } else {
        serie = new SerieStat(inputs.table);
      }
      return serie;
    },
    getBriques: function(inputs, options) {
      var item, serie, serie_stringArray;
      serie = this.init(inputs, options);
      serie_stringArray = serie.toStringArray();
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère la série statistique donnée par le tableau suivant.", "Donnez l'effectif total, le premier quartile, la médiane et le troisième quartile de cette série.", "Vous arrondirez à 0,1 près."]
            }, {
              type: "tableau",
              rank: 2,
              entetes: false,
              lignes: [
                _.flatten([
                  "Valeurs", (function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.value);
                    }
                    return results;
                  })()
                ]), _.flatten([
                  "Effectifs", (function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.effectif);
                    }
                    return results;
                  })()
                ])
              ]
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              name: "N",
              tag: "$N$",
              description: "Effectif total",
              good: serie.N()
            }, {
              type: "input",
              rank: 4,
              waited: "number",
              name: "q1",
              tag: "$Q_1$",
              description: "Premier quartile",
              good: serie.fractile(1, 4),
              arrondi: -1
            }, {
              type: "input",
              rank: 5,
              waited: "number",
              name: "mediane",
              tag: "Médiane",
              description: "Médiane",
              good: serie.mediane(),
              arrondi: -1
            }, {
              type: "input",
              rank: 6,
              waited: "number",
              name: "q2",
              tag: "$Q_3$",
              description: "Troisième quartile",
              good: serie.fractile(3, 4),
              arrondi: -1
            }, {
              type: "validation",
              rank: 7,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 8,
              list: help.stats.N.concat(help.stats.mediane, help.stats.quartiles)
            }
          ]
        }
      ];
    }
  };
});
