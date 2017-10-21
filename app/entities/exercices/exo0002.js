define(["utils/math", "utils/help"], function(mM, help) {
  var Controller;
  Controller = {
    init: function(inputs, options) {
      var A, B, gM;
      A = mM.alea.vector({
        name: "A",
        def: inputs
      }).save(inputs);
      B = mM.alea.vector({
        name: "B",
        def: inputs,
        forbidden: [A]
      }).save(inputs);
      gM = A.milieu(B, "M");
      return {
        inputs: inputs,
        options: false,
        briques: [
          {
            type: "base",
            zones: [
              {
                type: "plain",
                ps: ["On se place dans un repère $(O;I,J)$", "On donne deux points $" + (A.texLine()) + "$ et $" + (B.texLine()) + "$.", "Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."]
              }
            ]
          }, {
            type: "liste",
            bareme: 100,
            title: "Coordonnées de $M$",
            liste: [
              {
                tag: "$x_M$",
                name: "xM",
                description: "Abscisse de M",
                good: gM.x,
                waited: "number",
                answerPreprocess: function(user) {
                  var pattern;
                  pattern = /^(.+)=0$/i;
                  if (user.match(pattern)) {
                    return {
                      processed: user,
                      error: false
                    };
                  } else {
                    return {
                      processed: user,
                      error: "Manque le =0"
                    };
                  }
                }
              }, {
                tag: "$y_M$",
                name: "yM",
                description: "Ordonnée de M",
                good: gM.y,
                waited: "number"
              }
            ],
            clavier: ["aide"],
            aide: help.geometrie.analytique.milieu
          }
        ]
      };
    }
  };
  return Controller;
});
