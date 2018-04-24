define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B, D, aire, z, zA, zAB, zAD, zB, zD;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      D = mM.alea.vector({
        name: "D",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      return [
        zA = A.affixe(), zB = B.affixe(), zD = D.affixe(), zAB = mM.exec([zB, zA, "-"], {
          simplify: true
        }), zAD = mM.exec([zD, zA, "-"], {
          simplify: true
        }), z = mM.exec([zAB, "conjugue", zAD, "*"], {
          simplify: true
        }), aire = z.getImag().toClone().abs()
      ];
    },
    getBriques: function(inputs, options) {
      var aire, ref, z, zA, zAB, zAD, zB, zD;
      ref = this.init(inputs), zA = ref[0], zB = ref[1], zD = ref[2], zAB = ref[3], zAD = ref[4], z = ref[5], aire = ref[6];
      return [
        {
          bareme: 40,
          items: [
            {
              type: "text",
              ps: ["On donne &nbsp; $A$ &nbsp; d'affixe &nbsp; $z_A=" + (zA.tex()) + "$, &nbsp; $B$ &nbsp; d'affixe &nbsp; $z_B=" + (zB.tex()) + "$ &nbsp; et &nbsp; $D$ &nbsp; d'affixe &nbsp; $z_D=" + (zD.tex()) + "$.", "Le point &nbsp; $C$ &nbsp; est tel que &nbsp; $ABCD$ &nbsp; est un parallélogramme (pas besoin de savoir l'affixe de &nbsp; $C$)", "On notera &nbsp; $z_1$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AD}$ &nbsp; et &nbsp; $z_2$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AB}$."]
            }, {
              type: "input",
              tag: "$z_1$",
              name: "z1",
              description: "Affixe de AD"
            }, {
              type: "input",
              tag: "$z_2$",
              name: "z2",
              description: "Affixe de AB"
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
              tag: "$z_1$",
              good: zAD
            }, {
              name: "z2",
              tag: "$z_2$",
              good: zAB
            }
          ]
        }, {
          bareme: 40,
          title: "$z=z_1\\cdot\\overline{z_2}$",
          items: [
            {
              type: "text",
              ps: ["Calculez le produit &nbsp; $z=z_1\\cdot\\overline{z_2}$ &nbsp; sous sa forme algébrique."]
            }, {
              type: "input",
              tag: "$z$",
              name: "z",
              description: "Forme x+iy"
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
              tag: "$z$",
              good: z
            }
          ]
        }, {
          bareme: 20,
          title: "Aire de $ABCD$",
          items: [
            {
              type: "text",
              ps: ["On peut prouver que l'aire recherchée est la valeur absolue de la partie imaginaire de &nbsp; $z$.", "Donnez l'aire de &nbsp; $ABCD$."]
            }, {
              type: "input",
              tag: "Aire",
              name: "a",
              description: "Aire"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.complexes.aire_plg
            }
          ],
          validations: {
            a: "number"
          },
          verifications: [
            {
              name: "a",
              tag: "Aire",
              good: aire
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var aire, ref, z, zA, zAB, zAD, zB, zD;
        ref = that.init(inputs, options), zA = ref[0], zB = ref[1], zD = ref[2], zAB = ref[3], zAD = ref[4], z = ref[5], aire = ref[6];
        return "$z_A=" + (zA.tex()) + "$, &nbsp; $z_B = " + (zB.tex()) + "$ &nbsp; et &nbsp; $z_D = " + (zD.tex()) + "$.";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On donne les points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $D$ &nbsp; d'affixes respectives &nbsp; $z_A$, &nbsp; $z_B$ &nbsp; et &nbsp; $z_D$.", "$C$ &nbsp; est tel que &nbsp; $ABCD$ &nbsp; est un parallélogramme.", "À chaque fois :"]
          }, {
            type: "enumerate",
            refresh: false,
            enumi: "a",
            children: ["Donnez &nbsp;$z_1$ &nbsp; et &nbsp; $z_2$, affixes respectives de &nbsp; $\\overrightarrow{AD}$ &nbsp; $\\overrightarrow{AB}$.", "Calculez &nbsp; $z_1\\cdot\\overline{z_2}$", "Déduisez l'aire de &nbsp; $ABCD$."]
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
      var aire, fct_item, ref, that, z, zA, zAB, zAD, zB, zD;
      if (inputs_list.length === 1) {
        ref = this.init(inputs_list[0], options), zA = ref[0], zB = ref[1], zD = ref[2], zAB = ref[3], zAD = ref[4], z = ref[5], aire = ref[6];
        return {
          children: [
            "On donne les points $A$, $B$ et $D$ d'affixes respectives $z_A$, $z_B$ et $z_D$.", "$z_A=" + (zA.tex()) + "$, $z_B = " + (zB.tex()) + "$ et $z_D = " + (zD.tex()) + "$.", "$C$ est tel que $ABCD$ est un parallélogramme.", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AD}$ $\\overrightarrow{AB}$.", "Calculez $z_1\\cdot\\overline{z_2}$", "Déduisez l'aire de $ABCD$."]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), zA = ref1[0], zB = ref1[1], zD = ref1[2], zAB = ref1[3], zAD = ref1[4], z = ref1[5], aire = ref1[6];
          return "$z_A=" + (zA.tex()) + "$, $z_B = " + (zB.tex()) + "$ et $z_D = " + (zD.tex()) + "$.";
        };
        return {
          children: [
            "On donne les points $A$, $B$ et $D$ d'affixes respectives $z_A$, $z_B$ et $z_D$.", "$C$ est tel que $ABCD$ est un parallélogramme.", "À chaque fois :", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AD}$ $\\overrightarrow{AB}$.", "Calculez $z_1\\cdot\\overline{z_2}$", "Déduisez l'aire de $ABCD$."]
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
