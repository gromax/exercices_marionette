define(["jst", "marionette", "mathjax", "mathquill", "backbone.syphon"], function(JST, Marionette, MathJax) {
  var AddInputView, AideItemView, BriqueItemsListView, BriqueView, BriquesListView, ColorChoiceItemView, ColorListItemView, DefaultItemView, InputItemView, JsxgraphItemView, OptionsView, PiedView, RadioItemView, ValidationItemView, View;
  DefaultItemView = Marionette.View.extend({
    className: "card-body",
    template: window.JST["exercices/common/brique-item"],
    onFormDataInvalid: function(data) {
      var $el, model, name, validation_item;
      model = this.model;
      name = model.get("name");
      if (name) {
        $el = this.$el;
        $el.find(".js-validation-error").each(function() {
          return $(this).remove();
        });
        validation_item = data[name];
        if (validation_item && validation_item.error) {
          $el.addClass("bg-danger text-white");
          return $el.append(window.JST["exercices/common/validation-error"]({
            error: validation_item.error
          }));
        } else {
          return $el.removeClass("bg-danger text-white");
        }
      }
    },
    onRender: function() {
      var fcts, i, item, len, that;
      that = this;
      if (fcts = this.model.get("renderingFunctions")) {
        for (i = 0, len = fcts.length; i < len; i++) {
          item = fcts[i];
          item(that);
        }
      }
      return MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$el[0]]);
    },
    remove: function() {
      this.model.destroy();
      return Marionette.View.prototype.remove.call(this);
    },
    execPostVerification: function(data) {
      var post;
      post = this.model.get("postVerification");
      if (typeof post === "function") {
        return post(this, data);
      }
    }
  });
  RadioItemView = DefaultItemView.extend({
    template: window.JST["exercices/common/radio"],
    defaultToTrash: true
  });
  AideItemView = DefaultItemView.extend({
    template: window.JST["exercices/common/aide-item"],
    defaultToTrash: true
  });
  InputItemView = DefaultItemView.extend({
    template: window.JST["exercices/common/input"],
    defaultToTrash: true,
    triggers: {
      "focusin input": "form:input:focusin",
      "focusin textarea": "form:input:focusin"
    },
    onRender: function() {
      var fctMQ, format, that;
      that = this;
      format = this.model.get("format");
      if (format) {
        fctMQ = function(item) {
          var $answerSpan, mathField;
          if (item.latex && item.name) {
            $answerSpan = $("#mq-exo-" + item.name, that.$el);
            mathField = window.MQ.MathField($answerSpan[0], {
              spaceBehavesLikeTab: true,
              autoCommands: 'pi theta sqrt',
              autoOperatorNames: 'sin cos',
              handlers: {
                edit: function() {
                  if (mathField) {
                    return $("#exo-" + item.name).val(mathField.latex());
                  }
                },
                enter: function() {
                  return that.trigger("form:submit");
                }
              }
            });
            return [item.name, mathField];
          } else {
            return false;
          }
        };
        this.mathFields = _.object(_.compact(_.map(format, fctMQ)));
      }
      return MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$el[0]]);
    }
  });
  AddInputView = DefaultItemView.extend({
    template: window.JST["exercices/common/add-input"],
    defaultToTrash: true,
    triggers: {
      "click button.js-add-input": "button:add",
      "click button.js-remove-input": "button:remove"
    },
    initialize: function() {
      return this.inputs = [];
    },
    onButtonAdd: function(view, e) {
      var $newInput, index;
      index = this.inputs.length;
      $newInput = $(window.JST["exercices/common/input-del"]({
        index: index,
        name: "pwet",
        tag: "lala",
        description: "rr"
      }));
      view.$el.append($newInput);
      return this.inputs.push($newInput);
    },
    onButtonRemove: function(view, e) {
      var $el, index;
      console.log(e);
      $el = $(e.currentTarget);
      index = Number($el.attr("index"));
      return console.log(index);
    }
  });
  ColorChoiceItemView = DefaultItemView.extend({
    template: window.JST["exercices/common/color-choice-item"],
    defaultToTrash: true,
    triggers: {
      "click a.list-group-item-action": "choice:click:item"
    },
    onChoiceClickItem: function(view, e) {
      var $el, $inp, $square, index, maxValue, nVal, name, v, values;
      $el = $(e.currentTarget);
      index = Number($el.attr("index"));
      name = this.model.get("name");
      maxValue = this.model.get("maxValue");
      if (maxValue) {
        nVal = maxValue + 1;
      } else {
        nVal = this.model.get("list").length;
      }
      $inp = $("input[name='" + name + "']");
      $square = $el.find("i.fa-square").first();
      values = $inp.val().split(";");
      v = Number(values[index]) + 1;
      if (v >= nVal) {
        v = 0;
      }
      values[index] = v;
      $inp.val(values.join(";"));
      return require(["utils/colors"], function(colors) {
        return $square.css({
          color: colors.html(v)
        });
      });
    }
  });
  ColorListItemView = Marionette.View.extend({
    className: "card-body",
    template: window.JST["exercices/common/color-list-item"],
    onRender: function() {
      return MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$el[0]]);
    },
    remove: function() {
      this.model.destroy();
      return Marionette.View.prototype.remove.call(this);
    }
  });
  ValidationItemView = Marionette.View.extend({
    className: "card-body",
    template: window.JST["exercices/common/validation-item"],
    defaultToTrash: true,
    triggers: {
      "click button.js-submit": "form:submit",
      "mousedown button.js-clavier": "form:clavier:click"
    },
    onRender: function() {
      return MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$el[0]]);
    },
    remove: function() {
      this.model.destroy();
      return Marionette.View.prototype.remove.call(this);
    }
  });
  JsxgraphItemView = DefaultItemView.extend({
    className: "card-body text-center",
    template: window.JST["exercices/common/jsxgraph-item"],
    onRender: function() {
      var divId, model, params, that;
      model = this.model;
      params = model.get("params");
      that = this;
      divId = model.get("divId");
      this.$el.find(".jxgbox").each(function() {
        var $el, fctTO;
        $el = $(this);
        fctTO = function() {
          return $el.height($el.width());
        };
        return setTimeout(fctTO, 0);
      });
      return require(["jsxgraph"], function() {
        var fcts, i, item, len, results;
        that.graph = JXG.JSXGraph.initBoard(divId, params);
        if (fcts = model.get("renderingFunctions")) {
          results = [];
          for (i = 0, len = fcts.length; i < len; i++) {
            item = fcts[i];
            results.push(item(that.graph));
          }
          return results;
        }
      });
    }
  });
  BriqueItemsListView = Marionette.CollectionView.extend({
    childView: function(model) {
      var type;
      type = model.get("type");
      switch (type) {
        case "jsxgraph":
          return JsxgraphItemView;
        case "validation":
          return ValidationItemView;
        case "color-choice":
          return ColorChoiceItemView;
        case "color-list":
          return ColorListItemView;
        case "input":
          return InputItemView;
        case "radio":
          return RadioItemView;
        case "aide":
          return AideItemView;
        case "add-input":
          return AddInputView;
        default:
          return DefaultItemView;
      }
    }
  });
  BriqueView = Marionette.View.extend({
    currentFocus: null,
    className: function() {
      if (this.model.get("cols") === 2) {
        return "col-md-6 col-12";
      } else {
        return "col-12";
      }
    },
    template: window.JST["exercices/common/brique-panel"],
    regions: {
      items: {
        el: 'div.js-items'
      }
    },
    initialize: function(data) {
      return this.listenTo(this.model, 'change:focus', this.setFocus);
    },
    onRender: function() {
      var items;
      items = this.model.get("items");
      this.itemsView = new BriqueItemsListView({
        collection: items
      });
      this.listenTo(this.itemsView, "childview:form:submit", this.formSubmit);
      this.listenTo(this.itemsView, "childview:form:clavier:click", this.onClavier);
      return this.listenTo(this.itemsView, "childview:form:input:focusin", this.onInputFocus);
    },
    serializeData: function() {
      var data;
      data = _.clone(this.model.attributes);
      data.needForm = this.model.checkIfNeedValidation();
      return data;
    },
    onClavier: function(childview, e) {
      var $el, $inp, $node, cible, currentText, format, id, it, mf, mfs, pEnd, pos, view;
      cible = e.currentTarget.name;
      if (cible === "aide") {
        $el = $("ul.js-liste-aide");
        if ($el.css('display') === 'none') {
          $el.slideDown("slow");
        } else {
          $el.slideUp("slow");
        }
      } else {
        if (!this.currentFocus) {
          view = this.itemsView.children.find(function(item) {
            return item.model.get("type") === "input";
          });
          if (view) {
            format = view.model.get("format");
            if (format) {
              it = _.first(_.filter(format, function(item) {
                if (item.name) {
                  return true;
                } else {
                  return false;
                }
              }));
              if (it) {
                if (it.latex) {
                  $node = view.$el.find("textarea");
                } else {
                  $node = view.$el.find("input");
                }
              }
            } else {
              $node = view.$el.find("input");
            }
            if ($node) {
              this.currentFocus = {
                view: view,
                node: $node[0]
              };
            }
          }
        }
        if (this.currentFocus) {
          if (this.currentFocus.node.tagName === "INPUT") {
            $inp = $(this.currentFocus.node);
            pos = $inp[0].selectionStart;
            pEnd = $inp[0].selectionEnd;
            currentText = $inp.val();
            switch (cible) {
              case "empty":
                $inp.val(currentText.substring(0, pos) + "∅" + currentText.substring(pos));
                break;
              case "pi":
                $inp.val(currentText.substring(0, pos) + "π" + currentText.substring(pos));
                break;
              case "infini":
                $inp.val(currentText.substring(0, pos) + "∞" + currentText.substring(pos));
                break;
              case "sqrt":
                $inp.val(currentText.substring(0, pos) + "sqrt(" + currentText.substring(pos, pEnd) + ")" + currentText.substring(pEnd));
                break;
              case "pow":
                $inp.val(currentText.substring(0, pos) + "^(" + currentText.substring(pos, pEnd) + ")" + currentText.substring(pEnd));
            }
          } else {
            id = $(this.currentFocus.node).parent().parent().attr('id');
            mfs = this.currentFocus.view.mathFields;
            mf = _.find(mfs, function(item, key) {
              if (id === "mq-exo-" + key) {
                return true;
              } else {
                return false;
              }
            });
            if (mf) {
              switch (cible) {
                case "empty":
                  mf.cmd('\\varnothing');
                  mf.focus();
                  break;
                case "sqrt":
                  mf.cmd('\\sqrt');
                  mf.focus();
                  break;
                case "pow":
                  mf.cmd("^");
                  mf.focus();
                  break;
                case "infini":
                  mf.cmd("\\infty");
                  mf.focus();
                  break;
                case "pi":
                  mf.cmd("\\pi");
                  mf.focus();
              }
            }
          }
        }
      }
      return false;
    },
    onInputFocus: function(childview, e) {
      return this.currentFocus = {
        view: childview,
        node: e.currentTarget
      };
    },
    formSubmit: function(e) {
      var cv_datas, data;
      data = Backbone.Syphon.serialize(this);
      cv_datas = this.itemsView.children.map(function(childview) {
        var fct, model;
        model = childview.model;
        if ((model.get("type") === "jsxgraph") && model.get("getData")) {
          fct = model.get("getData");
          return fct(childview.graph);
        } else {
          return null;
        }
      });
      data = _.reduce(cv_datas, function(memo, item) {
        if (item === null) {
          return memo;
        } else {
          return _.extend(memo, item);
        }
      }, data);
      return this.trigger("form:submit", data, this);
    },
    onFormDataInvalid: function(data) {
      var $el;
      $el = this.$el;
      $el.find(".js-validation-error").each(function() {
        return $(this).remove();
      });
      return _.each(data, function(value, key) {
        var $item;
        if (value.error) {
          $item = $("[name='" + key + "']").closest(".card-body");
          if (_.isArray(value.error)) {
            return _.each(value.error, function(er) {
              return $item.append("<span class='js-validation-error badge badge-pill badge-danger'><i class='fa fa-exclamation-triangle'></i> " + er + "</span>");
            });
          } else {
            return $item.append("<span class='js-validation-error badge badge-pill badge-danger'><i class='fa fa-exclamation-triangle'></i> " + value.error + "</span>");
          }
        }
      });
    },
    removeItem: function(model) {
      var childview;
      if (childview = this.itemsView.children.findByModel(model)) {
        return childview.remove();
      }
    },
    showItems: function() {
      return this.showChildView('items', this.itemsView);
    },
    setFocus: function() {
      return this.$el.find(".card-header").each(function() {
        return $(this).addClass("text-white bg-warning");
      });
    },
    unsetFocus: function() {
      return this.$el.find(".card-header").each(function() {
        return $(this).removeClass("text-white bg-warning");
      });
    },
    execPostVerification: function(data) {
      var list;
      list = this.itemsView.children.filter(function(item) {
        return item.model.has("postVerification");
      });
      return _.each(list, function(item) {
        return item.execPostVerification(data);
      });
    }
  });
  BriquesListView = Marionette.CollectionView.extend({
    className: "row",
    childView: BriqueView
  });
  PiedView = Marionette.View.extend({
    template: window.JST["exercices/common/pied"],
    className: "card"
  });
  OptionsView = Marionette.View.extend({
    template: window.JST["exercices/show/options-view"],
    className: "card",
    ui: {
      submit: "button.js-submit"
    },
    events: {
      "click @ui.submit": "formSubmit"
    },
    formSubmit: function(e) {
      var data;
      e.preventDefault();
      data = Backbone.Syphon.serialize(this);
      return this.trigger("options:form:submit", data);
    },
    serializeData: function() {
      return {
        optionsItems: _.map(this.model.attributes, function(val, key) {
          var ref;
          return {
            key: key,
            tag: val.tag,
            options: val.options,
            value: (ref = val.value) != null ? ref : 0
          };
        })
      };
    }
  });
  View = Marionette.View.extend({
    template: window.JST["exercices/show/show-view"],
    regions: {
      collection: {
        el: '#collection'
      },
      pied: {
        el: '#exercice-pied'
      },
      options: {
        el: '#options'
      }
    },
    ui: {
      reinit: "button.js-reinit",
      setoptions: "button.js-options",
      setanswers: "button.js-answers"
    },
    triggers: {
      "click @ui.reinit": "button:reinit",
      "click @ui.setoptions": "button:options",
      "click @ui.setanswers": "button:answers"
    },
    onRender: function() {
      var maCollection;
      maCollection = this.model.get("briquesCollection");
      this.listView = new BriquesListView({
        collection: maCollection
      });
      this.listenTo(this.listView, "childview:form:submit", this.formSubmit);
      this.showChildView('collection', this.listView);
      this.piedView = new PiedView({
        model: this.options.pied
      });
      this.showChildView('pied', this.piedView);
      this.listenTo(this.options.pied, "change:finished", this.piedView.render);
      return this.$el.find(".card-header").each(function() {
        return MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
      });
    },
    formSubmit: function(data, view) {
      return this.trigger("brique:form:submit", data, view);
    },
    showItems: function(brique) {
      var childView;
      childView = this.listView.children.findByModel(brique);
      if (childView) {
        return childView.showItems();
      }
    },
    setFocus: function(brique) {
      var childView;
      childView = this.listView.children.findByModel(brique);
      if (childView) {
        return childView.setFocus();
      }
    },
    serializeData: function() {
      var data;
      data = _.clone(this.model.attributes);
      data.showOptionsButton = this.options.showOptionsButton;
      data.showReinitButton = this.options.showReinitButton;
      data.showAnswersButton = this.options.showAnswersButton;
      return data;
    },
    showOptionsView: function(optionsModel) {
      var currentView, optionsView;
      currentView = this.getRegion('options').currentView;
      if (currentView) {
        return currentView.$el.toggle();
      } else {
        optionsView = new OptionsView({
          model: optionsModel
        });
        this.showChildView('options', optionsView);
        return this.listenTo(optionsView, "options:form:submit", function(data) {
          return this.trigger("options:form:submit", data);
        });
      }
    }
  });
  return View;
});
