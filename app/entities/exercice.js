define(["backbone.radio", "entities/exercices/exercices_catalog", "utils/math"], function(Radio, Catalog, mM) {
  var API, Brique, BriqueItem, BriqueItemsCollection, BriquesCollection, Exo, Functions_helpers, channel;
  Exo = Backbone.Model.extend({
    defaults: {
      title: "Titre de l'exercice",
      description: "Description de l'exercice",
      keywords: "",
      options: {}
    },
    getBriquesUntilFocus: function() {
      var b, briques, j, len, output;
      output = [];
      briques = this.get("briquesCollection").models;
      for (j = 0, len = briques.length; j < len; j++) {
        b = briques[j];
        if (!(b.get("done") === false)) {
          continue;
        }
        output.push(b);
        if (b.isFocusPoint() === true) {
          return output;
        }
      }
      output.push(false);
      return output;
    },
    baremeTotal: function() {
      var baremes, briques, iteratee;
      briques = this.get("briquesCollection").models;
      baremes = _.map(briques, function(it) {
        return it.get("bareme");
      });
      iteratee = function(memo, it) {
        if (typeof it === "number") {
          return memo + it;
        } else {
          return memo;
        }
      };
      return _.reduce(baremes, iteratee, 0);
    }
  });
  BriqueItem = Backbone.Model;
  BriqueItemsCollection = Backbone.Collection.extend({
    model: BriqueItem,
    comparator: "rank"
  });
  Brique = Backbone.Model.extend({
    defaults: {
      done: false,
      title: false
    },
    parse: function(data) {
      data.items = new BriqueItemsCollection(data.items, {
        parse: true
      });
      return data;
    },
    verification: function(data) {
      var add_models, note, notes, posts, sum, verif, verif_processing;
      verif_processing = function(verifItem) {
        var g, list, name, out, p, ref, ref1, stringAnswer, tag;
        switch (false) {
          case typeof verifItem !== "function":
            out = verifItem(data);
            break;
          case verifItem.type !== "all":
            out = mM.verification.all(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join(" &nbsp; ; &nbsp; ");
            list = [
              {
                type: "normal",
                text: "Vous avez répondu &nbsp; $" + stringAnswer + "$"
              }
            ];
            if (out.goodMessage) {
              list.push(out.goodMessage);
            }
            out.add = {
              type: "ul",
              list: list.concat(out.errors)
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
            break;
          case verifItem.type !== "some":
            out = mM.verification.some(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join(" &nbsp; ; &nbsp; ");
            list = [
              {
                type: "normal",
                text: "Vous avez répondu &nbsp; $" + stringAnswer + "$"
              }
            ];
            if (out.goodMessage) {
              list.push(out.goodMessage);
            }
            out.add = {
              type: "ul",
              list: list.concat(out.errors)
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
            break;
          case verifItem.radio == null:
            name = verifItem.name;
            tag = (ref = verifItem.tag) != null ? ref : name;
            p = data[name].processed;
            g = verifItem.good;
            out = {
              add: {
                type: "ul",
                list: [
                  {
                    type: "normal",
                    text: "<b>" + tag + " &nbsp; :</b>&emsp; Vous avez répondu &nbsp; " + verifItem.radio[p] + "."
                  }
                ]
              }
            };
            if (p === g) {
              out.note = 1;
              out.add.list.push({
                type: "success",
                text: "C'est la bonne réponse."
              });
            } else {
              out.note = 0;
              out.add.list.push({
                type: "error",
                text: "La bonne réponse était &nbsp; " + verifItem.radio[g] + "."
              });
            }
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
            break;
          default:
            out = mM.verification.isSame(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            tag = (ref1 = verifItem.tag) != null ? ref1 : verifItem.name;
            list = [
              {
                type: "normal",
                text: "<b>" + tag + "</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $" + data[verifItem.name].processed.tex + "$"
              }
            ];
            list.push(out.goodMessage);
            out.add = {
              type: "ul",
              list: list.concat(out.errors)
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
        }
        return out;
      };
      verif = _.map(this.get("verifications"), verif_processing);
      posts = _.compact(_.pluck(verif, "post"));
      add_models = _.map(_.flatten(_.compact(_.pluck(verif, "add"))), function(item) {
        return new BriqueItem(item);
      });
      notes = _.filter(_.pluck(verif, "note"), function(item) {
        return typeof item === "number";
      });
      sum = function(it, memo) {
        return it + memo;
      };
      note = _.reduce(notes, sum, 0) / notes.length;
      return {
        add: add_models,
        posts: posts,
        note: note
      };
    },
    checkIfNeedValidation: function() {
      return this.get("items").where({
        type: "validation"
      }).length > 0;
    },
    validation: function(data) {
      var fct_iteratee;
      fct_iteratee = function(val, key) {
        var error, errors, it, liste, p, processed, result, userValue, verifs;
        if ((userValue = data[key]) != null) {
          switch (false) {
            case val !== "liste":
              if (userValue === "∅") {
                processed = [];
                error = false;
              } else {
                liste = userValue.split(";");
                verifs = (function() {
                  var j, len, results;
                  results = [];
                  for (j = 0, len = liste.length; j < len; j++) {
                    it = liste[j];
                    results.push(mM.verification.numberValidation(it));
                  }
                  return results;
                })();
                errors = _.flatten(_.compact(_.pluck(verifs, "error")));
                if (errors.length > 0) {
                  error = false;
                } else {
                  error = errors;
                }
                processed = _.pluck(verifs, "processed");
              }
              return {
                processed: processed,
                user: userValue,
                error: error
              };
            case val !== "number":
              return mM.verification.numberValidation(userValue);
            case !(result = /radio:([0-9]+)/.exec(val)):
              result = Number(result[1]);
              p = Number(userValue);
              if (p < 0 || p > result) {
                error = "La réponse n'est pas dans la liste";
              } else {
                error = false;
              }
              return {
                processed: p,
                user: userValue,
                error: error
              };
            case typeof val !== "function":
              return val(userValue);
            default:
              return {
                processed: false,
                user: userValue,
                error: "Aucun type de validation défini !"
              };
          }
        } else {
          return {
            processed: false,
            user: "?",
            error: "Réponse manquante !"
          };
        }
      };
      return _.mapObject(this.get("validations"), fct_iteratee);
    },
    isFocusPoint: function() {
      if (this.get("done")) {
        return false;
      }
      if (this.checkIfNeedValidation()) {
        return true;
      }
      this.set("done", true);
      return false;
    }
  });
  BriquesCollection = Backbone.Collection.extend({
    model: Brique
  });
  Functions_helpers = {
    defaultAnswerProcess: function(answers_data) {
      var j, len, n, name, out;
      name = this.get("name");
      if ((name != null)) {
        out = {};
        answers_data = answers_data != null ? answers_data : {};
        if (typeof name === "string") {
          if (answers_data[name] != null) {
            out[name] = answers_data[name];
          } else {
            out[name] = {
              error: "Vous devez donner une réponse"
            };
          }
        } else if (_.isArray(name)) {
          for (j = 0, len = name.length; j < len; j++) {
            n = name[j];
            if (answers_data[n] != null) {
              out[n] = answers_data[n];
            } else {
              out[n] = {
                error: "Vous devez donner une réponse"
              };
            }
          }
        }
        if (_.isEmpty(out)) {
          return null;
        }
        return out;
      } else {
        return null;
      }
    },
    radioAnswerProcessing: function(data) {
      var name, out, radioItems, userValue;
      data = data != null ? data : {};
      name = this.get("name");
      out = {};
      if ((userValue = data[name]) != null) {
        userValue = Number(userValue);
        radioItems = this.get("radio");
        if (userValue < radioItems.length) {
          out[name] = {
            processedAnswer: userValue,
            answer: userValue
          };
        } else {
          out[name] = {
            error: "La réponse n'est pas dans la liste."
          };
        }
      } else {
        out[name] = {
          error: "Vous devez donner une réponse"
        };
      }
      return out;
    },
    inputAnswerProcessing: function(data) {
      var error, fct_iteratee, format, info, name, names, originalUserValues, out, processed, processedAnswer, processedAnswers, ref, ref1, ref2, uV, userValue, userValues, validateList, waited;
      data = data != null ? data : {};
      waited = this.get("waited");
      out = {};
      name = this.get("name");
      if ((userValue = data[name]) != null) {
        error = false;
        processedAnswer = false;
        if (userValue === "") {
          error = "Ne doit pas être vide";
        } else {
          if (typeof this.answerPreprocessing === "function") {
            ref = this.answerPreprocessing(userValue), processed = ref.processed, error = ref.error;
            if (error === false) {
              userValue = processed;
            }
          }
          if (error === false) {
            ref1 = mM.p.validate(userValue, waited), info = ref1.info, error = ref1.error;
            if (error === false) {
              processedAnswer = info;
            }
          }
        }
        if (error === false) {
          out[name] = {
            processedAnswer: processedAnswer,
            answer: data[name]
          };
        } else {
          out[name] = {
            error: error
          };
        }
      } else if ((format = this.get("format")) != null) {
        names = _.compact(_.pluck(format, "name"));
        fct_iteratee = function(item) {
          return [item, typeof data[item] === "function" ? data[item]("") : void 0];
        };
        userValues = originalUserValues = _.object(names, _.map(names, function(item) {
          var ref2;
          return (ref2 = data[item]) != null ? ref2 : "";
        }));
        if (_.compact(_.values(userValues)).length < names.length) {
          error = "Aucun champ ne doit être vide";
        } else {
          error = false;
          if (typeof this.answerPreprocessing === "function") {
            ref2 = this.answerPreprocessing(userValues), processed = ref2.processed, error = ref2.error;
            if (error === false) {
              userValues = processed;
            }
          }
          if (error === false) {
            validateList = (function() {
              var j, len, ref3, results;
              ref3 = _.values(userValues);
              results = [];
              for (j = 0, len = ref3.length; j < len; j++) {
                uV = ref3[j];
                results.push(mM.p.validate(uV, waited));
              }
              return results;
            })();
            error = _.compact(_.pluck(validateList, "error"));
            if (error.length === 0) {
              error = false;
              processedAnswers = _.object(names, _.pluck(validateList, "info"));
            }
          }
        }
        if (error === false) {
          out[name] = {
            processedAnswer: processedAnswers,
            answer: originalUserValues
          };
        } else {
          out[name] = {
            error: error
          };
        }
      } else {
        out[name] = {
          name: name,
          error: "Vous devez donner une réponse"
        };
      }
      return out;
    },
    color_choiceAnswerProcessing: function(data) {
      var i, j, nVal, name, out, ref, userValue, values;
      data = data != null ? data : {};
      name = this.get("name");
      nVal = this.get("list").length;
      out = {};
      values = [];
      for (i = j = 0, ref = nVal - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        userValue = Number(data[name + i]);
        if (userValue === -1) {
          out[name] = {
            error: "Vous devez attribuer toutes les couleurs."
          };
          return out;
        } else {
          values[i] = userValue;
        }
      }
      out[name] = values.join(";");
      return out;
    },
    radioVerification: function(answers_data) {
      var answer_data, items, model_data, note, title;
      note = 0;
      model_data = this.attributes;
      answer_data = answers_data[model_data.name];
      title = model_data.corectionTag || model_data.tag || model_data.name;
      items = [
        {
          type: "normal",
          text: "<b>" + title + " &nbsp; \:</b>&emsp; Vous avez répondu &nbsp; " + model_data.radio[answer_data.processedAnswer]
        }
      ];
      if (answer_data.processedAnswer === model_data.good) {
        note = 1;
        items.push({
          type: "success",
          text: "C'est la bonne réponse."
        });
      } else {
        note = 0;
        items.push({
          type: "error",
          text: "La bonne réponse était &nbsp; " + model_data.radio[model_data.good] + "."
        });
      }
      return {
        toTrash: this,
        note: note,
        add: {
          type: "ul",
          rank: this.get("rank"),
          list: items
        }
      };
    },
    inputVerification: function(answers_data) {
      var N, answer_data, fct_aiguillage, fct_for_list, fct_iteratee, fct_simple, items, list, model_data, note, that, title, userExpression;
      note = 0;
      model_data = this.attributes;
      that = this;
      answer_data = answers_data[model_data.name];
      userExpression = function(entry) {
        var customExpr;
        if (typeof (customExpr = that.get("customUserExpression")) === "function") {
          return customExpr(entry);
        } else {
          if (entry.tex != null) {
            return "$" + entry.tex + "$";
          }
          if (entry.expression != null) {
            entry = entry.expression;
          }
          if (that.get("type") === "latex-input") {
            return "$" + entry + "$";
          } else {
            return "<i>" + entry + "</i>";
          }
        }
      };
      title = model_data.corectionTag || model_data.tag || model_data.name;
      items = [
        {
          type: "normal",
          text: "<b>" + title + " &nbsp; \:</b>&emsp; Vous avez répondu &nbsp; " + (userExpression(answer_data.answer))
        }
      ];
      fct_for_list = function(answersList, goodList) {
        var N, bads, closests, errorItem, it, itNote, j, k, lefts, len, len1, ref, ref1, sol, stringAnswer, verifResponse;
        itNote = 0;
        if (answersList.length === 0) {
          if (goodList.length === 0) {
            items.push({
              type: "success",
              text: "Bonne réponse"
            });
            itNote = 1;
          } else {
            stringAnswer = ((function() {
              var j, len, results;
              results = [];
              for (j = 0, len = goodList.length; j < len; j++) {
                it = goodList[j];
                results.push("$" + (it.tex()) + "$");
              }
              return results;
            })()).join(" ; ");
            items.push({
              type: "error",
              text: "Vous auriez dû donner " + stringAnswer
            });
          }
        } else {
          if (goodList.length === 0) {
            items.push({
              type: "error",
              text: "La bonne réponse était $\\varnothing$."
            });
          } else {
            ref = mM.tri(answersList, goodList), closests = ref.closests, lefts = ref.lefts;
            bads = [];
            N = goodList.length;
            for (j = 0, len = closests.length; j < len; j++) {
              sol = closests[j];
              if (sol.good != null) {
                verifResponse = mM.verif[sol.info.type](sol.info, sol.good, model_data);
                itNote += verifResponse.note / N;
                switch (false) {
                  case verifResponse.note !== 1:
                    items.push({
                      type: "success",
                      text: "$" + sol.info.tex + "$ &nbsp; est une bonne réponse."
                    });
                    break;
                  case !(verifResponse.note > 0):
                    if (verifResponse.errors.length > 0) {
                      items.push({
                        type: "warning",
                        text: "$" + sol.info.tex + " &nbsp; est accepté, mais :"
                      });
                      ref1 = verifResponse.errors;
                      for (k = 0, len1 = ref1.length; k < len1; k++) {
                        errorItem = ref1[k];
                        items.push({
                          type: "warning",
                          text: errorItem
                        });
                      }
                    } else {
                      items.push({
                        type: "warning",
                        text: "$" + sol.info.tex + "$ &nbsp; est accepté mais la réponse peut être améliorée."
                      });
                    }
                    break;
                  default:
                    bads.push(sol.info.expression);
                    lefts.push(sol.good);
                }
              } else {
                bads.push(sol.info.expression);
              }
            }
            if (bads.length > 0) {
              items.push({
                type: "error",
                text: "Ces solutions que vous donnez sont fausses : " + (bads.join(" ; "))
              });
            }
            if (lefts.length > 0) {
              items.push({
                type: "error",
                text: "Vous n'avez pas donné ces solutions : " + (((function() {
                  var l, len2, results;
                  results = [];
                  for (l = 0, len2 = lefts.length; l < len2; l++) {
                    it = lefts[l];
                    results.push("$" + (it.tex()) + "$");
                  }
                  return results;
                })()).join(" ; "))
              });
            }
          }
        }
        return itNote;
      };
      fct_simple = function(answer, good) {
        var errorItem, errors, it_good, j, k, len, len1, ref, ref1, type, verif_results;
        type = answer.type;
        if (Array.isArray(good)) {
          verif_results = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = good.length; j < len; j++) {
              it_good = good[j];
              results.push(mM.verif[type](answer, it_good, model_data));
            }
            return results;
          })();
          ref = _.max(verif_results, function(item) {
            return item.note;
          }), note = ref.note, errors = ref.errors;
        } else {
          ref1 = mM.verif[type](answer, good, model_data), note = ref1.note, errors = ref1.errors;
        }
        switch (false) {
          case note !== 1:
            items.push({
              type: "success",
              text: "$" + answer.tex + "$ &nbsp; est une bonne réponse."
            });
            break;
          case !(note > 0):
            if (errors.length > 0) {
              items.push({
                type: "warning",
                text: "$" + answer.tex + "$ &nbsp; est accepté, mais :"
              });
              for (j = 0, len = errors.length; j < len; j++) {
                errorItem = errors[j];
                items.push({
                  type: "warning",
                  text: errorItem
                });
              }
            } else {
              items.push({
                type: "warning",
                text: "$" + answer.tex + "$ &nbsp; est accepté mais la réponse peut être améliorée."
              });
            }
            break;
          default:
            items.push({
              type: "error",
              text: "$" + answer.tex + "$ &nbsp; est une mauvaise réponse."
            });
            if (errors.length > 0) {
              for (k = 0, len1 = errors.length; k < len1; k++) {
                errorItem = errors[k];
                items.push({
                  type: "warning",
                  text: errorItem
                });
              }
            }
        }
        return note;
      };
      fct_aiguillage = function(answer, good) {
        var customMessage, customMessageFunction;
        if (Array.isArray(answer)) {
          return fct_for_list(answer, good);
        } else {
          note = fct_simple(answer, good);
          customMessageFunction = that.get("custom_verification_message");
          if ((typeof customMessageFunction === "function") && (customMessage = customMessageFunction(answers_data))) {
            if (customMessage.note) {
              note += customMessage.note;
            }
            items.push(customMessage);
          }
          return note;
        }
      };
      if (typeof answer_data.answer === "object") {
        N = _.size(answer_data.answer);
        list = _.map(answer_data.processedAnswer, function(it, key) {
          return {
            answer: it,
            good: model_data.good[key]
          };
        });
        fct_iteratee = function(memo, item) {
          return memo + fct_aiguillage(item.answer, item.good) / N;
        };
        note = _.reduce(list, fct_iteratee, 0);
      } else {
        fct_aiguillage(answer_data.processedAnswer, model_data.good);
      }
      return {
        toTrash: this,
        note: note,
        add: {
          type: "ul",
          rank: this.get("rank"),
          list: items
        }
      };
    },
    color_choiceVerification: function(answers_data) {
      var answers, colors, correcList, fct, it, list, name, note;
      name = this.get("name");
      answers = answers_data[name].split(";");
      list = this.get("list");
      note = 0;
      colors = require("utils/colors");
      fct = function(it) {
        var answer, rank;
        rank = it.rank;
        answer = Number(answers[rank]);
        if (answer === rank) {
          return {
            text: it.text,
            type: "success",
            color: colors.html(rank),
            note: 1
          };
        } else {
          return {
            text: it.text,
            type: "error",
            color: colors.html(answer),
            secondColor: colors.html(rank),
            note: 0
          };
        }
      };
      correcList = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = list.length; j < len; j++) {
          it = list[j];
          results.push(fct(it));
        }
        return results;
      })();
      note = _.reduce(correcList, function(memo, it) {
        return memo + it.note;
      }, 0) / list.length;
      return {
        toTrash: this,
        note: note,
        add: {
          type: "color-list",
          rank: this.get("rank"),
          list: correcList
        }
      };
    }
  };
  API = {
    getEntity: function(id, options_for_this_instance, inputs) {
      var defer, exo, failedCB, filename, itemData, iteratee, options, promise, successCB;
      inputs = inputs != null ? inputs : {};
      options_for_this_instance = options_for_this_instance != null ? options_for_this_instance : {};
      itemData = Catalog.get(id);
      defer = $.Deferred();
      if (itemData != null) {
        filename = itemData.filename;
        exo = new Exo(itemData);
        iteratee = function(val, key) {
          var value;
          value = options_for_this_instance[key];
          if (value != null) {
            val.value = value;
          } else {
            val.value = 0;
          }
          return val;
        };
        options = _.mapObject(itemData.options, iteratee);
        exo.set({
          "inputs": inputs,
          "options": options
        });
        successCB = function(exoController) {
          var briques, collection;
          briques = exoController.getBriques(inputs, options);
          collection = new BriquesCollection(briques, {
            parse: true
          });
          collection.parent = exo;
          exo.set({
            "briquesCollection": collection
          });
          return defer.resolve(exo);
        };
        failedCB = function() {
          return defer.reject({
            message: "Fichier " + filename + " introuvable."
          });
        };
        switch (filename) {
          case "exo0001":
            require(["entities/exercices/exo0001"], successCB, failedCB);
            break;
          case "exo0002":
            require(["entities/exercices/exo0002"], successCB, failedCB);
            break;
          case "exo0003":
            require(["entities/exercices/exo0003"], successCB, failedCB);
            break;
          case "exo0004":
            require(["entities/exercices/exo0004"], successCB, failedCB);
            break;
          case "exo0005":
            require(["entities/exercices/exo0005"], successCB, failedCB);
            break;
          case "exo0006":
            require(["entities/exercices/exo0006"], successCB, failedCB);
            break;
          case "exo0007":
            require(["entities/exercices/exo0007"], successCB, failedCB);
            break;
          case "exo0008":
            require(["entities/exercices/exo0008"], successCB, failedCB);
            break;
          case "exo0009":
            require(["entities/exercices/exo0009"], successCB, failedCB);
            break;
          case "exo0010":
            require(["entities/exercices/exo0010"], successCB, failedCB);
            break;
          case "exo0011":
            require(["entities/exercices/exo0011"], successCB, failedCB);
            break;
          case "exo0012":
            require(["entities/exercices/exo0012"], successCB, failedCB);
            break;
          case "exo0013":
            require(["entities/exercices/exo0013"], successCB, failedCB);
            break;
          case "exo0014":
            require(["entities/exercices/exo0014"], successCB, failedCB);
            break;
          case "exo0015":
            require(["entities/exercices/exo0015"], successCB, failedCB);
            break;
          case "exo0016":
            require(["entities/exercices/exo0016"], successCB, failedCB);
            break;
          case "exo0017":
            require(["entities/exercices/exo0017"], successCB, failedCB);
            break;
          case "exo0018":
            require(["entities/exercices/exo0018"], successCB, failedCB);
            break;
          case "exo0019":
            require(["entities/exercices/exo0019"], successCB, failedCB);
            break;
          case "exo0020":
            require(["entities/exercices/exo0020"], successCB, failedCB);
            break;
          case "exo0021":
            require(["entities/exercices/exo0021"], successCB, failedCB);
            break;
          case "exo0022":
            require(["entities/exercices/exo0022"], successCB, failedCB);
            break;
          case "exo0023":
            require(["entities/exercices/exo0023"], successCB, failedCB);
            break;
          case "exo0024":
            require(["entities/exercices/exo0024"], successCB, failedCB);
            break;
          case "exo0025":
            require(["entities/exercices/exo0025"], successCB, failedCB);
            break;
          case "exo0026":
            require(["entities/exercices/exo0026"], successCB, failedCB);
            break;
          case "exo0027":
            require(["entities/exercices/exo0027"], successCB, failedCB);
            break;
          case "exo0028":
            require(["entities/exercices/exo0028"], successCB, failedCB);
            break;
          case "exo0029":
            require(["entities/exercices/exo0029"], successCB, failedCB);
            break;
          case "exo0030":
            require(["entities/exercices/exo0030"], successCB, failedCB);
            break;
          case "exo0031":
            require(["entities/exercices/exo0031"], successCB, failedCB);
            break;
          case "exo0032":
            require(["entities/exercices/exo0032"], successCB, failedCB);
            break;
          case "exo0033":
            require(["entities/exercices/exo0033"], successCB, failedCB);
            break;
          case "exo0034":
            require(["entities/exercices/exo0034"], successCB, failedCB);
            break;
          case "exo0035":
            require(["entities/exercices/exo0035"], successCB, failedCB);
            break;
          case "exo0036":
            require(["entities/exercices/exo0036"], successCB, failedCB);
            break;
          case "exo0037":
            require(["entities/exercices/exo0037"], successCB, failedCB);
            break;
          case "exo0038":
            require(["entities/exercices/exo0038"], successCB, failedCB);
            break;
          case "exo0039":
            require(["entities/exercices/exo0039"], successCB, failedCB);
            break;
          case "exo0040":
            require(["entities/exercices/exo0040"], successCB, failedCB);
            break;
          case "exo0041":
            require(["entities/exercices/exo0041"], successCB, failedCB);
            break;
          case "exo0042":
            require(["entities/exercices/exo0042"], successCB, failedCB);
            break;
          case "exo0043":
            require(["entities/exercices/exo0043"], successCB, failedCB);
            break;
          case "exo0044":
            require(["entities/exercices/exo0044"], successCB, failedCB);
            break;
          case "exo0045":
            require(["entities/exercices/exo0045"], successCB, failedCB);
            break;
          case "exo0046":
            require(["entities/exercices/exo0046"], successCB, failedCB);
            break;
          case "exo0047":
            require(["entities/exercices/exo0047"], successCB, failedCB);
            break;
          case "exo0048":
            require(["entities/exercices/exo0048"], successCB, failedCB);
            break;
          case "exo0049":
            require(["entities/exercices/exo0049"], successCB, failedCB);
            break;
          case "exo0050":
            require(["entities/exercices/exo0050"], successCB, failedCB);
            break;
          case "exo0051":
            require(["entities/exercices/exo0051"], successCB, failedCB);
            break;
          case "exo0052":
            require(["entities/exercices/exo0052"], successCB, failedCB);
            break;
          case "exo0053":
            require(["entities/exercices/exo0053"], successCB, failedCB);
            break;
          case "exo0054":
            require(["entities/exercices/exo0054"], successCB, failedCB);
            break;
          case "exo0055":
            require(["entities/exercices/exo0055"], successCB, failedCB);
            break;
          case "exo0056":
            require(["entities/exercices/exo0056"], successCB, failedCB);
            break;
          case "exo0057":
            require(["entities/exercices/exo0057"], successCB, failedCB);
            break;
          default:
            require(["entities/exercices/" + filename], successCB, failedCB);
        }
      } else {
        defer.reject({
          message: "Exercice #" + id + " introuvable dans le catalogue."
        });
      }
      promise = defer.promise();
      return promise;
    }
  };
  channel = Radio.channel('entities');
  channel.reply('exercice:entity', API.getEntity);
  return null;
});
