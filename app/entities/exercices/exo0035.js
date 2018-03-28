define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var a, ang, ang1, ang2, membreDroite, membreGauche, modulo, solutions, type;
      if (inputs.a != null) {
        a = Number(inputs.a);
      } else {
        a = mM.alea.number({
          min: 2,
          max: 5
        });
        inputs.a = String(a);
      }
      if (inputs.ang1 != null) {
        ang1 = mM.toNumber(inputs.ang1);
      } else {
        ang1 = mM.alea.number({
          min: 1,
          max: 6,
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
          min: 1,
          max: 6,
          sign: true,
          coeff: 30
        });
        inputs.ang2 = String(ang2);
      }
      ang2 = mM.trigo.degToRad(ang2);
      if (inputs.type != null) {
        type = inputs.type;
      } else {
        inputs.type = type = mM.alea.real(["cos", "sin"]);
      }
      membreGauche = mM.exec(["x", a, "*", ang1, "+", type], {
        simplify: true
      }).tex();
      membreDroite = mM.exec([ang2, type]).tex();
      modulo = mM.exec([2, "pi", "*", a, "/"], {
        simplify: true
      });
      ang = mM.exec([ang2, ang1, "-", a, "/"], {
        simplify: true
      });
      if (type === "cos") {
        solutions = [ang.toClone().setModulo(modulo), ang.opposite().setModulo(modulo)];
      } else {
        solutions = [ang.toClone().setModulo(modulo), mM.trigo.principale(["pi", ang, "-"]).setModulo(modulo)];
      }
      return [membreGauche, membreDroite, solutions];
    },
    getBriques: function(inputs, options) {
      var membreDroiteTex, membreGaucheTex, ref, solutions;
      ref = this.init(inputs), membreGaucheTex = ref[0], membreDroiteTex = ref[1], solutions = ref[2];
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
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var membreDroiteTex, membreGaucheTex, ref, sols;
        ref = that.init(inputs, options), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sols = ref[2];
        return "$" + membreGaucheTex + " = " + membreDroiteTex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez les solutions des équations suivantes :"]
          }, {
            type: "enumerate",
            refresh: true,
            enumi: "1",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var membreDroiteTex, membreGaucheTex, ref, sols;
        ref = that.init(inputs, options), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sols = ref[2];
        return "$" + membreGaucheTex + " = " + membreDroiteTex + "$";
      };
      return {
        children: [
          "Donnez les solutions des équations suivantes :", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
