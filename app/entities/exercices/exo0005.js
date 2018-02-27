define(["utils/math", "utils/help"], function(mM, help) {
  return {
    getBriques: function(inputs, options) {
      var A, B, enonce, gAB, ref, ref1, zA, zB;
      ref = this.init(inputs), A = ref[0], B = ref[1], gAB = ref[2];
      if (((ref1 = options.a) != null ? ref1.value : void 0) === 1) {
        zA = A.affixe().tex();
        zB = B.affixe().tex();
        enonce = ["Dans le plan complexe, on donne deux points $A$, d'affixe $z_A=" + zA + "$ et $B$, d'affixe $z_B=" + zB + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      } else {
        enonce = ["On se place dans un repère orthonormé $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      }
      return [
        {
          bareme: 100,
          title: "Distance $AB$",
          items: [
            {
              type: "text",
              rank: 1,
              ps: enonce
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$AB$",
              name: "AB",
              description: "Distance AB",
              good: gAB
            }, {
              type: "validation",
              rank: 3,
              clavier: ["aide", "sqrt"]
            }, {
              type: "aide",
              rank: 4,
              list: help.geometrie.analytique.distance.concat(help["interface"].sqrt)
            }
          ]
        }
      ];
    },
    init: function(inputs) {
      var A, B;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      return [A, B, A.toClone().minus(B).norme()];
    }
  };
});
