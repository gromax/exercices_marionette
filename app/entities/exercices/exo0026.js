define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, gAB;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs
      }).save(inputs);
      gAB = B.toClone("\\overrightarrow{AB}").am(A, true).simplify();
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On se place dans un repère &nbsp; $(O;I,J)$.", "On donne deux points &nbsp; $" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de &nbsp; $\\overrightarrow{AB}$."]
              }, {
                type: "input",
                rank: 2,
                waited: "number",
                name: "x",
                description: "Abscisse du vecteur",
                tag: "$x_{\\overrightarrow{AB}}$",
                good: gAB.x
              }, {
                type: "input",
                rank: 3,
                waited: "number",
                name: "y",
                description: "Ordonnée du vecteur",
                tag: "$y_{\\overrightarrow{AB}}$",
                good: gAB.y
              }, {
                type: "validation",
                rank: 4,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 5,
                list: help.vecteur.coordonnes
              }
            ]
          }
        ]
      };
    }
  };
  return Controller;
});
