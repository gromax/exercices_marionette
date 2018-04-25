define(["utils/math", "utils/help", "utils/colors", "utils/tab"], function(mM, help, colors, TabSignApi) {
  return {
    init: function(inputs) {
      return ["test"];
    },
    getBriques: function(inputs, options) {
      var message;
      message = this.init(inputs)[0];
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
