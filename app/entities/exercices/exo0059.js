define(["app", "utils/math", "utils/help", "utils/colors", "utils/tab", "mathjax"], function(app, mM, help, colors, TabSignApi, MathJax) {
  return {
    init: function(inputs) {
      var tab, tabS, tabX;
      tabX = ["$-\\infty$", "$x_1$", "$x_2$", "$+\\infty$"];
      tabS = ",-,z,+,z,-,";
      tab = (TabSignApi.make(tabX, {
        hauteur_ligne: 25,
        color: colors.html(0),
        texColor: colors.tex(0)
      })).addSignLine(tabS);
      return ["test", tab];
    },
    getBriques: function(inputs, options) {
      var initTab, message, ref, tab;
      ref = this.init(inputs), message = ref[0], tab = ref[1];
      initTab = function(view) {
        var $container, $el, svg;
        $container = view.$el;
        $el = $("<div></div>");
        $container.append($el);
        svg = tab.render($el[0]);
        return view.listenTo(app, "zoom", function(r) {
          tab.render($el[0]);
          return MathJax.Hub.Queue(["Typeset", MathJax.Hub, $el[0]]);
        });
      };
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Mon text de test."]
            }, {
              type: "add-input",
              text: "Ensemble solution.",
              name: "pwet"
            }, {
              type: "def",
              rank: 2,
              renderingFunctions: [initTab]
            }, {
              type: "validation"
            }
          ],
          validations: {},
          verifications: []
        }
      ];
    }
  };
});
