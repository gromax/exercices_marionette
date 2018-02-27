define(["utils/math"], function(mM) {
  return {
    init: function(inputs, options) {
      var K_good, Y, a, b, c, expo, expoF, forme_y1_tex, good_y, good_y0, good_y0F, good_y1, good_y1F, good_yF, operands, optA, premier_membre_tex, second_membre_tex, symboles_a_trouver, u0, u1, u_nul, y0;
      optA = Number(options.a.value);
      if (typeof inputs.a !== "undefined") {
        a = Number(inputs.a);
      } else {
        a = mM.alea.real({
          min: 1,
          max: 10,
          sign: true
        });
        inputs.a = String(a);
      }
      if (typeof inputs.b !== "undefined") {
        b = Number(inputs.b);
      } else {
        b = mM.alea.real({
          min: 1,
          max: 10,
          sign: true
        });
        inputs.b = String(b);
      }
      switch (false) {
        case typeof inputs.u0 === "undefined":
          u0 = Number(inputs.u0);
          break;
        case !((optA === 2) || ((optA === 3) && mM.alea.dice(1, 2))):
          u0 = 0;
          break;
        default:
          u0 = mM.alea.real({
            min: 1,
            max: 5
          });
      }
      inputs.u0 = String(u0);
      switch (false) {
        case typeof inputs.u1 === "undefined":
          u1 = Number(inputs.u1);
          break;
        case !((u0 !== 0) && mM.alea.dice(1, 10)):
          u1 = mM.alea.real({
            min: 1,
            max: 5
          });
          break;
        default:
          u1 = 0;
      }
      inputs.u1 = String(u1);
      u_nul = (u0 === 0) && (u1 === 0);
      switch (false) {
        case typeof inputs.Y === "undefined":
          Y = Number(inputs.Y);
          break;
        case !((optA === 1) || (optA === 3) && !u_nul):
          Y = 0;
          break;
        case optA !== 0:
          Y = mM.alea.real({
            min: 0,
            max: 10
          });
          break;
        default:
          Y = mM.alea.real({
            min: 1,
            max: 10
          });
      }
      inputs.Y = String(Y);
      if (typeof inputs.y0 !== "undefined") {
        y0 = Number(inputs.y0);
      } else {
        y0 = mM.alea.real({
          min: 0,
          max: 10
        });
        inputs.y0 = String(y0);
      }
      expo = mM.exec([b, "*-", a, "/", "t", "*", "exp"], {
        simplify: true
      });
      expoF = mM.exec([b / a, "*-", "t", "*", "exp"], {
        simplify: true
      });
      if ((u1 !== 0) || (u0 !== 0)) {
        operands = [u1, "t", "*", u0, "+", expo, "*"];
      } else {
        operands = [0];
      }
      if (Y !== 0) {
        operands.push(Y, "+");
      }
      c = mM.exec(operands, {
        simplify: true
      });
      premier_membre_tex = mM.exec([a, "symbol:y'", "*", b, "symbol:y", "*", "+"], {
        simplify: true
      }).tex();
      second_membre_tex = c.tex({
        altFunctionTex: ["exp"]
      });
      good_y0 = mM.exec(["symbol:K", expo, "*"], {
        simplify: true
      });
      good_y0F = mM.exec(["symbol:K", expoF, "*"], {
        simplify: true
      });
      good_y1 = mM.exec([u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", expo, "*", Y, b, "/", "+"], {
        simplify: true
      });
      good_y1F = mM.exec([u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", expoF, "*", Y, b, "/", "+"], {
        simplify: true
      });
      K_good = mM.exec([y0, Y, b, "/", "-"], {
        simplify: true
      });
      good_y = mM.exec([u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", K_good, "+", expo, "*", Y, b, "/", "+"], {
        simplify: true
      });
      good_yF = mM.exec([u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", K_good, "+", expoF, "*", Y, b, "/", "+"], {
        simplify: true
      });
      switch (false) {
        case !u_nul:
          forme_y1_tex = "C";
          symboles_a_trouver = ["$C$"];
          break;
        case !((Y === 0) && (u1 === 0)):
          forme_y1_tex = mM.exec(["symbol:a", "t", "*", expo, "*"]).tex({
            altFunctionTex: ["exp"]
          });
          symboles_a_trouver = ["$a$"];
          break;
        case u1 !== 0:
          forme_y1_tex = mM.exec(["symbol:a", "t", "*", expo, "*", "symbol:C", "+"]).tex({
            altFunctionTex: ["exp"]
          });
          symboles_a_trouver = ["$a$", "$C$"];
          break;
        case !(Y === 0):
          forme_y1_tex = mM.exec(["symbol:a", "t", 2, "^", "*", "symbol:b", "t", "*", "+", expo, "*"]).tex({
            altFunctionTex: ["exp"]
          });
          symboles_a_trouver = ["$a$", "$b$"];
          break;
        default:
          forme_y1_tex = mM.exec(["symbol:a", "t", 2, "^", "*", "symbol:b", "t", "*", "+", expo, "*", "symbol:C", "+"]).tex({
            altFunctionTex: ["exp"]
          });
          symboles_a_trouver = ["$a$", "$b$", "$C$"];
      }
      return [premier_membre_tex, second_membre_tex, good_y0, good_y0F, forme_y1_tex, symboles_a_trouver, good_y1, good_y1F, y0, good_y, good_yF];
    },
    getBriques: function(inputs, options) {
      var forme_y1_tex, good_y, good_y0, good_y0F, good_y1, good_y1F, good_yF, premier_membre_tex, ref, second_membre_tex, symboles_a_trouver, y0;
      ref = this.init(inputs, options), premier_membre_tex = ref[0], second_membre_tex = ref[1], good_y0 = ref[2], good_y0F = ref[3], forme_y1_tex = ref[4], symboles_a_trouver = ref[5], good_y1 = ref[6], good_y1F = ref[7], y0 = ref[8], good_y = ref[9], good_yF = ref[10];
      return [
        {
          items: [
            {
              type: "text",
              rank: 0,
              ps: ["Soit l'équation différentielle $(E):" + premier_membre_tex + " = " + second_membre_tex + "$"]
            }, {
              type: "ul",
              rank: 1,
              list: [
                {
                  type: "warning",
                  text: "Écrivez exp(...) et pas e^..."
                }, {
                  type: "warning",
                  text: "Utilisez &nbsp; $K$ &nbsp; comme constante et quand vous écrivez &nbsp; $K \\exp(\\cdots)$, faites attention de séparer &nbsp; $K$ &nbsp; et &nbsp; $\\exp$ &nbsp; au minimum d'une espace."
                }
              ]
            }
          ]
        }, {
          title: "Équation sans second membre",
          bareme: 34,
          items: [
            {
              type: "text",
              rank: 0,
              ps: ["Donnez l'expression de &nbsp; $y_0$, solution générale de l'équation : &nbsp; $\\left(E_0\\right) : " + premier_membre_tex + " = 0$.", "Vous noterez &nbsp; $K$ &nbsp; la constante utile."]
            }, {
              type: "input",
              rank: 1,
              waited: "number",
              tag: "$y_0(t)$",
              name: "y0",
              description: "Solution générale de E0",
              alias: {
                K: ["K", "k", "A", "C"]
              },
              good: [good_y0, good_y0F],
              goodTex: good_y0.tex({
                altFunctionTex: ["exp"]
              })
            }, {
              type: "validation",
              rank: 2,
              clavier: []
            }
          ]
        }, {
          title: "Solution particulière",
          bareme: 33,
          items: [
            {
              type: "text",
              rank: 0,
              ps: ["Il existe une solution particulière de &nbsp; $(E)$ &nbsp; dont l'expression est de la forme &nbsp; $y_1(t) = " + forme_y1_tex + " $.", "Donnez cette solution en précisant le(s) valeur(s) de &nbsp; " + (symboles_a_trouver.join(", &nbsp; ")) + "."]
            }, {
              type: "input",
              rank: 1,
              waited: "number",
              tag: "$y_1(t)$",
              name: "y1",
              description: "Solution particulière de E",
              good: [good_y1, good_y1F],
              goodTex: good_y1.tex({
                altFunctionTex: ["exp"]
              })
            }, {
              type: "validation",
              rank: 2,
              clavier: []
            }
          ]
        }, {
          title: "Solution avec contrainte",
          bareme: 33,
          items: [
            {
              type: "text",
              rank: 0,
              ps: ["Soit &nbsp; $y$ &nbsp; une solution de &nbsp; $(E)$ &nbsp; qui vérifie &nbsp; $y(0) = " + y0 + "$.", "Donnez l'expression de &nbsp; $y$."]
            }, {
              type: "input",
              rank: 1,
              waited: "number",
              tag: "$y(t)$",
              name: "y",
              description: "Solution telle que y(0) = " + y0,
              good: [good_y, good_yF],
              goodTex: good_y.tex({
                altFunctionTex: ["exp"]
              })
            }, {
              type: "validation",
              rank: 2,
              clavier: []
            }
          ]
        }
      ];
    },
    tex: function(data) {
      var i, itData, len, out;
      if (!isArray(data)) {
        data = [data];
      }
      out = [];
      for (i = 0, len = data.length; i < len; i++) {
        itData = data[i];
        out.push({
          title: this.title,
          content: Handlebars.templates["tex_enumerate"]({
            pre: "Soit l'équation différentielle $(E):" + itData.tex.premier_membre + " = " + itData.tex.second_membre + "$",
            items: ["Donnez $y_0(t)$, expression de la solution générale de $\\left(E_0\\right):" + itData.tex.premier_membre + " = 0$", "Une solution générale de $(E)$ est de la forme $y_1(t) = " + itData.tex.forme_y1_tex + "$. Donnez cette solution en précisant le(s) valeur(s) de " + (itData.tex.symboles_a_trouver.join(" ,")) + ".", "Soit $y$ une solution de $(E)$ qui vérifie $y(0) = " + itData.tex.y0 + "$. Donnez l'expression de y."],
            large: false
          })
        });
      }
      return out;
    }
  };
});
