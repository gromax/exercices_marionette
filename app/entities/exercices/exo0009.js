define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B;
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
      return [A, B, mM.droite.par2pts(A, B)];
    },
    getBriques: function(inputs, options) {
      var A, B, droite, ref;
      ref = this.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
      return [
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
      ];
    }
  };
});
