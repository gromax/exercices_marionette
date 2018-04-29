define ["entities/exofiche"], (ExoFiche) ->
	EFCollec = Backbone.Collection.extend {
		model: ExoFiche
	}
	EFCollec
