define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, gAp;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      gAp = A.symetrique(B, "A'").simplify();
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            title: "Coordonnées de $A'$",
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On se place dans un repère $(O;I,J)$.", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de $A'$, symétrique de $A$ par rapport à $B$."]
              }, {
                type: "input",
                rank: 2,
                tag: "$x_{A'}$",
                name: "xAp",
                description: "Abscisse de A'",
                good: gAp.x,
                waited: "number"
              }, {
                type: "input",
                rank: 3,
                tag: "$y_{A'}$",
                name: "yAp",
                description: "Ordonnée de A'",
                good: gAp.y,
                waited: "number"
              }, {
                type: "validation",
                rank: 4,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 5,
                list: help.geometrie.analytique.symetrique
              }
            ]
          }
        ]
      };
    }
  };
  return Controller;
});
