define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var poly;
      if (inputs.p != null) {
        poly = mM.toNumber(inputs.p);
      } else {
        poly = mM.alea.poly({
          variable: "n",
          degre: 2,
          coeffDom: {
            min: 1,
            max: 3,
            sign: true
          },
          values: {
            min: 1,
            max: 20,
            sign: true
          }
        });
        inputs.p = String(poly);
      }
      return [
        "$u_n = " + (poly.tex()) + "$", mM.float(poly, [
          {
            n: 0
          }, {
            n: 1
          }, {
            n: 2
          }, {
            n: 10
          }
        ])
      ];
    },
    getBriques: function(inputs, options) {
      var expression, ref, ref1, u0, u1, u10, u2;
      ref = this.init(inputs), expression = ref[0], (ref1 = ref[1], u0 = ref1[0], u1 = ref1[1], u2 = ref1[2], u10 = ref1[3]);
      return [
        {
          title: "Termes de la suite",
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère la suite $(u_n)$ définie par " + expression + " pour $n\\geqslant 0$.", "On demande de calculer les termes suivants :"]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$u_0$",
              name: "u0",
              description: "Terme de rang 0",
              good: u0
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$u_1$",
              name: "u1",
              description: "Terme de rang 1",
              good: u1
            }, {
              type: "input",
              rank: 4,
              waited: "number",
              tag: "$u_2$",
              name: "u2",
              description: "Terme de rang 2",
              good: u2
            }, {
              type: "input",
              rank: 5,
              waited: "number",
              tag: "$u_{10}$",
              name: "u10",
              description: "Terme de rang 10",
              good: u10
            }, {
              type: "validation",
              rank: 6,
              clavier: []
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs, options) {
      var fct_item, list, that;
      that = this;
      fct_item = function(inputs_item, index) {
        var expression, ref, ref1, u0, u1, u10, u2;
        ref = that.init(inputs_item, options), expression = ref[0], (ref1 = ref[1], u0 = ref1[0], u1 = ref1[1], u2 = ref1[2], u10 = ref1[3]);
        return expression;
      };
      list = _.map(inputs, fct_item);
      if (inputs.length === 1) {
        return {
          unique: true,
          children: [
            {
              type: "text",
              children: ["Calculez &nbsp; $u_0$, &nbsp; $u_1$, &nbsp; $u_2$ &nbsp; et &nbsp; $u_{10}$ &nbsp; avec :", list[0]]
            }
          ]
        };
      } else {
        return {
          children: [
            {
              type: "text",
              children: ["Dans les cas suivants, calculez &nbsp; $u_0$, &nbsp; $u_1$, &nbsp; $u_2$ &nbsp; et &nbsp; $u_{10}$."]
            }, {
              type: "enumerate",
              enumi: "1",
              refresh: true,
              children: list
            }
          ]
        };
      }
    },
    tex: function(data) {
      var it, its, symbs;
      symbs = ["", "<", "\\leqslant"];
      if (!isArray(data)) {
        data = [data];
      }
      its = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          it = data[i];
          results.push(it.tex.expression);
        }
        return results;
      })();
      if (its.length > 1) {
        return [
          {
            title: this.title,
            content: Handlebars.templates["tex_enumerate"]({
              pre: "Dans les cas suivants, calculez $u_0$, $u_1$, $u_2$ et $u_{10}$.",
              items: its,
              large: false
            })
          }
        ];
      } else {
        return [
          {
            title: this.title,
            content: Handlebars.templates["tex_plain"]({
              content: "Calculez $u_0$, $u_1$, $u_2$ et $u_{10}$ avec " + its[0] + ".",
              large: false
            })
          }
        ];
      }
    }
  };
});
