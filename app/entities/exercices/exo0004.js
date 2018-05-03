define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B, C;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      C = mM.alea.vector({
        name: "C",
        def: inputs,
        forbidden: [
          {
            aligned: [A, B]
          }
        ]
      }).save(inputs);
      return [A, B, C, A.toClone("D").minus(B).plus(C), B.toClone("E").minus(A).plus(C)];
    },
    getBriques: function(inputs, options, fixedSettings) {
      var A, B, C, complexe, good, goodABDC, ref;
      ref = this.init(inputs), A = ref[0], B = ref[1], C = ref[2], good = ref[3], goodABDC = ref[4];
      complexe = fixedSettings.complexe;
      if (complexe) {
        return [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                ps: ["Dans le plan complexe, on donne trois points $A$, $B$ et $C$ d'affixes respectives $z_A=" + (A.affixe().tex()) + "$, $z_B=" + (B.affixe().tex()) + "$ et $z_C=" + (C.affixe().tex()) + "$.", "Il faut déterminer l'affixe du point $D$ pour que $ABCD$ soit un parallélogramme."]
              }, {
                type: "input",
                tag: "$z_D$",
                name: "z",
                description: "Affixe de D"
              }, {
                type: "validation",
                clavier: ["aide"]
              }, {
                type: "aide",
                list: help.geometrie.analytique.plg
              }
            ],
            validations: {
              z: "number"
            },
            verifications: [
              {
                name: "z",
                tag: "$z_D$",
                good: good.affixe()
              }, function(data) {
                var z;
                z = data.z.processed.object;
                if (mM.equals(z, goodABDC.affixe())) {
                  return {
                    add: {
                      type: "ul",
                      list: [
                        {
                          type: "warning",
                          text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
                        }
                      ]
                    }
                  };
                } else {
                  return null;
                }
              }
            ]
          }
        ];
      } else {
        return [
          {
            bareme: 100,
            custom_verification_message: function(answers_data) {
              var x, y;
              x = answers_data.x.processedAnswer.object;
              y = answers_data.y.processedAnswer.object;
              if (mM.equals(x, goodABDC.x) && mM.equals(y, goodABDC.y)) {
                return {
                  add: [
                    {
                      type: "ul",
                      rank: 6,
                      list: [
                        {
                          type: "warning",
                          text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
                        }
                      ]
                    }
                  ]
                };
              }
              return null;
            },
            items: [
              {
                type: "text",
                ps: ["On se place dans un repère $(O;I,J)$", "On donne trois points $" + (A.texLine()) + "$, $" + (B.texLine()) + "$ et $" + (C.texLine()) + "$.", "Il faut déterminer les coordonnées du point $D$ pour que $ABCD$ soit un parallélogramme."]
              }, {
                type: "input",
                format: [
                  {
                    text: "D (",
                    cols: 3,
                    "class": "text-right h4"
                  }, {
                    name: "x",
                    cols: 2,
                    latex: true
                  }, {
                    text: ";",
                    cols: 1,
                    "class": "text-center h4"
                  }, {
                    name: "y",
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
                list: help.geometrie.analytique.plg
              }
            ],
            validations: {
              x: "number",
              y: "number"
            },
            verifications: [
              {
                name: "x",
                tag: "$x_D$",
                good: good.x
              }, {
                name: "y",
                tag: "$y_D$",
                good: good.y
              }, function(data) {
                var x, y;
                x = data.x.processed.object;
                y = data.y.processed.object;
                if (mM.equals(x, goodABDC.x) && mM.equals(y, goodABDC.y)) {
                  return {
                    add: {
                      type: "ul",
                      list: [
                        {
                          type: "warning",
                          text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
                        }
                      ]
                    }
                  };
                } else {
                  return null;
                }
              }
            ]
          }
        ];
      }
    },
    getExamBriques: function(inputs_list, options, fixedSettings) {
      var complexe, fct_item, that;
      complexe = fixedSettings.complexe;
      that = this;
      if (complexe) {
        fct_item = function(inputs, index) {
          var A, B, C, good, goodABDC, ref;
          ref = that.init(inputs, options), A = ref[0], B = ref[1], C = ref[2], good = ref[3], goodABDC = ref[4];
          return "$z_A=" + (A.affixe().tex()) + "$ &nbsp; ; &nbsp; $z_B=" + (B.affixe().tex()) + "$ &nbsp; et &nbsp; $z_C=" + (C.affixe().tex()) + "$";
        };
        return {
          children: [
            {
              type: "text",
              children: ["On donne les affixes de trois points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$.", "Vous devez donner l'affixe du point &nbsp; $D$ &nbsp; tel que &nbsp; $ABCD$ &nbsp; soit un parallélogramme."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        fct_item = function(inputs, index) {
          var A, B, C, good, goodABDC, ref;
          ref = that.init(inputs, options), A = ref[0], B = ref[1], C = ref[2], good = ref[3], goodABDC = ref[4];
          return "$" + (A.texLine()) + "$ &nbsp; ; &nbsp; $" + (B.texLine()) + "$ &nbsp; et &nbsp; $" + (C.texLine()) + "$";
        };
        return {
          children: [
            {
              type: "text",
              children: ["On donne les coordonnées de trois points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$.", "Vous devez donner les coordonnées du point &nbsp; $D$ &nbsp; tel que &nbsp; $ABCD$ &nbsp; soit un parallélogramme."]
            }, {
              type: "enumerate",
              refresh: true,
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    },
    getTex: function(inputs_list, options, fixedSettings) {
      var complexe, fct_item, that;
      complexe = fixedSettings.complexe;
      that = this;
      if (complexe) {
        fct_item = function(inputs, index) {
          var A, B, C, good, goodABDC, ref;
          ref = that.init(inputs, options), A = ref[0], B = ref[1], C = ref[2], good = ref[3], goodABDC = ref[4];
          return "$z_A=" + (A.affixe().tex()) + "$ ; $z_B=" + (B.affixe().tex()) + "$ et $z_C=" + (C.affixe().tex()) + "$";
        };
        return {
          children: [
            "On donne les affixes de trois points $A$, $B$ et $C$.", "Vous devez donner l'affixe de $D$ tel que $ABCD$ soit un parallélogramme.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        fct_item = function(inputs, index) {
          var A, B, C, good, goodABDC, ref;
          ref = that.init(inputs, options), A = ref[0], B = ref[1], C = ref[2], good = ref[3], goodABDC = ref[4];
          return "$" + (A.texLine()) + "$ ; $" + (B.texLine()) + "$ et $" + (C.texLine()) + "$";
        };
        return {
          children: [
            "On donne les coordonnées de trois points $A$, $B$ et $C$.", "Vous devez donner les coordonnées de $D$ tel que $ABCD$ soit un parallélogramme.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
