define [], ()->
	Item = Backbone.Model.extend {
		urlRoot: "api/devoirs"

		defaults: {
			nomOwner: false
			idOwner:""
			nom: ""
			description: ""
			visible: false
			actif: false
			date:"2000-01-01"
		}

		toJSON: ->
			return _.pick(this.attributes, 'id', 'idOwner', 'nom', 'description', 'visible', 'actif');

		parse: (data)->
			if data.id then data.id = Number data.id
			data.idOwner = Number data.idOwner
			data.actif = (data.actif is "1") or (data.actif is 1) or (data.actif is true)
			data.visible = (data.visible is "1") or (data.visible is 1) or (data.visible is true)
			return data

		validate: (attrs, options)->
			errors = {}
			if not attrs.nom
				errors.nom = "Ne doit pas être vide";
			else
				if attrs.nom.length<2
					errors.nom = "Trop court"
			if not _.isEmpty(errors)
				return errors
	}

	return Item;
