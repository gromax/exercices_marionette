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
    tex: function(data) {
      var item;
      if (!isArray(data)) {
        data = [data];
      }
      return {
        title: this.title,
        content: Handlebars.templates["tex_enumerate"]({
          pre: "Dans chaque cas, connaissant $|z|$ et $arg(z)$ en radians, donnez la forme algébrique de $z$.",
          items: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              results.push("$|z| = " + item.tex.m + "$ et $arg(z) = " + item.tex.a + "$");
            }
            return results;
          })()
        })
      };
    }
  };
});
