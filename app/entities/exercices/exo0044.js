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
              ps: ["Donnez le module et l'argument de &nbsp; $z=" + (z.tex()) + "$.", "<i>Donnez l'argument &nbsp; $\\theta$ &nbsp; en radians et en valeur principale, c'est à dire &nbsp; $-\\pi<\\theta\\leqslant \\pi$</i>."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$|z|",
              name: "m",
              description: "Module de z",
              good: m
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$\\theta",
              name: "a",
              description: "Argument de z",
              good: angleRad
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide", "pi"]
            }, {
              type: "aide",
              rank: 5,
              list: help.complexes.argument.concat(help.complexes.module)
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
          pre: "Dans chaque cas, donnez le module $|z|$ et l'argument $arg(z)$.",
          items: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              results.push("$z = " + item.tex.z + "$");
            }
            return results;
          })()
        })
      };
    }
  };
});
