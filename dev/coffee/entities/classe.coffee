define [], () ->
	Classe = Backbone.Model.extend {
		urlRoot: "api/classes"

		defaults: {
			nomOwner: ""
			idOwner:""
			nom: ""
			description: ""
			ouverte: false
			pwd:""
			date:"2000-01-01"
		}

		parse: (data) ->
			if typeof data.ouverte is "string"
				data.ouverte = (Number(data.ouverte)==1)
			return data

		validate: (attrs, options) ->
			errors = {}
			if not attrs.nom
				errors.nom = "Ne doit pas être vide"
			else
				if attrs.nom.length < 2
					errors.nom = "Trop court"
			if not _.isEmpty(errors)
				return errors
	}

	return Classe
