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
              rank: 1,
              ps: ["Donnez &nbsp; $z$ &nbsp; sous sa <b>forme algébrique</b> &nbsp; $z = x+iy$ &nbsp; sachant que &nbsp; $|z|=" + (m.tex()) + "$ &nbsp; et &nbsp; $Arg(z) = " + (angleRad.tex()) + "$ &nbsp; <i>en radians</i>"]
            }, {
              type: "ul",
              rank: 2,
              list: [
                {
                  type: "warning",
                  text: "Attention, si vous écrivez &nbsp; $i\\sqrt{\\cdots}$, mettez une espace : i sqrt(...) ou le signe de multiplication : i*sqrt(...)"
                }
              ]
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$z$",
              name: "z",
              description: "Forme x+iy",
              good: z
            }, {
              type: "validation",
              rank: 6,
              clavier: ["aide", "sqrt"]
            }, {
              type: "aide",
              rank: 7,
              list: help.complexes.trigo_alg
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
