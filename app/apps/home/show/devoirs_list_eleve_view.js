define(["jst", "marionette"], function(JST, Marionette) {
  var Item, Liste, noView;
  noView = Marionette.View.extend({
    template: window.JST["home/show/devoirs-list-eleve-none"],
    tagName: "a",
    className: "list-group-item"
  });
  Item = Marionette.View.extend({
    tagName: "a",
    className: function() {
      if (!this.model.get("actif") || this.model.has("ficheActive") && !this.model.get("ficheActive")) {
        return "list-group-item list-group-item-danger";
      } else {
        return "list-group-item";
      }
    },
    template: window.JST["home/show/devoirs-list-eleve-item"],
    initialize: function(options) {
      this.faits = _.where(options.faits, {
        aUF: options.model.get("id")
      });
      return this.exofiches = options.exofiches.where({
        idFiche: options.model.get("idFiche")
      });
    },
    serializeData: function() {
      var data;
      data = _.clone(this.model.attributes);
      data.note = this.model.calcNote(this.exofiches, this.faits);
      if (_.has(data, "ficheActive")) {
        data.actif = data.actif && data.ficheActive;
      }
      return data;
    },
    triggers: {
      "click": "devoir:show"
    }
  });
  Liste = Marionette.CollectionView.extend({
    className: "list-group",
    emptyView: noView,
    childView: Item,
    initialize: function(options) {
      this.exofiches = options.exofiches;
      return this.faits = options.faits.toJSON();
    },
    childViewOptions: function(model, index) {
      return {
        exofiches: this.exofiches,
        faits: this.faits
      };
    }
  });
  return Liste;
});
