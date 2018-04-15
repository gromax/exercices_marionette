define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var ang, d;
      if (inputs.d != null) {
        d = mM.toNumber(inputs.d);
      } else {
        d = mM.alea.number({
          min: 6,
          max: 20,
          coeff: 50
        });
        inputs.d = String(d);
      }
      ang = mM.trigo.degToRad(d);
      return [ang, mM.trigo.principale(ang)];
    },
    getBriques: function(inputs, options) {
      var ang, p, ref;
      ref = this.init(inputs), ang = ref[0], p = ref[1];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On donne l'angle &nbsp; $\\alpha = " + (ang.tex()) + "$ &nbsp; en radians.", "Vous devez donner la mesure principale de cet angle."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              name: "a",
              tag: "$\\alpha$",
              description: "Mesure principale",
              good: p
            }, {
              type: "validation",
              rank: 4,
              clavier: ["aide", "pi"]
            }, {
              type: "aide",
              rank: 5,
              list: help.trigo.radian.concat(help.trigo.pi, help.trigo.mesure_principale)
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var ang, p, ref;
        ref = that.init(inputs, options), ang = ref[0], p = ref[1];
        return "$\\alpha =" + (ang.tex()) + "$ &nbsp; radians";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez la mesure principale de &nbsp; $\\alpha$."]
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
        var ang, p, ref;
        ref = that.init(inputs, options), ang = ref[0], p = ref[1];
        return "$\\alpha =" + (ang.tex()) + "$ radians";
      };
      return {
        children: [
          "Donnez la mesure principale de $\\alpha$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});