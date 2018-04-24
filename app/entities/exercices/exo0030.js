define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    init: function(inputs) {
      var i, it, item, items, q1, q2, ranks, u, u1, u2;
      items = [];
      if ((inputs.ranks != null)) {
        ranks = (function() {
          var j, len, ref, results;
          ref = inputs.ranks.split(";");
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            it = ref[j];
            results.push(Number(it));
          }
          return results;
        })();
      } else {
        ranks = _.shuffle([0, 1, 2, 3]);
        inputs.ranks = ranks.join(";");
      }
      if (inputs.q1 != null) {
        q1 = Number(inputs.q1);
      } else {
        q1 = inputs.q1 = mM.alea.real({
          values: {
            min: 1,
            max: 10
          },
          sign: true
        });
      }
      if (inputs.q2 != null) {
        q2 = Number(inputs.q2);
      } else {
        q2 = inputs.q2 = mM.alea.real({
          values: {
            min: 1,
            max: 10
          },
          sign: true
        });
      }
      if (inputs.u1 != null) {
        u1 = Number(inputs.u1);
      } else {
        u1 = inputs.u1 = mM.alea.real({
          values: {
            min: 1,
            max: 10
          },
          sign: true
        });
      }
      if (inputs.u2 != null) {
        u2 = Number(inputs.u2);
      } else {
        u2 = inputs.u2 = mM.alea.real({
          values: {
            min: 1,
            max: 10
          },
          sign: true
        });
      }
      u = mM.suite.arithmetique({
        premierTerme: {
          valeur: u1,
          rang: 0
        },
        raison: q1
      });
      items.push({
        a: "u_n=" + (u.explicite().tex()),
        b: "u_{n+1}=" + (u.recurence().tex()),
        c: u.calc(0).tex()
      });
      u = mM.suite.geometrique({
        premierTerme: {
          valeur: u1,
          rang: 0
        },
        raison: q1
      });
      items.push({
        a: "u_n=" + (u.explicite().tex()),
        b: "u_{n+1}=" + (u.recurence().tex()),
        c: u.calc(0).tex()
      });
      u = mM.suite.arithmetique({
        premierTerme: {
          valeur: u2,
          rang: 0
        },
        raison: q2
      });
      items.push({
        a: "u_n=" + (u.explicite().tex()),
        b: "u_{n+1}=" + (u.recurence().tex()),
        c: u.calc(0).tex()
      });
      u = mM.suite.geometrique({
        premierTerme: {
          valeur: u2,
          rang: 0
        },
        raison: q2
      });
      items.push({
        a: "u_n=" + (u.explicite().tex()),
        b: "u_{n+1}=" + (u.recurence().tex()),
        c: u.calc(0).tex()
      });
      return [
        _.shuffle((function() {
          var j, len, results;
          results = [];
          for (i = j = 0, len = items.length; j < len; i = ++j) {
            item = items[i];
            results.push({
              type: "normal",
              text: "$" + item.a + "$",
              color: colors.html(ranks[i])
            });
          }
          return results;
        })()), (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = items.length; j < len; j++) {
            item = items[j];
            results.push("$" + item.b + "$ &nbsp; et &nbsp; $u_0=" + item.c + "$");
          }
          return results;
        })(), ranks
      ];
    },
    getBriques: function(inputs, options) {
      var liste_choix, liste_fixe, ranks, ref;
      ref = this.init(inputs), liste_fixe = ref[0], liste_choix = ref[1], ranks = ref[2];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              ps: ["On vous donee d'abord des suites données explicitement.", "Ensuite on vous donne des suites données par récurence.", "Associez-les en utilisant les boutons de la deuxième liste"]
            }, {
              type: "color-list",
              list: liste_fixe
            }, {
              type: "color-choice",
              name: "it",
              list: liste_choix
            }, {
              type: "validation"
            }
          ],
          validations: {
            it: "color:4"
          },
          verifications: [
            {
              name: "it",
              items: liste_choix,
              colors: ranks
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var liste_choix, liste_fixe, ranks, ref;
        ref = that.init(inputs, options), liste_fixe = ref[0], liste_choix = ref[1], ranks = ref[2];
        return {
          children: [
            {
              type: "text",
              children: ["Associez les formes explicites et les formes récurrentes deux à deux."]
            }, {
              type: "2cols",
              col1: {
                type: "enumerate",
                enumi: "a",
                children: _.pluck(liste_fixe, "text")
              },
              col2: {
                type: "enumerate",
                enumi: "1",
                children: liste_choix
              }
            }
          ]
        };
      };
      return {
        children: [
          {
            type: "subtitles",
            enumi: "A",
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
        var liste_choix, liste_fixe, ranks, ref;
        ref = that.init(inputs, options), liste_fixe = ref[0], liste_choix = ref[1], ranks = ref[2];
        return [
          "Associez les formes explicites et les formes récurrentes deux à deux.", {
            type: "multicols",
            cols: 2,
            children: [
              {
                type: "enumerate",
                enumi: "a",
                children: _.pluck(liste_fixe, "text")
              }, {
                type: "enumerate",
                enumi: "1",
                children: liste_choix
              }
            ]
          }
        ];
      };
      if (inputs_list.length > 1) {
        return {
          children: [
            {
              type: "enumerate",
              enumi: "A",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      } else {
        return {
          children: fct_item(inputs_list[0])
        };
      }
    }
  };
});
