define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var optA, poly, polyDev, polyDevTex, polyTex, ref;
      if (inputs.p != null) {
        poly = mM.toNumber(inputs.p);
      } else {
        optA = Number((ref = options.a.value) != null ? ref : 0);
        if (optA === 0) {
          optA = mM.alea["in"]([1, 2, 3]);
        }
        switch (optA) {
          case 2:
            poly = mM.exec([this.aleaMult(0, false), this.aleaMult(2, true), "+"]);
            break;
          case 3:
            poly = mM.exec([this.aleaMult(2, false), this.aleaMult(2, false), "+"]);
            break;
          case 4:
            poly = mM.exec([this.aleaMult(2, false), this.aleaMult(2, true), "+"]);
            break;
          default:
            poly = mM.exec([this.aleaMult(0, false), this.aleaMult(2, false), "+"]);
        }
        inputs.p = String(poly);
      }
      return [
        poly, polyTex = polyTex = poly.tex(), polyDev = mM.exec([poly], {
          simplify: true,
          developp: true
        }), polyDevTex = "P(x)=" + polyDev.tex()
      ];
    },
    aleaMult: function(degreTotal, fraction) {
      var expr_array, n, new_degre, new_poly, total;
      expr_array = [];
      if (degreTotal === 0) {
        expr_array.push(mM.alea.number({
          min: 1,
          max: 50
        }));
      } else {
        total = 0;
        n = 0;
        while (total < degreTotal) {
          new_degre = mM.alea.real({
            min: 1,
            max: degreTotal - Math.max(total, 1)
          });
          new_poly = mM.alea.poly({
            degre: new_degre,
            coeffDom: {
              min: 1,
              max: 10,
              sign: true
            },
            values: {
              min: -10,
              max: 10
            }
          });
          if ((total + 2 * new_degre <= degreTotal) && mM.alea.dice(1, 3)) {
            total += new_degre * 2;
            expr_array.push(new_poly, 2, "^");
          } else {
            total += new_degre;
            expr_array.push(new_poly);
          }
          n += 1;
          if (n > 1) {
            expr_array.push("*");
          }
        }
      }
      if (fraction) {
        expr_array.push(mM.alea.number({
          min: 2,
          max: 9
        }), "/");
      }
      if (mM.alea.dice(1, 3)) {
        expr_array.push("*-");
      }
      return mM.exec(expr_array);
    },
    getBriques: function(inputs, options) {
      var poly, polyDev, polyDevTex, polyTex, ref;
      ref = this.init(inputs), poly = ref[0], polyTex = ref[1], polyDev = ref[2], polyDevTex = ref[3];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Développez l'expression suivante :", "$P(x) = " + polyTex + "$"]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$P(x)$",
              name: "p",
              description: "Expression développée",
              good: polyDev,
              goodTex: polyDevTex,
              developp: true
            }, {
              type: "validation",
              rank: 3,
              clavier: []
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var poly, polyDev, polyDevTex, polyTex, ref;
        ref = that.init(inputs, options), poly = ref[0], polyTex = ref[1], polyDev = ref[2], polyDevTex = ref[3];
        return "$P_{" + index + "}(x) = " + polyTex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Développez les expressions suivantes."]
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
        var poly, polyDev, polyDevTex, polyTex, ref;
        ref = that.init(inputs, options), poly = ref[0], polyTex = ref[1], polyDev = ref[2], polyDevTex = ref[3];
        return "$P_{" + index + "}(x) = " + polyTex + "$";
      };
      return {
        children: [
          "Développez les expressions suivantes.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
