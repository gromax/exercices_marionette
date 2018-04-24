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
      return [poly.derivate().tex(), mM.exec([poly.toNumberObject(), "symbol:c", "+"]), poly.toNumberObject()];
    },
    getBriques: function(inputs, options) {
      var deriveeTex, out, poly, polySansC, ref, ref1, tag, ver, ver2;
      ref = this.init(inputs), deriveeTex = ref[0], poly = ref[1], polySansC = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Soit &nbsp; $f(x) = " + deriveeTex + "$", "Donnez l'expression <b>générale</b> de &nbsp; $F$, fonction primitive de &nbsp; $f$ &nbsp; sur &nbsp; $\\mathbb{R}$.", "<b>Attention :</b> Utilisez la lettre &nbsp; $c$ &nbsp; pour la constante faisant la généralité de &nbsp; $F$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$F(x) =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "p"
                }
              ]
            }, {
              type: "validation"
            }
          ],
          validations: {
            p: {
              alias: {
                c: ["c", "C", "K"]
              },
              developp: true
            }
          },
          verifications: [
            ver = mM.verification.isSame(data.p.processed, poly, {
              developp: true
            }), tag = (ref1 = verifItem.tag) != null ? ref1 : verifItem.name, ver.note === 0 ? (ver2 = mM.verification.isSame(data.p.processed, polySansC, {
              developp: true
            }), ver2.note > 0 ? (ver = ver2, ver.errors.push["Vous avez oublié la constante &nbsp; $c$"], ver.note = ver.note * .5) : void 0) : void 0, out = {
              note: ver.note,
              add: {
                type: "ul",
                list: [
                  {
                    type: "normal",
                    text: "<b>" + tag + "</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $" + data[verifItem.name].processed.tex + "$"
                  }, ver.goodMessage
                ].conctat(ver.errors)
              }
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var deriveeTex, poly, polySansC, ref;
        ref = that.init(inputs, options), deriveeTex = ref[0], poly = ref[1], polySansC = ref[2];
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
        var deriveeTex, poly, polySansC, ref;
        ref = that.init(inputs, options), deriveeTex = ref[0], poly = ref[1], polySansC = ref[2];
        return "$f(x) = " + deriveeTex + "$";
      };
      if (inputs_list.length > 0) {
        return {
          children: [
            "Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive.", {
              type: "enumerate",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        return {
          children: ["Donnez l'expression générale d'une primitive de " + (fct_item(inputs_list[0], 0)) + "."]
        };
      }
    }
  };
});
