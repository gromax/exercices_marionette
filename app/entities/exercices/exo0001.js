define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, droite, lastStage, verticale;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      droite = mM.droite.par2pts(A, B);
      verticale = droite.verticale();
      if (verticale) {
        lastStage = {
          title: "Équation",
          bareme: 80,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["L'équation est de type $x=a$. Donnez $a$."]
            }, {
              type: "input",
              rank: 2,
              tag: "$a$",
              name: "a",
              description: "Valeur de a",
              good: droite.k(),
              waited: "number"
            }, {
              type: "validation",
              rank: 3,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 4,
              list: help.droite.equation_reduite.verticale
            }
          ]
        };
      } else {
        lastStage = {
          title: "Équation",
          bareme: 80,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["L'équation est de type $y=m\\:x+p$. Donnez $m$ et $p$."]
            }, {
              type: "input",
              rank: 2,
              tag: "$m$",
              name: "m",
              description: "Valeur de m",
              good: droite.m(),
              waited: "number",
              custom_verification_message: function(answer_data) {
                if (!(droite.m().isOne()) && mM.float(mM.exec([answer_data["m"].processedAnswer.object, droite.m(), "*"])) === 1) {
                  return {
                    type: "warning",
                    text: "Vous avez calculé &nbsp; $\\frac{x_B-x_A}{y_B-y_A}$ &nbsp; au lieu de &nbsp; $\\frac{y_B-y_A}{x_B-x_A}$."
                  };
                } else {
                  return null;
                }
              }
            }, {
              type: "input",
              rank: 3,
              tag: "$p$",
              name: "p",
              description: "Valeur de p",
              good: droite.p(),
              waited: "number"
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide"]
            }, {
              type: "aide",
              rank: 5,
              list: help.droite.equation_reduite.oblique
            }
          ]
        };
      }
      return {
        inputs: inputs,
        briques: [
          {
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On se place dans un repère orthogonal $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer l'équation réduite de la droite $(AB)$."]
              }
            ]
          }, {
            bareme: 20,
            title: "Forme de l'équation réduite",
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["Quelle est la forme de l'équation réduite ?"]
              }, {
                type: "radio",
                rank: 2,
                tag: "Équation",
                name: "v",
                radio: ["$x=a$", "$y=mx+p$"],
                good: verticale ? 0 : 1
              }, {
                type: "validation",
                rank: 3,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 4,
                list: help.droite.equation_reduite.type
              }
            ]
          }, lastStage
        ]
      };
    }
  };
  return Controller;
});
