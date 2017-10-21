define(["backbone.radio", "entities/exercices/exercices_catalog"], function(Radio, Catalog) {
  var API, Item, ItemsCollection, channel;
  Item = Backbone.Model.extend({
    defaults: {
      title: "Titre de l'exercice",
      description: "Description de l'exercice",
      keywords: ""
    }
  });
  ItemsCollection = Backbone.Collection.extend({
    model: Item
  });
  API = {
    getEntities: function() {
      var collection, itemsData;
      itemsData = Catalog.all();
      collection = new ItemsCollection(itemsData);
      return collection;
    }
  };
  channel = Radio.channel('exercices');
  channel.reply('exercices:entities', API.getEntities);
});
