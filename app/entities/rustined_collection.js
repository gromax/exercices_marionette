define(["marionette","backbone"], function(Marionette,Backbone){
  var RustinedCollection = function(options){
    var original = options.collection;
    var rustined = new original.constructor();
    rustined.add(original.models);

    original.on("add", function(models){
      rustined.reset(original.models);
    });

    original.on("remove", function(models){
      rustined.reset(original.models);
    });

    return rustined;
  };

  return RustinedCollection;
});
