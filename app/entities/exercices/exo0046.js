define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B, C, ang, z, zA, zAB, zAC, zB, zC;
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
        forbidden: [A]
      }).save(inputs);
      return [
        zA = A.affixe(), zB = B.affixe(), zC = C.affixe(), zAB = mM.exec([zB, zA, "-"], {
          simplify: true
        }), zAC = mM.exec([zC, zA, "-"], {
          simplify: true
        }), z = mM.exec([zAB, "conjugue", zAC, "*"], {
          simplify: true
        }), ang = z.arg(false)
      ];
    },
    getBriques: function(inputs, options) {
      var ang, ref, z, zA, zAB, zAC, zB, zC;
      ref = this.init(inputs), zA = ref[0], zB = ref[1], zC = ref[2], zAB = ref[3], zAC = ref[4], z = ref[5], ang = ref[6];
      return [
        {
          bareme: 30,
          items: [
            {
              type: "text",
              ps: ["On donne &nbsp; $A$ &nbsp; d'affixe &nbsp; $z_A=" + (zA.tex()) + "$, &nbsp; $B$ &nbsp; d'affixe &nbsp; $z_B=" + (zB.tex()) + "$ &nbsp; et &nbsp; $C$ &nbsp; d'affixe &nbsp; $z_C=" + (zC.tex()) + "$.", "On notera &nbsp; $z_1$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AC}$ &nbsp; et &nbsp; $z_2$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AB}$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$z_1 =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "z1"
                }
              ]
            }, {
              type: "input",
              format: [
                {
                  text: "$z_2 =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "z2"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.complexes.affixeVecteur
            }
          ],
          validations: {
            z1: "number",
            z2: "number"
          },
          verifications: [
            {
              name: "z1",
              good: zAC,
              tag: "$z_1$"
            }, {
              name: "z2",
              good: zAB,
              tag: "$z_2$"
            }
          ]
        }, {
          bareme: 30,
          title: "Produit $z_1\\cdot\\overline{z_2}$",
          items: [
            {
              type: "text",
              ps: ["Calculez le produit &nbsp; $z_1\\cdot\\overline{z_2}$ &nbsp; sous sa forme algébrique."]
            }, {
              type: "input",
              format: [
                {
                  text: "$z_1 \\cdot \\overline{z_2}=$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "z"
                }
              ]
            }, {
              type: "validation"
            }
          ],
          validations: {
            z: "number"
          },
          verifications: [
            {
              name: "z",
              good: z,
              tag: "$z$"
            }
          ]
        }, {
          bareme: 40,
          title: "Angle $\\widehat{BAC}$",
          items: [
            {
              type: "text",
              ps: ["L'angle que l'on cherche est l'argument de &nbsp; $z$. Donnez une approximation à 1° près de cet angle en degrés."]
            }, {
              type: "input",
              tag: "$\\widehat{BAC}$",
              name: "a",
              description: "Angle",
              good: ang
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.complexes.argument
            }
          ],
          validations: {
            a: "number"
          },
          verifications: [
            {
              name: "a",
              good: ang,
              tag: "$\\widehat{BAC}$",
              parameters: {
                arrondi: 0
              }
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ang, ref, z, zA, zAB, zAC, zB, zC;
        ref = that.init(inputs, options), zA = ref[0], zB = ref[1], zC = ref[2], zAB = ref[3], zAC = ref[4], z = ref[5], ang = ref[6];
        return "$z_A=" + (zA.tex()) + "$, &nbsp; $z_B = " + (zB.tex()) + "$ &nbsp; et &nbsp; $z_C = " + (zC.tex()) + "$.";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On donne les points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$ &nbsp; d'affixes respectives &nbsp; $z_A$, &nbsp; $z_B$ &nbsp; et &nbsp; $z_C$.", "À chaque fois :"]
          }, {
            type: "enumerate",
            refresh: false,
            enumi: "a",
            children: ["Donnez &nbsp;$z_1$ &nbsp; et &nbsp; $z_2$, affixes respectives de &nbsp; $\\overrightarrow{AC}$ &nbsp; $\\overrightarrow{AB}$.", "Calculez &nbsp; $z_1\\cdot\\overline{z_2}$", "Déduisez l'angle &nbsp; $\\widehat{BAC}$."]
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
      var ang, fct_item, ref, that, z, zA, zAB, zAC, zB, zC;
      if (inputs_list.length === 1) {
        ref = this.init(inputs_list[0], options), zA = ref[0], zB = ref[1], zC = ref[2], zAB = ref[3], zAC = ref[4], z = ref[5], ang = ref[6];
        return {
          children: [
            "On donne les points $A$, $B$ et $C$ d'affixes respectives $z_A$, $z_B$ et $z_C$.", "$z_A=" + (zA.tex()) + "$, $z_B = " + (zB.tex()) + "$ et $z_C = " + (zC.tex()) + "$.", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AC}$ $\\overrightarrow{AB}$.", "Calculez $z_1\\cdot\\overline{z_2}$", "Déduisez l'angle $\\widehat{BAC}$."]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), zA = ref1[0], zB = ref1[1], zC = ref1[2], zAB = ref1[3], zAC = ref1[4], z = ref1[5], ang = ref1[6];
          return "$z_A=" + (zA.tex()) + "$, $z_B = " + (zB.tex()) + "$ et $z_C = " + (zC.tex()) + "$.";
        };
        return {
          children: [
            "On donne les points $A$, $B$ et $C$ d'affixes respectives $z_A$, $z_B$ et $z_C$.", "À chaque fois :", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AC}$ $\\overrightarrow{AB}$.", "Calculez $z_1\\cdot\\overline{z_2}$", "Déduisez l'angle $\\widehat{BAC}$."]
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
