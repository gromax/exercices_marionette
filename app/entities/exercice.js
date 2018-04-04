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
  BriqueItem = Backbone.Model.extend({
    initialize: function(modelData) {
      switch (false) {
        case typeof modelData.verification !== "function":
          this.verification = modelData.verification;
          break;
        case modelData.type !== "input":
          this.verification = Functions_helpers.inputVerification;
          break;
        case modelData.type !== "radio":
          this.verification = Functions_helpers.radioVerification;
          break;
        case modelData.type !== "color-choice":
          this.verification = Functions_helpers.color_choiceVerification;
          break;
        case modelData.type !== "validation":
          this.verification = function() {
            return {
              toTrash: this
            };
          };
          break;
        case modelData.type !== "aide":
          this.verification = function() {
            return {
              toTrash: this
            };
          };
          break;
        default:
          this.verification = function() {
            return null;
          };
      }
      switch (false) {
        case typeof modelData.answerProcessing !== "function":
          this.answerProcessing = modelData.answerProcessing;
          break;
        case modelData.type !== "input":
          this.answerProcessing = Functions_helpers.inputAnswerProcessing;
          break;
        case modelData.type !== "radio":
          this.answerProcessing = Functions_helpers.radioAnswerProcessing;
          break;
        case modelData.type !== "color-choice":
          this.answerProcessing = Functions_helpers.color_choiceAnswerProcessing;
          break;
        default:
          this.answerProcessing = Functions_helpers.defaultAnswerProcess;
      }
      if (typeof modelData.answerPreprocessing === "function") {
        return this.answerPreprocessing = modelData.answerPreprocessing;
      }
    },
    parse: function(data) {
      var parsedData;
      switch (data.type) {
        case "input":
          parsedData = _.extend({
            description: "",
            waited: "number",
            arrondi: false,
            formes: null,
            custom: typeof data.customVerif === "function" ? data.customVerif : null,
            tolerance: false
          }, data);
          break;
        default:
          parsedData = data;
      }
      return parsedData;
    }
  });
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
      var add_json, add_models, customAdd, customBriqueVerifFunction, note, notes, posts, sum, verif, verif_processing;
      verif_processing = function(model) {
        var post, verif;
        verif = model.verification(data);
        if (typeof (post = verif != null ? verif.post : void 0) === "function") {
          verif.post = {
            item: model,
            post: post
          };
        }
        return verif;
      };
      verif = _.map(this.get("items").models, verif_processing);
      customBriqueVerifFunction = this.get("custom_verification_message");
      if ((typeof customBriqueVerifFunction === "function") && (customAdd = customBriqueVerifFunction(data))) {
        verif.push(customAdd);
      }
      add_json = _.flatten(_.compact(_.pluck(verif, "add")));
      posts = _.compact(_.pluck(verif, "post"));
      add_models = _.map(add_json, function(item) {
        return new BriqueItem(item, {
          parse: true
        });
      });
      notes = _.filter(_.pluck(verif, "note"), function(item) {
        return typeof item === "number";
      });
      sum = function(it, memo) {
        return it + memo;
      };
      note = _.reduce(notes, sum) / notes.length;
      return {
        toTrash: _.compact(_.pluck(verif, "toTrash")),
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
      var list, reduce_fct;
      reduce_fct = function(memo, item) {
        if (item !== null) {
          return _.extend(memo, item);
        } else {
          return memo;
        }
      };
      list = _.map(this.get("items").models, function(model) {
        return model.answerProcessing(data);
      });
      return _.reduce(list, reduce_fct, {});
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
      var error, info, name, out, processed, processedAnswer, ref, ref1, userValue, waited;
      data = data != null ? data : {};
      name = this.get("name");
      out = {};
      if ((userValue = data[name]) != null) {
        waited = this.get("waited");
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
      var N, answer_data, bads, closests, customMessage, customMessageFunction, errorItem, errors, it, it_good, items, j, k, l, lefts, len, len1, len2, len3, m, model_data, note, ref, ref1, ref2, ref3, sol, stringAnswer, title, type, verifResponse, verif_results;
      note = 0;
      model_data = this.attributes;
      answer_data = answers_data[model_data.name];
      title = model_data.corectionTag || model_data.tag || model_data.name;
      items = [
        {
          type: "normal",
          text: "<b>" + title + " &nbsp; \:</b>&emsp; Vous avez répondu &nbsp; <i>" + answer_data.answer + "</i>"
        }
      ];
      if (Array.isArray(answer_data.processedAnswer)) {
        if (answer_data.processedAnswer.length === 0) {
          if (model_data.good.length === 0) {
            items.push({
              type: "success",
              text: "Bonne réponse"
            });
            note = 1;
          } else {
            stringAnswer = ((function() {
              var j, len, ref, results;
              ref = model_data.good;
              results = [];
              for (j = 0, len = ref.length; j < len; j++) {
                it = ref[j];
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
          if (model_data.good.length === 0) {
            items.push({
              type: "error",
              text: "La bonne réponse était $\\varnothing$."
            });
          } else {
            ref = mM.tri(answer_data.processedAnswer, model_data.good), closests = ref.closests, lefts = ref.lefts;
            bads = [];
            N = model_data.good.length;
            for (j = 0, len = closests.length; j < len; j++) {
              sol = closests[j];
              if (sol.good != null) {
                verifResponse = mM.verif[sol.info.type](sol.info, sol.good, model_data);
                note += verifResponse.note / N;
                switch (false) {
                  case verifResponse.note !== 1:
                    items.push({
                      type: "success",
                      text: "<i>" + sol.info.expression + "</i> &nbsp; est une bonne réponse."
                    });
                    break;
                  case !(verifResponse.note > 0):
                    if (verifResponse.errors.length > 0) {
                      items.push({
                        type: "warning",
                        text: "<i>" + sol.info.expression + "</i> &nbsp; est accepté, mais :"
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
                        text: "<i>" + sol.info.expression + "</i> &nbsp; est accepté mais la réponse peut être améliorée."
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
      } else {
        type = answer_data.processedAnswer.type;
        if (Array.isArray(model_data.good)) {
          verif_results = (function() {
            var l, len2, ref2, results;
            ref2 = model_data.good;
            results = [];
            for (l = 0, len2 = ref2.length; l < len2; l++) {
              it_good = ref2[l];
              results.push(mM.verif[type](answer_data.processedAnswer, it_good, model_data));
            }
            return results;
          })();
          ref2 = _.max(verif_results, function(item) {
            return item.note;
          }), note = ref2.note, errors = ref2.errors;
        } else {
          ref3 = mM.verif[type](answer_data.processedAnswer, model_data.good, model_data), note = ref3.note, errors = ref3.errors;
        }
        switch (false) {
          case note !== 1:
            items.push({
              type: "success",
              text: "<i>" + answer_data.answer + "</i> &nbsp; est une bonne réponse."
            });
            break;
          case !(note > 0):
            if (errors.length > 0) {
              items.push({
                type: "warning",
                text: "<i>" + answer_data.answer + "</i> &nbsp; est accepté, mais :"
              });
              for (l = 0, len2 = errors.length; l < len2; l++) {
                errorItem = errors[l];
                items.push({
                  type: "warning",
                  text: errorItem
                });
              }
            } else {
              items.push({
                type: "warning",
                text: "<i>" + answer_data.answer + "</i> &nbsp; est accepté mais la réponse peut être améliorée."
              });
            }
            break;
          default:
            items.push({
              type: "error",
              text: "Mauvaise réponse."
            });
            if (errors.length > 0) {
              for (m = 0, len3 = errors.length; m < len3; m++) {
                errorItem = errors[m];
                items.push({
                  type: "warning",
                  text: errorItem
                });
              }
            }
        }
        customMessageFunction = this.get("custom_verification_message");
        if ((typeof customMessageFunction === "function") && (customMessage = customMessageFunction(answers_data))) {
          if (customMessage.note) {
            note += customMessage.note;
          }
          items.push(customMessage);
        }
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
