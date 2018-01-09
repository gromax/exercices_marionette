define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, droite;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [
          {
            axe: "x",
            coords: A
          }
        ]
      }).save(inputs);
      droite = mM.droite.par2pts(A, B);
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On considère une fonction affine &nbsp; $f$ &nbsp; telle que &nbsp; $" + (A.texFunc("f")) + "$ &nbsp; et &nbsp; $" + (B.texFunc("f")) + "$.", "On sait que &nbsp; $f(x)=a\\cdot x+b$. Vous devez donner &nbsp; $a$ &nbsp; et &nbsp; $b$."]
              }, {
                type: "input",
                rank: 2,
                waited: "number",
                tag: "$a$",
                name: "a",
                description: "Valeur de a",
                good: droite.m()
              }, {
                type: "input",
                rank: 3,
                waited: "number",
                tag: "$b$",
                name: "b",
                description: "Valeur de b",
                good: droite.p()
              }, {
                type: "validation",
                rank: 4,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 5,
                list: help.fonction.affine.expression
              }
            ]
          }
        ]
      };
    }
  };
  return Controller;
});
