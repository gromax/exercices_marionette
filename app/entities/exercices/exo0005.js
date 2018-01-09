define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, enonce, gAB, ref, zA, zB;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      gAB = A.toClone().minus(B).norme();
      if (((ref = options.a) != null ? ref.value : void 0) === 1) {
        zA = A.affixe().tex();
        zB = B.affixe().tex();
        enonce = ["Dans le plan complexe, on donne deux points $A$, d'affixe $z_A=" + zA + "$ et $B$, d'affixe $z_B=" + zB + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      } else {
        enonce = ["On se place dans un repère orthonormé $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer la valeur exacte de la distance $AB$."];
      }
      return {
        inputs: inputs,
        briques: [
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
        ]
      };
    }
  };
  return Controller;
});
