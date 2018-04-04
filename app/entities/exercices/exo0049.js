define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var coeffs, degre, i, j, poly, ref;
      if (typeof inputs.poly === "undefined") {
        degre = mM.alea.real({
          min: 1,
          max: 4
        });
        coeffs = [0];
        for (i = j = 0, ref = degre - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          coeffs.push(mM.alea.real({
            min: -7,
            max: 7
          }));
        }
        poly = mM.polynome.make({
          coeffs: coeffs
        });
        inputs.poly = String(poly);
      } else {
        poly = mM.polynome.make(inputs.poly);
      }
      return [poly.derivate().tex(), mM.exec([poly.toNumberObject(), "symbol:c", "+"])];
    },
    getBriques: function(inputs, options) {
      var deriveeTex, poly, ref;
      ref = this.init(inputs), deriveeTex = ref[0], poly = ref[1];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Soit &nbsp; $f(x) = " + deriveeTex + "$", "Donnez l'expression <b>générale</b> de &nbsp; $F$, fonction primitive de &nbsp; $f$ &nbsp; sur &nbsp; $\\mathbb{R}$.", "<b>Attention :</b> Utilisez la lettre &nbsp; $c$ &nbsp; pour la constante faisant la généralité de &nbsp; $F$."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$F(x)$",
              name: "p",
              description: "Expression de F",
              good: poly,
              developp: true,
              alias: {
                c: ["c", "C", "K"]
              },
              custom_verification_message: function(answer_data) {
                var p;
                p = answer_data["p"].processedAnswer.object;
                if (mM.exec([poly, "symbol:c", "-", p, "-"], {
                  simplify: true
                }).isNul()) {
                  return {
                    type: "warning",
                    text: "Vous avez oublié la constante $c$.",
                    note: .5
                  };
                } else {
                  return null;
                }
              }
            }, {
              type: "validation",
              rank: 6,
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
        var deriveeTex, poly, ref;
        ref = that.init(inputs, options), deriveeTex = ref[0], poly = ref[1];
        return "$" + deriveeTex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive."]
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
        var deriveeTex, poly, ref;
        ref = that.init(inputs, options), deriveeTex = ref[0], poly = ref[1];
        return "$" + deriveeTex + "$";
      };
      return {
        children: [
          "Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
