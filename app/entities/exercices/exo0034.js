define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var ang, angRad, membreDroite, membreGauche, solutions, type;
      if (inputs.ang != null) {
        ang = Number(inputs.ang);
      } else {
        inputs.ang = ang = 15 * mM.alea.real({
          min: 1,
          max: 12,
          sign: true
        });
      }
      if (inputs.type != null) {
        type = inputs.type;
      } else {
        inputs.type = type = mM.alea["in"](["cos", "sin"]);
      }
      angRad = mM.trigo.degToRad([ang]);
      if (type === "cos") {
        membreGauche = mM.exec(["x", "cos"]).tex();
        membreDroite = mM.exec([angRad, "cos"]).tex();
        if ((Math.abs(ang) % 180) === 0) {
          solutions = [mM.exec([angRad, 2, "pi", "*", "modulo"])];
        } else {
          solutions = [mM.exec([angRad, 2, "pi", "*", "modulo"]), mM.exec([angRad, "*-", 2, "pi", "*", "modulo"])];
        }
      } else {
        membreGauche = mM.exec(["x", "sin"]).tex();
        membreDroite = mM.exec([angRad, "sin"]).tex();
        if (((Math.abs(ang) + 90) % 180) === 0) {
          solutions = [mM.exec([angRad, 2, "pi", "*", "modulo"])];
        } else {
          solutions = [
            mM.exec([angRad, 2, "pi", "*", "modulo"]), mM.exec(["pi", angRad, "-", 2, "#", "pi", "*", "*", "+"], {
              simplify: true,
              modulo: true
            })
          ];
        }
      }
      return [membreGauche, membreDroite, solutions];
    },
    getBriques: function(inputs, options) {
      var membreDroite, membreGauche, ref, solutions;
      ref = this.init(inputs), membreGauche = ref[0], membreDroite = ref[1], solutions = ref[2];
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
              good: solutions,
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
