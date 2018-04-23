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
      var b, briques, i, len, output;
      output = [];
      briques = this.get("briquesCollection").models;
      for (i = 0, len = briques.length; i < len; i++) {
        b = briques[i];
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
      var add_models, note, notes, sum, verif, verif_processing;
      verif_processing = function(verifItem) {
        var answers, colors, correcList, fct, g, index, it, items, list, name, note, out, p, ranks, ref, ref1, stringAnswer, tag, ver;
        switch (false) {
          case typeof verifItem !== "function":
            out = verifItem(data);
            break;
          case verifItem.type !== "all":
            ver = mM.verification.all(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            if (data[verifItem.name].processed.length === 0) {
              stringAnswer = "\\varnothing";
            } else {
              stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join("$ &nbsp; ; &nbsp; $");
            }
            list = [
              {
                type: "normal",
                text: "Vous avez répondu &nbsp; $" + stringAnswer + "$"
              }
            ];
            if (ver.goodMessage) {
              list.push(ver.goodMessage);
            }
            out = {
              note: ver.note,
              add: {
                type: "ul",
                list: list.concat(ver.errors)
              }
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
            break;
          case verifItem.type !== "some":
            ver = mM.verification.some(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            if (data[verifItem.name].processed.length === 0) {
              stringAnswer = "\\varnothing";
            } else {
              stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join("$ &nbsp; ; &nbsp; $");
            }
            list = [
              {
                type: "normal",
                text: "Vous avez répondu &nbsp; $" + stringAnswer + "$"
              }
            ];
            if (ver.goodMessage) {
              list.push(ver.goodMessage);
            }
            out = {
              note: ver.note,
              add: {
                type: "ul",
                list: list.concat(ver.errors)
              }
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
          case verifItem.colors == null:
            items = verifItem.items;
            ranks = verifItem.colors;
            name = verifItem.name;
            answers = data[name].processed;
            note = 0;
            colors = require("utils/colors");
            fct = function(it, index) {
              var answer;
              answer = answers[index];
              if (answer === ranks[index]) {
                return {
                  text: it,
                  type: "success",
                  color: colors.html(answer),
                  note: 1
                };
              } else {
                return {
                  text: it,
                  type: "error",
                  color: colors.html(answer),
                  secondColor: colors.html(ranks[index]),
                  note: 0
                };
              }
            };
            correcList = (function() {
              var i, len, results;
              results = [];
              for (index = i = 0, len = items.length; i < len; index = ++i) {
                it = items[index];
                results.push(fct(it, index));
              }
              return results;
            })();
            note = _.reduce(correcList, function(memo, it) {
              return memo + it.note;
            }, 0) / items.length;
            out = {
              note: note,
              add: {
                type: "color-list",
                list: correcList
              }
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
            break;
          default:
            ver = mM.verification.isSame(data[verifItem.name].processed, verifItem.good, verifItem.parameters);
            tag = (ref1 = verifItem.tag) != null ? ref1 : verifItem.name;
            list = [
              {
                type: "normal",
                text: "<b>" + tag + "</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $" + data[verifItem.name].processed.tex + "$"
              }, ver.goodMessage
            ];
            out = {
              note: out.note,
              add: {
                type: "ul",
                list: list.concat(ver.errors)
              }
            };
            if (verifItem.rank != null) {
              out.add.rank = verifItem.rank;
            }
        }
        return out;
      };
      verif = _.map(this.get("verifications"), verif_processing);
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
      data = data != null ? data : {};
      fct_iteratee = function(val, key) {
        var error, errors, it, liste, p, processed, result, userValue, v, verifs;
        if ((userValue = data[key]) != null) {
          switch (false) {
            case val !== "liste":
              if (userValue === "∅" || userValue === "\\varnothing") {
                processed = [];
                error = false;
              } else {
                liste = userValue.split(";");
                verifs = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = liste.length; i < len; i++) {
                    it = liste[i];
                    results.push(mM.verification.numberValidation(it));
                  }
                  return results;
                })();
                errors = _.flatten(_.compact(_.pluck(verifs, "error")));
                if (errors.length > 0) {
                  error = errors;
                } else {
                  error = false;
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
            case val !== "real":
              if (typeof userValue === "string") {
                v = Number(userValue.trim().replace('.', ","));
              } else {
                v = Number(userValue);
              }
              if (isNaN(v)) {
                return {
                  processed: false,
                  user: userValue,
                  error: "Vous devez entrer un nombre"
                };
              } else {
                return {
                  processed: v,
                  user: userValue,
                  error: false
                };
              }
              break;
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
            case !(result = /color:([0-9]+)/.exec(val)):
              processed = (function() {
                var i, len, ref, results;
                ref = userValue.split(";");
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                  it = ref[i];
                  results.push(Number(it));
                }
                return results;
              })();
              error = ((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = processed.length; i < len; i++) {
                  it = processed[i];
                  if (isNaN(it) || it < 0 || it >= result) {
                    results.push(it);
                  }
                }
                return results;
              })()).length > 0;
              if (error) {
                return {
                  processed: false,
                  user: userValue,
                  error: "Vous devez attribuer toutes les couleurs"
                };
              } else {
                return {
                  processed: processed,
                  user: userValue,
                  error: false
                };
              }
              break;
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
      var i, len, n, name, out;
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
          for (i = 0, len = name.length; i < len; i++) {
            n = name[i];
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
          briques = exoController.getBriques(inputs, options, itemData.fixedSettings);
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
