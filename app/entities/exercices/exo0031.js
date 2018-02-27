define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var d, r;
      if (inputs.r != null) {
        r = mM.toNumber(inputs.r);
      } else {
        r = mM.alea.number({
          values: {
            min: 1,
            max: 12,
            sign: true
          },
          denominator: {
            min: 2,
            max: 6
          }
        });
        inputs.r = String(r);
      }
      r = mM.exec([r, "pi", "*"], {
        simplify: true
      });
      if (inputs.d != null) {
        d = mM.toNumber(inputs.d);
      } else {
        d = mM.alea.number({
          min: 1,
          max: 25,
          coeff: 15
        });
        inputs.d = String(d);
      }
      return [r, mM.trigo.radToDeg(r), d, mM.trigo.degToRad(d)];
    },
    getBriques: function(inputs, options) {
      var d, gDtR, gRtD, r, ref;
      ref = this.init(inputs), r = ref[0], gRtD = ref[1], d = ref[2], gDtR = ref[3];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On donne &nbsp; $\\alpha = " + (r.tex()) + "$ &nbsp; en radians.", "Il faut donner la mesure de &nbsp; $\\alpha$ &nbsp; en degrés.", "On donne &nbsp; $\\beta = " + (d.tex()) + "$ &nbsp; en degrés.", "Il faut donner la mesure de &nbsp; $\\beta$ &nbsp; en radians."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              name: "rtd",
              tag: "$\\alpha$",
              description: "Mesure en degrés",
              good: gRtD
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              name: "dtr",
              tag: "$\\beta$",
              description: "Mesure en radians",
              good: gDtR
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide", "pi"]
            }, {
              type: "aide",
              rank: 5,
              list: help.trigo.rad_deg.concat(help.trigo.pi)
            }
          ]
        }
      ];
    }
  };
});
