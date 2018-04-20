define(["utils/math", "utils/help"], function(mM, help) {
  return {
    getBriques: function(inputs, options) {
      var A, B, droite, lastStage, ref, verticale;
      ref = this.init(inputs), A = ref[0], B = ref[1], droite = ref[2];
      verticale = droite.verticale();
      if (verticale) {
        lastStage = {
          title: "Équation",
          bareme: 80,
          items: [
            {
              type: "text",
              ps: ["L'équation est de type &nbsp; $x=a$. Donnez &nbsp; $a$."]
            }, {
              type: "input",
              tag: "$a$",
              name: "a",
              description: "Valeur de a"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.droite.equation_reduite.verticale
            }
          ],
          validations: {
            a: "number"
          },
          verifications: [
            {
              name: "a",
              tag: "$a$",
              good: droite.k()
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
              ps: ["L'équation est de type &nbsp; $y=m\\:x+p$. Donnez &nbsp; $m$ &nbsp; et &nbsp; $p$."]
            }, {
              type: "input",
              tag: "$m$",
              name: "m",
              description: "Valeur de m"
            }, {
              type: "input",
              tag: "$p$",
              name: "p",
              description: "Valeur de p"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.droite.equation_reduite.oblique
            }
          ],
          validations: {
            m: "number",
            p: "number"
          },
          verifications: [
            {
              name: "m",
              tag: "$m$",
              good: droite.m()
            }, function(data) {
              if (!(droite.m().isOne()) && mM.float(mM.exec([data["m"].processed.object, droite.m(), "*"])) === 1) {
                return {
                  add: {
                    type: "ul",
                    list: [
                      {
                        type: "warning",
                        text: "Vous avez calculé &nbsp; $\\frac{x_B-x_A}{y_B-y_A}$ &nbsp; au lieu de &nbsp; $\\frac{y_B-y_A}{x_B-x_A}$."
                      }
                    ]
                  }
                };
              } else {
                return null;
              }
            }, {
              name: "p",
              tag: "$p$",
              good: droite.p()
            }
          ]
        };
      }
      return [
        {
          bareme: 20,
          title: "Forme de l'équation réduite",
          items: [
            {
              type: "text",
              ps: ["On se place dans un repère orthogonal &nbsp; $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$.", "Il faut déterminer l'équation réduite de la droite &nbsp; $(AB)$.", "Quelle est la forme de l'équation réduite ?"]
            }, {
              type: "radio",
              tag: "Équation",
              name: "v",
              radio: ["$x=a$", "$y=mx+p$"]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.droite.equation_reduite.type
            }
          ],
          validations: {
            v: "radio:1"
          },
          verifications: [
            {
              radio: ["$x=a$", "$y=mx+p$"],
              name: "v",
              tag: "Équation",
              good: verticale ? 0 : 1
            }
          ]
        }, lastStage
      ];
    },
    init: function(inputs, options) {
      var A, B;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      return [A, B, mM.droite.par2pts(A, B)];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, droite, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], droite = ref[2];
        return "$" + (A.texLine()) + "$ &nbsp; et &nbsp; $" + (B.texLine()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$.", "Vous devez donner l'équation réduite de la droite &nbsp; $(AB)$."]
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
        var A, B, droite, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], droite = ref[2];
        return "$" + (A.texLine()) + "$ et $" + (B.texLine()) + "$";
      };
      return {
        children: [
          "On donne les coordonnées de deux points $A$ et $B$.", "Vous devez donner l'équation réduite de la droite $(AB)$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
