define(["utils/math", "utils/help"], function(mM, help) {
  return {
    init: function(inputs, options) {
      var a, aff1, aff2, b, domaine, eqTex, expr, expr1, expr2, goods, info_notation, p, p1, p2, r, r1, r2, racine, racine1, racine2, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, sqrtYS, t, tm, u, v, w, xS, yS;
      a = Number((ref = options.a.value) != null ? ref : 0);
      b = Number((ref1 = options.b.value) != null ? ref1 : 0);
      info_notation = false;
      domaine = false;
      switch (false) {
        case typeof inputs.b === "undefined":
          expr = mM.toNumber(inputs.b);
          expr1 = mM.toNumber((ref2 = inputs.c) != null ? ref2 : "x");
          expr2 = mM.toNumber((ref3 = inputs.d) != null ? ref3 : "0");
          a = Number((ref4 = inputs.a) != null ? ref4 : a);
          if (a === 0) {
            p = mM.polynome.make({
              number: expr,
              variable: "x"
            });
            r = mM.polynome.solve.exact(p, {
              y: 0
            });
            if (r.length > 0) {
              domaine = "L'équation est définie pour $x>" + (r.pop().tex()) + "$";
            }
          }
          ref5 = this.cas_b12(expr, expr1, expr2, a), goods = ref5.goods, eqTex = ref5.eqTex;
          break;
        case !((typeof inputs.c !== "undefined") && (typeof inputs.d !== "undefined")):
          expr1 = mM.toNumber(inputs.c);
          expr2 = mM.toNumber(inputs.d, "x");
          a = Number((ref6 = inputs.a) != null ? ref6 : a);
          if (a === 0) {
            p1 = mM.polynome.make({
              number: expr1,
              variable: "x"
            });
            p2 = mM.polynome.make({
              number: expr2,
              variable: "x"
            });
            r1 = (mM.polynome.solve.exact(p1, {
              y: 0
            })).pop();
            r2 = (mM.polynome.solve.exact(p2, {
              y: 0
            })).pop();
            if (r1.float() > r2.float()) {
              domaine = "L'équation est définie pour &nbsp; $x>" + (r1.tex()) + "$";
            } else {
              domaine = "L'équation est définie pour &nbsp; $x>" + (r2.tex()) + "$";
            }
          }
          ref7 = this.cas_b0(expr1, expr2, a), goods = ref7.goods, eqTex = ref7.eqTex;
          break;
        default:
          switch (false) {
            case !((b === 2) || (b === 4)):
              if (b === 4) {
                expr = mM.alea.poly({
                  degre: 1,
                  coeffDom: {
                    min: 1,
                    max: 5,
                    sign: true
                  },
                  values: {
                    min: -10,
                    max: 10
                  }
                });
                if (a === 0) {
                  p = mM.polynome.make({
                    number: expr,
                    variable: "x"
                  });
                  r = mM.polynome.solve.exact(p, {
                    y: 0
                  });
                  if (r.length > 0) {
                    domaine = "L'équation est définie pour &nbsp; $x>" + (r.pop().tex()) + "$";
                  }
                }
              } else {
                expr = mM.exec(["x"]);
                if (a === 0) {
                  domaine = "L'équation est définie pour &nbsp; $x>0$";
                }
              }
              if (a === 0) {
                xS = mM.alea.real({
                  values: {
                    min: -10,
                    max: 10
                  }
                });
              } else {
                xS = mM.alea.real({
                  values: {
                    min: 0,
                    max: 10
                  }
                });
              }
              if (mM.alea.dice(1, 8)) {
                yS = mM.alea.real({
                  values: {
                    min: 1,
                    max: 20
                  }
                });
                expr1 = mM.exec(["x", xS, "-", 2, "^", yS, "+"], {
                  simplify: true,
                  developp: true
                });
              } else {
                sqrtYS = mM.alea.real({
                  min: 1,
                  max: 10
                });
                expr1 = mM.exec(["x", xS, "-", 2, "^", sqrtYS, 2, "^", "-"], {
                  simplify: true,
                  developp: true
                });
              }
              expr2 = mM.toNumber(0);
              inputs.a = String(a);
              inputs.b = String(expr);
              inputs.c = String(expr1);
              ref8 = this.cas_b12(expr, expr1, expr2, a), goods = ref8.goods, eqTex = ref8.eqTex;
              if (a === 0) {
                info_notation = "La notation &nbsp; $\\ln^2(" + (expr.tex()) + ")$ &nbsp; est un racourci pour &nbsp; $\\left(\\ln(" + (expr.tex()) + ")\\right)^2$";
              }
              if (a === 1) {
                info_notation = "La notation &nbsp; $\\exp^2(" + (expr.tex()) + ")$ est un racourci pour &nbsp; $\\left(\\exp(" + (expr.tex()) + ")\\right)^2$";
              }
              break;
            case !((b === 1) || (b === 3)):
              if (b === 3) {
                expr = mM.alea.poly({
                  degre: 1,
                  coeffDom: {
                    min: 1,
                    max: 5,
                    sign: true
                  },
                  values: {
                    min: -10,
                    max: 10
                  }
                });
                if (a === 0) {
                  p = mM.polynome.make({
                    number: expr,
                    variable: "x"
                  });
                  r = mM.polynome.solve.exact(p, {
                    y: 0
                  });
                  if (r.length > 0) {
                    domaine = "L'équation est définie pour &nbsp; $x>" + (r.pop().tex()) + "$";
                  }
                }
              } else {
                expr = mM.exec(["x"]);
                if (a === 0) {
                  domaine = "L'équation est définie pour &nbsp; $x>0$";
                }
              }
              u = mM.alea.real({
                min: -10,
                max: 10
              });
              v = mM.alea.real({
                min: -10,
                max: 10
              });
              w = mM.alea.real({
                min: -10,
                max: 10,
                no: [u]
              });
              if (a === 0) {
                t = mM.alea.real({
                  min: -10,
                  max: 10
                });
              } else {
                tm = Math.floor(-v / (u - w) + 1);
                t = mM.alea.real({
                  min: tm,
                  max: tm + 15
                });
              }
              aff1 = mM.exec([u, "x", "*", v, "+"], {
                simplify: true
              });
              aff2 = mM.exec([w, "x", "*", t, "+"], {
                simplify: true
              });
              inputs.a = String(a);
              inputs.b = String(expr);
              inputs.c = String(aff1);
              inputs.d = String(aff2);
              ref9 = this.cas_b12(expr, aff1, aff2, a), goods = ref9.goods, eqTex = ref9.eqTex;
              break;
            default:
              u = mM.alea.real({
                min: 1,
                max: 20
              });
              w = mM.alea.real({
                min: 1,
                max: 20,
                no: [u]
              });
              if (a === 0) {
                if (mM.alea.dice(1, 8)) {
                  if (u > w) {
                    racine1 = mM.alea.real({
                      min: -5,
                      max: 4,
                      real: true
                    });
                    racine2 = mM.alea.real({
                      min: racine1 + 1,
                      max: 5,
                      real: true
                    });
                    v = Math.ceil(-racine1 * u);
                    t = Math.floor(-racine2 * w);
                    racine = mM.exec([-t, w, "/"], {
                      simplify: true
                    });
                  } else {
                    racine1 = mM.alea.real({
                      min: -4,
                      max: 5,
                      real: true
                    });
                    racine2 = mM.alea.real({
                      min: -5,
                      max: racine1 - 1,
                      real: true
                    });
                    v = Math.floor(-racine1 * u);
                    t = Math.ceil(-racine2 * w);
                    racine = mM.exec([-v, u, "/"], {
                      simplify: true
                    });
                  }
                } else {
                  if (u > w) {
                    racine1 = mM.alea.real({
                      min: -4,
                      max: 5,
                      real: true
                    });
                    racine2 = mM.alea.real({
                      min: -5,
                      max: racine1 - 1,
                      real: true
                    });
                    v = Math.floor(-racine1 * u);
                    t = Math.ceil(-racine2 * w);
                    racine = mM.exec([-v, u, "/"], {
                      simplify: true
                    });
                  } else {
                    racine1 = mM.alea.real({
                      min: -5,
                      max: 4,
                      real: true
                    });
                    racine2 = mM.alea.real({
                      min: racine1 + 1,
                      max: 5,
                      real: true
                    });
                    v = Math.ceil(-racine1 * u);
                    t = Math.floor(-racine2 * w);
                    racine = mM.exec([-t, w, "/"], {
                      simplify: true
                    });
                  }
                }
                domaine = "L'équation est définie pour $x>" + (racine.tex()) + "$";
              } else {
                v = mM.alea.real({
                  min: -5,
                  max: 5
                });
                t = mM.alea.real({
                  min: -5,
                  max: 5
                });
              }
              expr1 = mM.exec([u, "x", "*", v, "+"], {
                simplify: true
              });
              expr2 = mM.exec([w, "x", "*", t, "+"], {
                simplify: true
              });
              inputs.a = String(a);
              inputs.c = String(expr1);
              inputs.d = String(expr2);
              ref10 = this.cas_b0(expr1, expr2, a), goods = ref10.goods, eqTex = ref10.eqTex;
          }
      }
      return [eqTex, info_notation, goods, domaine];
    },
    getBriques: function(inputs, options) {
      var domaine, eqTex, goods, info_notation, infos, ref;
      ref = this.init(inputs, options), eqTex = ref[0], info_notation = ref[1], goods = ref[2], domaine = ref[3];
      infos = [];
      if (domaine) {
        infos.push(domaine);
      }
      if (info_notation) {
        infos.push(info_notation);
      }
      return [
        {
          bareme: 100,
          items: [
            {
              type: "text",
              rank: 1,
              ps: ["On considère l'équation : $" + eqTex + "$.", "Vous devez donner la ou les solutions de cette équations, si elles existent.", "<i>S'il n'y a pas de solution, écrivez $\\varnothing$. s'il y a plusieurs solutions, séparez-les avec ;</i>"]
            }, {
              type: "ul",
              rank: 2,
              list: _.map(infos, function(item) {
                return {
                  type: "warning",
                  text: item
                };
              })
            }, {
              type: "input",
              rank: 3,
              waited: "liste:number",
              name: "solutions",
              tag: "$\\mathcal{S}$",
              good: goods
            }, {
              type: "validation",
              rank: 4,
              clavier: ["empty"]
            }
          ]
        }
      ];
    },
    getExamBriques: function(inputs_list, options) {
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var domaine, eqTex, goods, info_notation, ref;
        ref = that.init(inputs, options), eqTex = ref[0], info_notation = ref[1], goods = ref[2], domaine = ref[3];
        if (domaine) {
          return ("$" + eqTex + "$. ") + domaine;
        } else {
          return "$" + eqTex + "$";
        }
      };
      return {
        children: [
          {
            type: "text",
            children: ["On considère les équations suivantes.", "Vous devez donner la ou les solutions de ces équations, si elles existent."]
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
      var fct_item, that;
      that = this;
      fct_item = function(inputs, index) {
        var domaine, eqTex, goods, info_notation, ref;
        ref = that.init(inputs, options), eqTex = ref[0], info_notation = ref[1], goods = ref[2], domaine = ref[3];
        if (domaine) {
          return ("$" + eqTex + "$. ") + domaine;
        } else {
          return "$" + eqTex + "$";
        }
      };
      return {
        children: [
          "On considère les équations suivantes.", "Vous devez donner la ou les solutions de ces équations, si elles existent.", {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      };
    },
    cas_b0: function(expr1, expr2, a) {
      var diff, fct, goods, goods_not_verified, i, it, len, md, mg, options, pol;
      diff = mM.exec([expr1, expr2, "-"], {
        simplify: true
      });
      pol = mM.polynome.make(diff);
      goods_not_verified = mM.polynome.solve.exact(pol);
      goods = [];
      for (i = 0, len = goods_not_verified.length; i < len; i++) {
        it = goods_not_verified[i];
        if ((a !== 0) || expr1.floatify({
          x: it
        }).isPositive()) {
          goods.push(it);
        }
      }
      if (a === 0) {
        fct = "ln";
      } else {
        fct = "exp";
      }
      mg = mM.exec([expr1, fct]);
      md = mM.exec([expr2, fct]);
      if (a === 1) {
        options = {
          altFunctionTex: ["exp"]
        };
      } else {
        options = {};
      }
      return {
        goods: goods,
        eqTex: mg.tex(options) + " = " + md.tex(options)
      };
    },
    cas_b12: function(expr, expr1, expr2, a) {
      var X, diff, goods, goods_not_verified, i, it, len, md, mg, options, pol, ref, x, xs;
      diff = mM.exec([expr1, expr2, "-"], {
        simplify: true
      });
      pol = mM.polynome.make(diff);
      goods_not_verified = mM.polynome.solve.exact(pol);
      goods = [];
      pol = mM.polynome.make(expr);
      for (i = 0, len = goods_not_verified.length; i < len; i++) {
        it = goods_not_verified[i];
        xs = null;
        if (a === 0) {
          xs = mM.polynome.solve.exact(pol, {
            y: mM.exec([it, "exp"])
          });
        } else if (it.isPositive()) {
          xs = mM.polynome.solve.exact(pol, {
            y: mM.exec([it, "ln"])
          });
        }
        if (xs !== null) {
          while ((x = (ref = xs.pop()) != null ? ref.simplify(null, true) : void 0)) {
            goods.push(x);
          }
        }
      }
      if (a === 0) {
        X = mM.exec([expr, "ln"]);
      } else {
        X = mM.exec([expr, "exp"]);
      }
      if (a === 2) {
        mg = expr1.replace(X, "x").simplify().order();
      } else {
        mg = expr1.replace(X, "x").order();
      }
      md = expr2.replace(X, "x").order();
      if (a === 1) {
        options = {
          altFunctionTex: ["exp"]
        };
      } else {
        options = {};
      }
      return {
        goods: goods,
        eqTex: mg.tex(options) + " = " + md.tex(options)
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
          items: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              results.push("$" + item.equation + "$");
            }
            return results;
          })(),
          large: false
        })
      };
    }
  };
});
