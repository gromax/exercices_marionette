define [], () ->
	Item = Backbone.Model.extend {
		urlRoot: "api/messages"

		defaults: ->
			idOwner: ""
			message: ""
			aUE: 0
			lu: false
			date: "2000-01-01 00:00:00"
			ownerName: "?"
			idDest: ""
			destName: "?"

		toJSON: ->
			return _.pick(@attributes, "id", "idOwner", "idDest", "message", "lu", "aUE")

		parse: (data) ->
			if data.id then data.id = Number data.id
			if data.aUE then data.aUE = Number data.aUE
			data.idOwner = Number data.idOwner
			data.idDest = Number data.idDest
			data.lu = (data.lu is "1") or (data.lu is 1) or (data.lu is true)
			return data

		setLu: (mdp) ->
			promise = $.ajax( "api/messages/#{@get('id')}/lu", {
				dataType: "json"
				method: "PUT"
			})
			return promise;

		validate: (attr, options) ->
			errors = {}
			if not attr.message
				errors.message = "Ne doit pas être vide"
			if not _.isEmpty(errors)
				return errors
	}

	return Item
