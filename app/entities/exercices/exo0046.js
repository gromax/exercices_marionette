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
              rank: 1,
              ps: ["On donne &nbsp; $A$ &nbsp; d'affixe &nbsp; $z_A=" + (zA.tex()) + "$, &nbsp; $B$ &nbsp; d'affixe &nbsp; $z_B=" + (zB.tex()) + "$ &nbsp; et &nbsp; $C$ &nbsp; d'affixe &nbsp; $z_C=" + (zC.tex()) + "$.", "On notera &nbsp; $z_1$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AC}$ &nbsp; et &nbsp; $z_2$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AB}$."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$z_1$",
              name: "z1",
              description: "Affixe de AC",
              good: zAC
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$z_1$",
              name: "z2",
              description: "Affixe de AB",
              good: zAB
            }, {
              type: "validation",
              rank: 6,
              clavier: ["aide"]
            }, {
              type: type,
              "aide": "aide",
              rank: 7,
              list: help.complexes.affixeVecteur
            }
          ]
        }, {
          bareme: 30,
          title: "Produit &nbsp; $z_1\\cdot\\overline{z_2}$",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Calculez le produit &nbsp; $z_1\\cdot\\overline{z_2}$ &nbsp; sous sa forme algébrique."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$z$",
              name: "z",
              description: "Forme x+iy",
              good: z
            }, {
              type: "validation",
              rank: 6,
              clavier: []
            }
          ]
        }, {
          bareme: 40,
          title: "Angle &nbsp; $\\widehat{BAC}$",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["L'angle que l'on cherche est l'argument de &nbsp; $z$. Donnez une approximation à 1° près de cet angle en degrés."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$\\widehat{BAC}$",
              name: "a",
              description: "Angle",
              good: ang,
              arrondi: 0
            }, {
              type: "validation",
              rank: 6,
              clavier: ["aide"]
            }, {
              type: type,
              "aide": "aide",
              rank: 7,
              list: help.complexes.argument
            }
          ]
        }
      ];
    }
  };
});
