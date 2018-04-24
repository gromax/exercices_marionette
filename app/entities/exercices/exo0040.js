define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var N, expression, values;
      if (inputs.e != null) {
        expression = mM.parse(inputs.e, {
          simplify: false
        });
      } else {
        values = [];
        N = 2;
        while (values.length < N) {
          values.push(mM.alea.number({
            values: {
              min: 1,
              max: 30
            },
            denominator: {
              min: 2,
              max: 7
            },
            sign: true
          }));
          if (values.length > 1) {
            values.push("+");
          }
        }
        expression = mM.exec(values);
        inputs.e = String(expression);
      }
      return expression;
    },
    getBriques: function(inputs, options) {
      var expression;
      expression = this.init(inputs);
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["Soit &nbsp; $x=" + (expression.tex()) + "$.", "Donnez &nbsp; $x$ &nbsp; sous forme d'une fraction réduite."]
            }, {
              type: "input",
              format: [
                {
                  text: "$x =$",
                  cols: 2,
                  "class": "text-right"
                }, {
                  latex: true,
                  cols: 10,
                  name: "x"
                }
              ]
            }, {
              type: "validation"
            }
          ],
          validations: {
            "x": "number"
          },
          verifications: [
            {
              name: "x",
              tag: "$x$",
              good: expression.toClone().simplify()
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var expression;
        expression = that.init(inputs, options);
        return "$" + (expression.tex()) + "$";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Donnez les expressions sous forme d'une fraction réduite."]
          }, {
            type: "enumerate",
            enumi: "1",
            refresh: true,
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    getTex: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var expression;
        expression = that.init(inputs, options);
        return "$" + (expression.tex()) + "$";
      };
      return {
        children: [
          "Donnez les expressions sous forme d'une fraction réduite.", {
            type: "enumerate",
            enumi: "1)",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
