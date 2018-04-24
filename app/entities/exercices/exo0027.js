define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, B, gInverse, gProduit, gQuotient, gSomme, zA, zB;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs
      }).save(inputs);
      zA = A.affixe();
      zB = B.affixe();
      gSomme = mM.exec([zA, zB, "+"], {
        simplify: true
      });
      gProduit = mM.exec([zA, zB, "*"], {
        simplify: true
      });
      gInverse = mM.exec([zA, "^-1"], {
        simplify: true
      });
      gQuotient = mM.exec([zA, zB, "/"], {
        simplify: true
      });
      return [zA, zB, gSomme, gProduit, gInverse, gQuotient];
    },
    getBriques: function(inputs, options) {
      var gInverse, gProduit, gQuotient, gSomme, ref, zA, zB;
      ref = this.init(inputs), zA = ref[0], zB = ref[1], gSomme = ref[2], gProduit = ref[3], gInverse = ref[4], gQuotient = ref[5];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On considère deux nombres complexes &nbsp; $z_1 = " + (zA.tex()) + "$ &nbsp; et &nbsp; $z_2 = " + (zB.tex()) + "$.", "Donnez les résultats des calculs suivants :"]
            }, {
              type: "input",
              tag: "$z_1 + z_2$",
              name: "s",
              description: "Somme"
            }, {
              type: "input",
              tag: "$z_1\\times z_2$",
              name: "p",
              description: "Produit"
            }, {
              type: "input",
              tag: "$\\frac{1}{z_1}$",
              name: "i",
              description: "Inverse"
            }, {
              type: "input",
              tag: "$\\frac{z_1}{z_2}$",
              name: "q",
              description: "Quotient"
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: help.complexes.basics
            }
          ],
          validations: {
            s: "number",
            p: "number",
            i: "number",
            q: "number"
          },
          verifications: [
            {
              name: "s",
              tag: "$z_1 + z_2$",
              good: gSomme
            }, {
              name: "p",
              tag: "$z_1\\times z_2$",
              good: gProduit
            }, {
              name: "i",
              tag: "$\\frac{1}{z_1}$",
              good: gInverse,
              parameters: {
                formes: "FRACTION"
              }
            }, {
              name: "q",
              tag: "$\\frac{z_1}{z_2}$",
              good: gQuotient,
              parameters: {
                formes: "FRACTION"
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
        var gInverse, gProduit, gQuotient, gSomme, ref, zA, zB;
        ref = that.init(inputs, options), zA = ref[0], zB = ref[1], gSomme = ref[2], gProduit = ref[3], gInverse = ref[4], gQuotient = ref[5];
        return "$z_1=" + (zA.tex()) + "$ &nbsp; et &nbsp; $z_2=" + (zB.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Dans chaque cas, calculez &nbsp; $z_1 + z_2$, &nbsp; $z_1\\cdot z_2$, &nbsp; $\\frac{1}{z_1}$ &nbsp; et &nbsp; $\\frac{z_1}{z_2}$."]
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
        var gInverse, gProduit, gQuotient, gSomme, ref, zA, zB;
        ref = that.init(inputs, options), zA = ref[0], zB = ref[1], gSomme = ref[2], gProduit = ref[3], gInverse = ref[4], gQuotient = ref[5];
        return "$z_1=" + (zA.tex()) + "$ et $z_2=" + (zB.tex()) + "$";
      };
      return {
        children: [
          "Dans chaque cas, calculez $z_1 + z_2$, $z_1\\cdot z_2$, $\\frac{1}{z_1}$ et $\\frac{z_1}{z_2}$.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
