define(["app", "marionette", "apps/common/alert_view", "apps/common/list_layout", "apps/devoirs/list/list_panel", "apps/devoirs/list/list_view", "apps/devoirs/edit/edit_fiche_view"], function(app, Marionette, AlertView, Layout, Panel, ListView, ShowView) {
  var Controller;
  Controller = Marionette.Object.extend({
    channelName: 'entities',
    list: function() {
      var channel, listItemsLayout, listItemsPanel;
      app.trigger("header:loading", true);
      listItemsLayout = new Layout();
      listItemsPanel = new Panel();
      channel = this.getChannel();
      return require(["entities/devoir", "entities/dataManager"], function(Item) {
        var fetching;
        fetching = channel.request("custom:entities", ["fiches"]);
        return $.when(fetching).done(function(fiches) {
          var listItemsView;
          listItemsView = new ListView({
            collection: fiches
          });
          listItemsLayout.on("render", function() {
            listItemsLayout.getRegion('panelRegion').show(listItemsPanel);
            return listItemsLayout.getRegion('itemsRegion').show(listItemsView);
          });
          listItemsPanel.on("devoir:new", function() {
            var newItem, view;
            newItem = new Item();
            view = new ShowView({
              model: newItem,
              editMode: true
            });
            view.on("form:submit", function(data) {
              var savingItem;
              savingItem = newItem.save(data);
              if (savingItem) {
                app.trigger("header:loading", true);
                return $.when(savingItem).done(function() {
                  newItem.set("nomOwner", app.Auth.get("nom"));
                  fiches.add(newItem);
                  view.trigger("dialog:close");
                  return listItemsView.flash(newItem);
                }).fail(function(response) {
                  switch (response.status) {
                    case 422:
                      return view.triggerMethod("form:data:invalid", response.responseJSON.errors);
                    case 401:
                      alert("Vous devez vous (re)connecter !");
                      view.trigger("dialog:close");
                      return app.trigger("home:logout");
                    default:
                      return alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code " + response.status + "/020]");
                  }
                }).always(function() {
                  return app.trigger("header:loading", false);
                });
              } else {
                return view.triggerMethod("form:data:invalid", newItem.validationError);
              }
            });
            return app.regions.getRegion('dialog').show(view);
          });
          listItemsView.on("item:show", function(childView, args) {
            var model;
            model = childView.model;
            return app.trigger("devoir:show", model.get("id"));
          });
          listItemsView.on("item:setAttribute", function(childView, attr_name) {
            var attr_value, model, updatingItem;
            model = childView.model;
            attr_value = model.get(attr_name);
            model.set(attr_name, !attr_value);
            updatingItem = model.save();
            if (updatingItem) {
              app.trigger("header:loading", true);
              return $.when(updatingItem).done(function() {
                childView.render();
                return childView.flash("success");
              }).fail(function(response) {
                if (response.status === 401) {
                  alert("Vous devez vous (re)connecter !");
                  return app.trigger("home:logout");
                } else {
                  return alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code " + response.status + "/021]");
                }
              }).always(function() {
                return app.trigger("header:loading", false);
              });
            } else {
              return alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/022]");
            }
          });
          listItemsView.on("item:delete", function(childView, e) {
            var destroyRequest, idFiche, model;
            model = childView.model;
            idFiche = model.get("id");
            if (confirm("Supprimer le devoir « " + (model.get('nom')) + " » ?")) {
              destroyRequest = model.destroy();
              app.trigger("header:loading", true);
              return $.when(destroyRequest).done(function() {
                childView.remove();
                return channel.request("fiche:destroy:update", idFiche);
              }).fail(function(response) {
                return alert("Erreur. Essayez à nouveau !");
              }).always(function() {
                return app.trigger("header:loading", false);
              });
            }
          });
          return app.regions.getRegion('main').show(listItemsLayout);
        }).fail(function(response) {
          var alertView;
          if (response.status === 401) {
            alert("Vous devez vous (re)connecter !");
            return app.trigger("home:logout");
          } else {
            alertView = new AlertView();
            return app.regions.getRegion('main').show(alertView);
          }
        }).always(function() {
          return app.trigger("header:loading", false);
        });
      });
    }
  });
  return new Controller();
});
