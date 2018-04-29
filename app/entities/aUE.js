define([], function() {
  var UE;
  UE = Backbone.Model.extend({
    urlRoot: "api/notes",
    parse: function(data) {
      if (data.id) {
        data.id = Number(data.id);
      }
      data.aEF = Number(data.aEF);
      data.aUF = Number(data.aUF);
      data.finished = (data.finished === "1") || (data.finished === 1) || (data.finished === true);
      return data;
    }
  });
  return UE;
});
