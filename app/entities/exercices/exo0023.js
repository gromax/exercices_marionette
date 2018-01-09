define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, der, droite, goodEq, xAtex, yAtex;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [
          {
            axe: "x",
            coords: A
          }
        ]
      }).save(inputs);
      droite = mM.droite.par2pts(A, B);
      goodEq = droite.reduiteTex();
      xAtex = A.x.tex();
      yAtex = A.y.tex();
      der = droite.m().tex();
      return {
        inputs: inputs,
        briques: [
          {
            bareme: 100,
            items: [
              {
                type: "text",
                rank: 1,
                ps: ["On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur $\\mathbb{R}$.", "$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère.", "On sait que &nbsp; $f\\left(" + xAtex + "\\right) = " + yAtex + "$ &nbsp; et &nbsp; $f'\\left(" + xAtex + "\\right) = " + der + "$.", "Donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $" + xAtex + "$."]
              }, {
                type: "input",
                rank: 2,
                waited: "number",
                tag: "$y=$",
                name: "e",
                description: "Équation de la tangente",
                good: droite.reduiteObject(),
                developp: true,
                cor_prefix: "y=",
                formes: "FRACTION"
              }, {
                type: "validation",
                rank: 3,
                clavier: ["aide"]
              }, {
                type: "aide",
                rank: 4,
                list: help.derivee.tangente
              }
            ]
          }
        ]
      };
    },
    tex: function(data) {
      var item;
      if (!isArray(data)) {
        data = [data];
      }
      return {
        title: this.title,
        content: Handlebars.templates["tex_enumerate"]({
          pre: "Dans le(s) cas suivant(s), on considère une fonction $f$ et sa courbe. Pour une certaine valeur $a$, on donne $f(a)$ et $f'(a)$. Donnez la tangente à la courbe au point d'abscisse $a$.",
          items: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              results.push("$a=" + item.values.a + "$, $f(a)=" + item.values.y + "$ et $f'(a)=" + item.values.der + "$");
            }
            return results;
          })(),
          large: false
        })
      };
    }
  };
  return Controller;
});
