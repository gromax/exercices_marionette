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
              good: droite.m(),
              custom_verification_message: function(answer_data) {
                if (!(droite.m().isOne()) && mM.float(mM.exec([answer_data["a"].processedAnswer.object, droite.m(), "*"])) === 1) {
                  return {
                    type: "warning",
                    text: "Vous avez calculé &nbsp; $\\frac{" + B.x + "-" + A.x + "}{" + B.y + "-" + A.y + "}$ &nbsp; au lieu de &nbsp; $\\frac{" + B.y + "-" + A.y + "}{" + B.x + "-" + A.x + "}$."
                  };
                } else {
                  return null;
                }
              }
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
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var A, B, droite, namef, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], droite = ref[2];
        namef = "f_" + index;
        return "$" + (A.texFunc(namef)) + "$ &nbsp; et &nbsp; $" + (B.texFunc(namef)) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On considère des fonctions affines dont on connaît l'image de deux antécédents.", "Donnez l'expression de ces fonctions."]
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
        var A, B, droite, namef, ref;
        ref = that.init(inputs, options), A = ref[0], B = ref[1], droite = ref[2];
        namef = "f_" + index;
        return "$" + (A.texFunc(namef)) + "$ et $" + (B.texFunc(namef)) + "$";
      };
      return {
        children: [
          "On considère des fonctions affines dont on connaît l'image de deux antécédents.", "Donnez l'expression de ces fonctions.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
