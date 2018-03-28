define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B, md, mg, solutions;
      A = mM.alea.vector({
        name: "A",
        def: inputs,
        values: [
          {
            values: {
              min: -30,
              max: 30
            },
            denominator: {
              min: 1,
              max: 5
            }
          }
        ]
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      mg = mM.exec(["x", A.x, "*", A.y, "+"], {
        simplify: true
      }).tex();
      md = mM.exec(["x", B.x, "*", B.y, "+"], {
        simplify: true
      }).tex();
      solutions = [
        mM.exec([B.y, A.y, "-", A.x, B.x, "-", "/"], {
          simplify: true
        })
      ];
      return ["$" + mg + " = " + md + "$", solutions];
    },
    getBriques: function(inputs, options) {
      var eqTex, ref, solutions;
      ref = this.init(inputs), eqTex = ref[0], solutions = ref[1];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère l'équation : $" + eqTex + "$.", "Vous devez donner la ou les solutions de cette équations, si elles existent.", "<i>S'il n'y a pas de solution, écrivez $\\varnothing$. s'il y a plusieurs solutions, séparez-les avec ;</i>"]
            }, {
              type: "input",
              rank: 3,
              waited: "liste:number",
              name: "solutions",
              tag: "$\\mathcal{S}$",
              good: goods
            }, {
              type: "validation",
              rank: 4,
              clavier: ["empty"]
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var eqTex, ref, solutions;
        ref = that.init(inputs, options), eqTex = ref[0], solutions = ref[1];
        return "$" + eqTex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On considère les équations suivantes.", "Vous devez donner la ou les solutions de ces équations, si elles existent."]
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
        var eqTex, ref, solutions;
        ref = that.init(inputs, options), eqTex = ref[0], solutions = ref[1];
        return "$" + eqTex + "$";
      };
      return {
        children: [
          "On considère les équations suivantes.", "Vous devez donner la ou les solutions de ces équations, si elles existent.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
