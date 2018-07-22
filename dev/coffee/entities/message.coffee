define [], () ->
	Item = Backbone.Model.extend {
		urlRoot: "api/messages"

		defaults: ->
			idOwner: ""
			dests: []
			message: ""
			aUE: 0
			lu: false
			date: "2000-01-01 00:00:00"
			ownerName: "?"
			destNames: "?"

		toJSON: ->
			data = this.attributes
			output = {
				id: data.id
				idOwner: data.idOwner
				message: data.message
				lu: data.lu
				aUE: data.aUE
			}
			if not _.isEmpty(data.dests)
				output.dests = ( it.id for it in data.dests ).join(";")
			return  output

		parse: (data) ->
			if data.id then data.id = Number data.id
			if data.aUE then data.aUE = Number data.aUE
			data.idOwner = Number data.idOwner
			data.lu = (data.lu is "1") or (data.lu is 1) or (data.lu is true)
			if data.dests
				parseDests = (item) ->
					[id, nom] = item.split(":")
					{ nom: nom, id:Number id }
				data.dests = ( parseDests(item) for item in data.dests.split(";"))
				data.destNames = ( it.nom for it in data.dests ).join(" ; ")
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
