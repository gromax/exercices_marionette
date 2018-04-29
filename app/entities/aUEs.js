define(["entities/aUE"], function(Item) {
  var ItemsCollection;
  ItemsCollection = Backbone.Collection.extend({
    url: "api/notes",
    model: Item
  });
  return ItemsCollection;
});
