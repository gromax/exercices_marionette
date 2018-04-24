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
    getBriques: function(inputs, options, fixedSettings) {
      var item, serie, serie_stringArray;
      serie = this.init(inputs, options);
      serie_stringArray = serie.toStringArray();
      if (fixedSettings.moyenne) {
        return [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                ps: ["On considère la série statistique donnée par le tableau suivant.", "Donnez l'effectif total, la moyenne et l'écart-type de cette série.", "Vous arrondirez à 0,1 près."]
              }, {
                type: "tableau",
                entetes: false,
                lignes: [
                  ["Valeurs"].concat((function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.value);
                    }
                    return results;
                  })()), ["Effectifs"].concat((function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.effectif);
                    }
                    return results;
                  })())
                ]
              }, {
                type: "input",
                name: "N",
                tag: "N",
                description: "Effectif total"
              }, {
                type: "input",
                name: "m",
                tag: "$\\overline{x}$",
                description: "Moyenne"
              }, {
                type: "input",
                name: "std",
                tag: "$\\sigma$",
                description: "Écart-type"
              }, {
                type: "validation",
                clavier: ["aide"]
              }, {
                type: "aide",
                list: help.stats.N.concat(help.stats.moyenne, help.stats.ecart_type)
              }
            ],
            validations: {
              N: "number",
              m: "number",
              std: "number"
            },
            verifications: [
              {
                name: "N",
                good: serie.N()
              }, {
                name: "m",
                tag: "$\\overline{x}$",
                good: serie.moyenne(),
                parameters: {
                  arrondi: -1
                }
              }, {
                name: "std",
                tag: "$\\sigma$",
                good: serie.std(),
                parameters: {
                  arrondi: -1
                }
              }
            ]
          }
        ];
      } else {
        return [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                ps: ["On considère la série statistique donnée par le tableau suivant.", "Donnez l'effectif total, le premier quartile, la médiane et le troisième quartile de cette série.", "Vous arrondirez à 0,1 près."]
              }, {
                type: "tableau",
                entetes: false,
                lignes: [
                  ["Valeurs"].concat((function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.value);
                    }
                    return results;
                  })()), ["Effectifs"].concat((function() {
                    var j, len, results;
                    results = [];
                    for (j = 0, len = serie_stringArray.length; j < len; j++) {
                      item = serie_stringArray[j];
                      results.push(item.effectif);
                    }
                    return results;
                  })())
                ]
              }, {
                type: "input",
                name: "N",
                tag: "N",
                description: "Effectif total"
              }, {
                type: "input",
                name: "q1",
                tag: "$Q_1$",
                description: "Premier quartile"
              }, {
                type: "input",
                name: "mediane",
                tag: "Médiane$",
                description: "Médiane"
              }, {
                type: "input",
                name: "q2",
                tag: "$Q_3$",
                description: "Troisième quartile"
              }, {
                type: "validation",
                clavier: ["aide"]
              }, {
                type: "aide",
                list: help.stats.N.concat(help.stats.moyenne, help.stats.ecart_type)
              }
            ],
            validations: {
              N: "number",
              m: "number",
              std: "number"
            },
            verifications: [
              {
                name: "N",
                good: serie.N()
              }, {
                name: "q1",
                tag: "$Q_1$",
                good: serie.fractile(1, 4),
                parameters: {
                  arrondi: -1
                }
              }, {
                name: "mediane",
                tag: "Médiane",
                good: serie.mediane(),
                parameters: {
                  arrondi: -1
                }
              }, {
                name: "q2",
                tag: "$Q_3$",
                good: serie.fractile(3, 4),
                parameters: {
                  arrondi: -1
                }
              }
            ]
          }
        ];
      }
    },
    getExamBriques: function(inputs_list, options, fixedSettings) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var effectifs, item, serie, serie_stringArray, values;
        serie = that.init(inputs, options);
        serie_stringArray = serie.toStringArray();
        values = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = serie_stringArray.length; j < len; j++) {
            item = serie_stringArray[j];
            results.push(item.value);
          }
          return results;
        })();
        effectifs = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = serie_stringArray.length; j < len; j++) {
            item = serie_stringArray[j];
            results.push(item.effectif);
          }
          return results;
        })();
        values.unshift("Valeurs");
        effectifs.unshift("Effectifs");
        return {
          children: [
            {
              type: "tableau",
              lignes: [values, effectifs]
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "text",
            children: fixedSettings.moyenne ? ["Dans chacun des cas suivants, on considère une série statistique donnée par un tableau.", "Donnez l'effectif total, la moyenne et l'écart-type pour chaque série.", "Vous arrondirez à 0,1 près."] : ["Dans chacun des cas suivants, on considère une série statistique donnée par un tableau.", "Donnez l'effectif total, le premier quartile, la médiane et le troisième quartile pour chaque série.", "Vous arrondirez à 0,1 près."]
          }, {
            type: "subtitles",
            enumi: "A",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options, fixedSettings) {
      var enonce, fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var effectifs, item, serie, serie_stringArray, values;
        serie = that.init(inputs, options);
        serie_stringArray = serie.toStringArray();
        values = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = serie_stringArray.length; j < len; j++) {
            item = serie_stringArray[j];
            results.push(item.value);
          }
          return results;
        })();
        effectifs = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = serie_stringArray.length; j < len; j++) {
            item = serie_stringArray[j];
            results.push(item.effectif);
          }
          return results;
        })();
        values.unshift("Valeurs");
        effectifs.unshift("Effectifs");
        return [
          {
            type: "tableau",
            setup: "|*{ " + values.length + " }{c|}",
            lignes: [values, effectifs]
          }
        ];
      };
      if (inputs_list.length === 1) {
        if (fixedSettings.moyenne) {
          enonce = ["On considère une série statistique donnée par le tableau suivant.", "Donnez l'effectif total, la moyenne et l'écart-type pour cette série.", "Vous arrondirez à 0,1 près."];
        } else {
          enonce = ["On considère une série statistique donnée par le tableau suivant.", "Donnez l'effectif total, le premier quartile, la médiane et le troisième quartile pour cette série.", "Vous arrondirez à 0,1 près."];
        }
        return {
          children: enonce.concat(fct_item(inputs_list[0], 0))
        };
      } else {
        if (fixedSettings.moyenne) {
          enonce = ["Dans chacun des cas suivants, on considère une série statistique donnée par un tableau.", "Donnez l'effectif total, la moyenne et l'écart-type pour cette chaque série.", "Vous arrondirez à 0,1 près."];
        } else {
          enonce = ["Dans chacun des cas suivants, on considère une série statistique donnée par un tableau.", "Donnez l'effectif total, le premier quartile, la médiane et le troisième quartile pour chaque série.", "Vous arrondirez à 0,1 près."];
        }
        return {
          children: enonce.concat([
            {
              type: "enumerate",
              enumi: "A",
              children: _.map(inputs_list, fct_item)
            }
          ])
        };
      }
    }
  };
});
