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
              ps: ["Donnez &nbsp; $z$ &nbsp; sous sa <b>forme algébrique</b> &nbsp; $z = x+iy$ &nbsp; sachant que &nbsp; $|z|=" + (m.tex()) + "$ &nbsp; et &nbsp; $Arg(z) = " + (angleRad.tex()) + "$ &nbsp; <i>en radians</i>"]
            }, {
              type: "input",
              format: [
                {
                  text: "$z =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "z"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide", "sqrt"]
            }, {
              type: "aide",
              list: help.complexes.trigo_alg
            }
          ],
          validations: {
            z: "number"
          },
          verifications: [
            {
              name: "z",
              tag: "$z$",
              good: z
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
        return "$|z| = " + (m.tex()) + "$ &nbsp; et &nbsp; $arg(z)=" + angleRad + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez &nbsp; $z$ &nbsp; sous sa forme algébrique."]
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
        return "$|z| = " + (m.tex()) + "$ et $arg(z)=" + angleRad + "$";
      };
      return {
        children: [
          "Donnez $z$ sous sa forme algébrique.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
