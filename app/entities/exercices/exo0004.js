define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, ABDC, B, C, good, goodABDC, optA, ref, ref1;
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
      good = A.toClone("D").minus(B).plus(C);
      goodABDC = B.toClone("E").minus(A).plus(C);
      optA = (ref = (ref1 = options.a) != null ? ref1.value : void 0) != null ? ref : 0;
      if (Number(optA) === 1) {
        return {
          inputs: inputs,
          briques: [
            {
              bareme: 100,
              title: "Affixe de $D$",
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
                  rank: 1,
                  ps: ["Dans le plan complexe, on donne trois points $A$, $B$ et $C$ d'affixes respectives $z_A=" + (A.affixe().tex()) + "$, $z_B=" + (B.affixe().tex()) + "$ et $z_C=" + (C.affixe().tex()) + "$.", "Il faut déterminer l'affixe du point $D$ pour que $ABCD$ soit un parallélogramme."]
                }, {
                  type: "input",
                  rank: 2,
                  tag: "$z_D$",
                  name: "z",
                  description: "Affixe de D",
                  good: good.affixe(),
                  waited: "number"
                }, {
                  type: "validation",
                  rank: 3,
                  clavier: ["aide"]
                }, {
                  type: "aide",
                  rank: 4,
                  list: help.geometrie.analytique.plg
                }
              ]
            }
          ]
        };
      } else {
        ABDC = B.toClone("D'").minus(A).plus(C);
        return {
          inputs: inputs,
          briques: [
            {
              bareme: 100,
              title: "Coordonnées de $D$",
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
                  rank: 1,
                  ps: ["On se place dans un repère $(O;I,J)$", "On donne trois points $" + (A.texLine()) + "$, $" + (B.texLine()) + "$ et $" + (C.texLine()) + "$.", "Il faut déterminer les coordonnées du point $D$ pour que $ABCD$ soit un parallélogramme."]
                }, {
                  type: "input",
                  rank: 2,
                  tag: "$x_D$",
                  name: "x",
                  description: "Abscisse de D",
                  good: good.x,
                  waited: "number"
                }, {
                  type: "input",
                  rank: 3,
                  tag: "$y_D$",
                  name: "y",
                  description: "Ordonnée de D",
                  good: good.y
                }, {
                  type: "validation",
                  rank: 4,
                  clavier: ["aide"]
                }, {
                  type: "aide",
                  rank: 5,
                  list: help.geometrie.analytique.plg
                }
              ]
            }
          ]
        };
      }
    }
  };
  return Controller;
});
