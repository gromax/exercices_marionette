define(["entities/exofiche"], function(ExoFiche) {
  var EFCollec;
  EFCollec = Backbone.Collection.extend({
    model: ExoFiche
  });
  return EFCollec;
});
