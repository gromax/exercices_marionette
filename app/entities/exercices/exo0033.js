define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var a, ang1, ang2, b;
      if (inputs.a != null) {
        a = Number(inputs.a);
      } else {
        a = inputs.a = mM.alea.real({
          min: 1,
          max: 5
        });
      }
      if (inputs.b != null) {
        b = Number(inputs.b);
      } else {
        b = inputs.b = mM.alea.real({
          min: 1,
          max: 5,
          no: [a]
        });
      }
      a = mM.toNumber(a);
      b = mM.toNumber(b);
      if (inputs.ang1 != null) {
        ang1 = mM.toNumber(inputs.ang1);
      } else {
        ang1 = mM.alea.number({
          values: {
            min: 1,
            max: 6
          },
          sign: true,
          coeff: 30
        });
        inputs.ang1 = String(ang1);
      }
      ang1 = mM.trigo.degToRad(ang1);
      if (inputs.ang2 != null) {
        ang2 = mM.toNumber(inputs.ang2);
      } else {
        ang2 = mM.alea.number({
          values: {
            min: 1,
            max: 6
          },
          sign: true,
          coeff: 30
        });
        inputs.ang2 = String(ang2);
      }
      ang2 = mM.trigo.degToRad(ang2);
      return [
        mM.exec(["x", a, "*", ang1, "+"], {
          simplify: true
        }).tex(), mM.exec(["x", b, "*", ang2, "+", 2, "#", "pi", "*", "*", "+"], {
          simplify: true
        }).tex(), [
          mM.exec([ang2, ang1, "-", 2, "#", "pi", "*", "*", "+", a, b, "-", "/"], {
            simplify: true,
            developp: true,
            modulo: true
          })
        ]
      ];
    },
    getBriques: function(inputs, options) {
      var membreDroiteTex, membreGaucheTex, ref, sols;
      ref = this.init(inputs), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sols = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Vous devez résoudre l'équation suivante :", "$" + membreGaucheTex + " = " + membreDroiteTex + "$", "S'il y a plusieurs solutions, séparez-les avec ;"]
            }, {
              type: "input",
              rank: 2,
              waited: "liste:number",
              name: "solutions",
              tag: "$\\mathcal{S}$",
              description: "Solutions",
              good: sols,
              moduloKey: "k"
            }, {
              type: "validation",
              rank: 4,
              clavier: ["empty", "pi"]
            }
          ]
        }
      ];
    }
  };
});
