define [], () ->
	UE = Backbone.Model.extend {
		urlRoot: "api/notes"
		parse: (data) ->
			if data.id
				data.id = Number data.id
			data.aEF = Number data.aEF
			data.aUF = Number data.aUF
			data.finished = (data.finished is "1") or (data.finished is 1) or (data.finished is true)
			return data
	}

	return UE
