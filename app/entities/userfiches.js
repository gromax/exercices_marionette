define(["entities/userfiche"], function(Item) {
  var ItemsCollection;
  ItemsCollection = Backbone.Collection.extend({
    url: "api/assosUF",
    model: Item,
    getNumberForEachUser: function() {
      return this.models.reduce(function(output, item) {
        var id;
        id = item.get("idUser");
        if (output[id]) {
          output[id]++;
        } else {
          output[id] = 1;
        }
        return output;
      }, {});
    }
  });
  return ItemsCollection;
});
