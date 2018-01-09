define(["entities/exofiche"], function(ExoFiche){

	var EFCollec = Backbone.Collection.extend({
		model: ExoFiche,
	});

	return EFCollec;
});
