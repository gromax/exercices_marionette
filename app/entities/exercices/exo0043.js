define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs) {
      var c, q, r;
      if (typeof inputs.r === "undefined") {
        r = inputs.r = mM.alea.real({
          min: 15,
          max: 50
        }) / 10;
      } else {
        r = Number(inputs.r);
      }
      if (typeof inputs.c === "undefined") {
        c = inputs.c = mM.alea.real({
          min: 1,
          max: 8
        });
      } else {
        c = Number(inputs.c);
      }
      return [c * 1000, r, q = 1 + r / 100, Math.ceil(Math.log(2) / Math.log(q))];
    },
    getBriques: function(inputs, options) {
      var c0, n, q, r, ref;
      ref = this.init(inputs), c0 = ref[0], r = ref[1], q = ref[2], n = ref[3];
      return [
        {
          bareme: 50,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Le 1 janvier 2010, on place la somme de " + c0 + " € sur un compte bancaire qui rapporte tous les ans " + (mM.misc.numToStr(r)) + "&nbsp;% d'intérêts composés.", "Soit &nbsp; $(C_n)$ &nbsp; la suite représentant le capital sur le compte au 1 janvier de l'année &nbsp; $2010+n$.", "Donnez le premier terme &nbsp; $C_0$ &nbsp; et la raison &nbsp; $q$ &nbsp; de la suite."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$C_0$",
              name: "c0",
              description: "Premier terme",
              good: c0
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "$q$",
              name: "q",
              description: "Raison",
              good: q
            }, {
              type: "validation",
              rank: 6,
              clavier: []
            }
          ]
        }, {
          bareme: 50,
          title: "Doublement du capital",
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["Donnez le rang &nbsp; $n$ &nbsp; de l'année pour laquelle le capital aura doublé.", "Précisez l'année correspondante."]
            }, {
              type: "input",
              rank: 2,
              waited: "number",
              tag: "$n$",
              name: "n",
              description: "Rang du doublement",
              good: n
            }, {
              type: "input",
              rank: 3,
              waited: "number",
              tag: "Année",
              name: "a",
              description: "Année du doublement",
              good: 2010 + n
            }, {
              type: "validation",
              rank: 6,
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
        var c0, n, q, r, ref;
        ref = that.init(inputs, options), c0 = ref[0], r = ref[1], q = ref[2], n = ref[3];
        return "Capital initial : " + c0 + " € ; taux : " + (mM.misc.numToStr(r)) + "&nbsp;%";
      };
      return {
        children: [
          {
            type: "text",
            children: ["Le 1 janvier 2010, on place une somme sur un compte bancaire qui rapporte tous les ans des intérêts.", "Soit &nbsp; $(C_n)$ &nbsp; la suite représentant le capital sur le compte au 1 janvier de l'année &nbsp; $2010+n$.", "Dans tous les cas :"]
          }, {
            type: "enumerate",
            refresh: false,
            enumi: "a",
            children: ["Donnez le premier terme &nbsp; $C_0$ &nbsp; et la raison &nbsp; $q$ &nbsp; de la suite.", "Donnez le rang &nbsp; $n$ &nbsp; de l'année pour laquelle le capital aura doublé.", "Précisez l'année correspondante."]
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
      var c0, fct_item, n, q, r, ref, that;
      if (inputs_list.length === 1) {
        ref = that.init(inputs_list[0], options), c0 = ref[0], r = ref[1], q = ref[2], n = ref[3];
        return {
          children: [
            "Le 1 janvier 2010, on place une somme de " + c0 + " € sur un compte bancaire qui rapporte tous les ans " + (mM.misc.numToStr(r)) + "\\,\\% des intérêts composés.", "Soit $(C_n)$ la suite représentant le capital sur le compte au 1 janvier de l'année $2010+n$.", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez le premier terme $C_0$ et la raison $q$ de la suite.", "Donnez le rang $n$ de l'année pour laquelle le capital aura doublé.", "Précisez l'année correspondante."]
            }
          ]
        };
      } else {
        that = this;
        fct_item = function(inputs, index) {
          var ref1;
          ref1 = that.init(inputs, options), c0 = ref1[0], r = ref1[1], q = ref1[2], n = ref1[3];
          return "Capital initial : " + c0 + " € ; taux : " + (mM.misc.numToStr(r)) + "\\,\\%";
        };
        return {
          children: [
            "Le 1 janvier 2010, on place une somme sur un compte bancaire qui rapporte tous les ans des intérêts.", "Soit $(C_n)$ la suite représentant le capital sur le compte au 1 janvier de l'année $2010+n$.", "Dans tous les cas :", {
              type: "enumerate",
              enumi: "a)",
              children: ["Donnez le premier terme $C_0$ et la raison $q$ de la suite.", "Donnez le rang $n$ de l'année pour laquelle le capital aura doublé.", "Précisez l'année correspondante."]
            }, {
              type: "enumerate",
              enumi: "1)",
              children: _.map(inputs_list, fct_item)
            }
          ]
        };
      }
    }
  };
});
