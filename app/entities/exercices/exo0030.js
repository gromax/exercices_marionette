define(["utils/math", "utils/help", "utils/colors"], function(mM, help, colors) {
  return {
    init: function(inputs) {
      var c, i, item, items, j, len, o, q1, q2, u, u1, u2;
      items = [];
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
      if (inputs.o != null) {
        o = (function() {
          var j, len, ref, results;
          ref = inputs.o;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            c = ref[j];
            results.push(Number(c));
          }
          return results;
        })();
      } else {
        o = _.shuffle([0, 1, 2, 3]);
        inputs.o = o.join("");
      }
      for (i = j = 0, len = items.length; j < len; i = ++j) {
        item = items[i];
        item.rank = o[i];
      }
      return [
        _.shuffle((function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = items.length; k < len1; k++) {
            item = items[k];
            results.push({
              type: "normal",
              text: "$" + item.a + "$",
              color: colors.html(item.rank)
            });
          }
          return results;
        })()), _.shuffle((function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = items.length; k < len1; k++) {
            item = items[k];
            results.push({
              text: "$" + item.b + "$ &nbsp; et &nbsp; $u_0=" + item.c + "$",
              rank: item.rank
            });
          }
          return results;
        })())
      ];
    },
    getBriques: function(inputs, options) {
      var liste_choix, liste_fixe, ref;
      ref = this.init(inputs), liste_fixe = ref[0], liste_choix = ref[1];
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On vous donee d'abord des suites données explicitement.", "Ensuite on vous donne des suites données par récurence.", "Associez-les en utilisant les boutons de la deuxième liste"]
            }, {
              type: "color-list",
              rank: 2,
              list: liste_fixe
            }, {
              type: "color-choice",
              rank: 3,
              name: "it",
              list: liste_choix
            }, {
              type: "validation",
              rank: 4,
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
        var liste_choix, liste_fixe, ref;
        ref = that.init(inputs, options), liste_fixe = ref[0], liste_choix = ref[1];
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
                children: _.pluck(liste_choix, "text")
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
        var liste_choix, liste_fixe, ref;
        ref = that.init(inputs, options), liste_fixe = ref[0], liste_choix = ref[1];
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
                children: _.pluck(liste_choix, "text")
              }
            ]
          }
        ];
      };
      return {
        children: [
          {
            type: "enumerate",
            enumi: "A",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    }
  };
});
