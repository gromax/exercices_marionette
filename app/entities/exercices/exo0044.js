define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var a, m;
      if (inputs.a != null) {
        a = mM.toNumber(inputs.a);
      } else {
        a = mM.alea.number(mM.trigo.angles());
        inputs.a = String(a);
      }
      if (inputs.m != null) {
        m = mM.toNumber(inputs.m);
      } else {
        m = mM.alea.number({
          min: 1,
          max: 10
        });
        inputs.m = String(m);
      }
      return [mM.trigo.complexe(m, a), m, mM.trigo.degToRad(a)];
    },
    getBriques: function(inputs, options) {
      var angleRad, m, ref, z;
      ref = this.init(inputs), z = ref[0], m = ref[1], angleRad = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Donnez le module et l'argument de &nbsp; $z=" + (z.tex()) + "$.", "<i>Donnez l'argument &nbsp; $\\theta$ &nbsp; en radians et en valeur principale, c'est à dire &nbsp; $-\\pi<\\theta\\leqslant \\pi$</i>."]
            }, {
              type: "input",
              format: [
                {
                  text: "$|z| =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "m"
                }
              ]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\theta =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "a"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "pi", "sqrt"]
            }, {
              type: "aide",
              list: help.complexes.argument.concat(help.complexes.module)
            }
          ],
          validations: {
            m: "number",
            a: "number"
          },
          verifications: [
            {
              name: "m",
              tag: "$|z|$",
              good: m
            }, {
              name: "a",
              tag: "$\\theta$",
              good: angleRad
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var angleRad, m, ref, z;
        ref = that.init(inputs, options), z = ref[0], m = ref[1], angleRad = ref[2];
        return "$z = " + (z.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez le module et l'argument de &nbsp; $z$."]
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
        var angleRad, m, ref, z;
        ref = that.init(inputs, options), z = ref[0], m = ref[1], angleRad = ref[2];
        return "$z = " + (z.tex()) + "$";
      };
      return {
        children: [
          "Donnez le module et l'argument de $z$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
