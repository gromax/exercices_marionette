define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var a, ang1, ang1R, ang2, ang2R, angSol, membreDroite, membreGauche, modulo, solutions, type;
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
      if (inputs.type != null) {
        type = inputs.type;
      } else {
        inputs.type = type = mM.alea.real(["cos", "sin"]);
      }
      ang1R = mM.trigo.degToRad(ang1);
      ang2R = mM.trigo.degToRad(ang2);
      membreGauche = mM.exec(["x", a, "*", ang1R, "+", type], {
        simplify: true
      }).tex();
      membreDroite = mM.exec([ang2R, type]).tex();
      angSol = mM.exec([ang2R, ang1R, "-", a, "/"], {
        simplify: true
      });
      modulo = mM.exec([2, "pi", "*", a, "/"], {
        simplify: true
      });
      if (type === "cos") {
        solutions = [angSol, mM.exec([angSol, "*-"])];
      } else {
        solutions = [angSol, mM.trigo.principale(["pi", angSol, "-"])];
      }
      return [membreGauche, membreDroite, solutions, modulo];
    },
    getBriques: function(inputs, options) {
      var membreDroiteTex, membreGaucheTex, modu, ref, solutions;
      ref = this.init(inputs), membreGaucheTex = ref[0], membreDroiteTex = ref[1], solutions = ref[2], modu = ref[3];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Vous devez résoudre l'équation suivante :", "$" + membreGaucheTex + " = " + membreDroiteTex + "$", "Donnez une équation sous la forme les solutions appartenant à &nbsp; $]-\\pi;+\\pi]$.", "Votre réponses doit être de la forme &nbsp; $\\cdots + k \\cdots, k\\in\\mathbb{Z}$"]
            }, {
              type: "input",
              format: [
                {
                  text: "$x =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 3,
                  name: "x"
                }, {
                  text: "$ + k \\quad\\cdot$",
                  cols: 1,
                  "class": "text-center"
                }, {
                  latex: true,
                  cols: 3,
                  name: "m"
                }, {
                  text: "$, k \\in\\mathbb{Z}$",
                  cols: 2
                }
              ]
            }, {
              type: "validation",
              clavier: ["pi"]
            }
          ],
          validations: {
            x: "number",
            m: "number"
          },
          verifications: [
            function(data) {
              var ratio, verM, verX;
              verX = mM.verification.areSome(data.x.processed, solutions, {});
              verM = mM.verification.areSome(data.m.processed, [modu, mM.exec([modu, "*-"])], {});
              if (verX.note === 0) {
                ratio = mM.float(mM.exec([data.x.processed.object, solutions[0], "-", data.m.processed.object, "/"]));
                if (ratio - Math.abs(ratio) < .000000001) {
                  verX.note = 1;
                  verX.goodMessage = {
                    type: "success",
                    text: "$" + data.x.processed.tex + "$ &nbsp; est une bonne réponse."
                  };
                } else {
                  ratio = mM.float(mM.exec([data.x.processed.object, solutions[1], "-", data.m.processed.object, "/"]));
                  if (ratio - Math.abs(ratio) < .000000001) {
                    verX.note = 1;
                    verX.goodMessage = {
                      type: "success",
                      text: "$" + data.x.processed.tex + "$ &nbsp; est une bonne réponse."
                    };
                  }
                }
              }
              return {
                note: (verX.note + verM.note) / 2,
                add: {
                  type: "ul",
                  list: [
                    {
                      type: "normal",
                      text: "Vous avez répondu &nbsp; $x= " + data.x.processed.tex + " + k \\cdot " + data.m.processed.tex + "$"
                    }
                  ].concat(verX.errors, [verX.goodMessage], verM.errors, [verM.goodMessage])
                }
              };
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var membreDroiteTex, membreGaucheTex, modulo, ref, sols;
        ref = that.init(inputs, options), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sols = ref[2], modulo = ref[3];
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
        var membreDroiteTex, membreGaucheTex, modulo, ref, sols;
        ref = that.init(inputs, options), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sols = ref[2], modulo = ref[3];
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
