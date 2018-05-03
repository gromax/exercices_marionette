define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var A, Atex, B, Btex;
      A = mM.alea.vector({
        name: "\\vec{u}",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "\\vec{v}",
        def: inputs
      }).save(inputs);
      if (mM.alea.dice(1, 2)) {
        Atex = A.texColumn();
        Btex = B.texColumn();
      } else {
        Atex = A.texSum(true);
        Btex = B.texSum(true);
      }
      return [Atex, Btex, A.scalaire(B)];
    },
    getBriques: function(inputs, options) {
      var Atex, Btex, gAB, ref;
      ref = this.init(inputs), Atex = ref[0], Btex = ref[1], gAB = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé.", "On donne deux vecteurs &nbsp; $" + Atex + "$ &nbsp; et &nbsp; $" + Btex + "$.", "Donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."]
            }, {
              type: "input",
              format: [
                {
                  text: "$\\vec{u} \\cdot \\vec{v} =$",
                  cols: 4,
                  "class": "text-right"
                }, {
                  latex: false,
                  cols: 8,
                  name: "s"
                }
              ]
            }, {
              type: "validation",
              clavier: ["aide"]
            }, {
              type: "aide",
              list: ["Si &nbsp; $\\vec{u} = \\begin{pmatrix} x\\\\ y \\end{pmatrix}$ &nbsp; et &nbsp; $\\vec{v} = \\begin{pmatrix} x'\\\\ y' \\end{pmatrix}$ &nbsp; alors &nbsp; $\\vec{u}\\cdot\\vec{v} = x\\cdot x' + y\\cdot y'$", "Quand on écrit les vecteurs comme combinaison de &nbsp; $\\vec{i}$ &nbsp; et &nbsp; $\\vec{j}$, il suffit de développer en sachant que &nbsp; $\\vec{i}\\cdot\\vec{i} = \\vec{j}\\cdot\\vec{j} = 1$ &nbsp; et &nbsp; $\\vec{i}\\cdot\\vec{j} = \\vec{j}\\cdot\\vec{i} = 0$."]
            }
          ],
          validations: {
            s: "number"
          },
          verifications: [
            {
              name: "s",
              tag: "$\\vec{u} \\cdot \\vec{v}$",
              good: gAB
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var Atex, Btex, gAB, ref;
        ref = that.init(inputs, options), Atex = ref[0], Btex = ref[1], gAB = ref[2];
        return "$" + Atex + "$ &nbsp; et &nbsp; $" + Btex + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé.", "On donne deux vecteurs &nbsp; $\\vec{u}$ &nbsp; et &nbsp; $\\vec{v}$.", "Dans chaque cas, donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."]
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
      var Atex, Btex, fct_item, gAB, ref, that;
      that = this;
      if (inputs_list.length === 1) {
        ref = that.init(inputs_list[0], options), Atex = ref[0], Btex = ref[1], gAB = ref[2];
        return {
          children: ["On se place dans un repère $(O;\\vec{i},\\vec{j})$ orthonormé.", "On donne deux vecteurs $" + Atex + "$ et $" + Btex + "$.", "Donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."]
        };
      } else {
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), Atex = ref1[0], Btex = ref1[1], gAB = ref1[2];
          return "$" + Atex + "$ et $" + Btex + "$";
        };
        return {
          children: [
            "On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé.", "On donne deux vecteurs $\\vec{u}$ et $\\vec{v}$.", "Dans chaque cas, donnez le produit scalaire $\\vec{u} \\cdot \\vec{v}$.", {
              type: "enumerate",
              enumi: "1",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
