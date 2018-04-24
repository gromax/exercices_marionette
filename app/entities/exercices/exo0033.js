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
        }).tex(), mM.exec(["x", b, "*", ang2, "+", 2, "Symbol:k", "pi", "*", "*", "+"], {
          simplify: true
        }).tex(), mM.exec([ang2, ang1, "-", a, b, "-", "/"], {
          simplify: true,
          developp: true
        }), mM.exec([2, "pi", "*", a, b, "-", "/"], {
          simplify: true,
          developp: true
        })
      ];
    },
    getBriques: function(inputs, options) {
      var membreDroiteTex, membreGaucheTex, modu, ref, sol;
      ref = this.init(inputs), membreGaucheTex = ref[0], membreDroiteTex = ref[1], sol = ref[2], modu = ref[3];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Vous devez résoudre l'équation suivante :", "$" + membreGaucheTex + " = " + membreDroiteTex + ", k\\in\\mathbb{Z}$", "Votre réponses doit être de la forme &nbsp; $\\cdots + k \\cdots$"]
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
              clavier: ["pi", "aide"]
            }, {
              type: "aide",
              list: ["$k$ &nbsp; est un entier quelconque. Vous pouvez le manipuler comme si sa valeur était connue, comme on le fait avec le symbole &nbsp; $\\pi$."]
            }
          ],
          validations: {
            x: "number",
            m: "number"
          },
          verifications: [
            function(data) {
              var ratio, verM, verX;
              verX = mM.verification.isSame(data.x.processed, sol, {});
              verM = mM.verification.areSome(data.m.processed, [modu, mM.exec([modu, "*-"])], {});
              if (verX.note === 0) {
                ratio = mM.float(mM.exec([data.x.processed.object, sol, "-", data.m.processed.object, "/"]));
                if (ratio - Math.abs(ratio) < .000000001) {
                  verX.note = 1;
                }
                verX.goodMessage = {
                  type: "success",
                  text: "$" + data.x.processed.tex + "$ &nbsp; est une bonne réponse."
                };
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
