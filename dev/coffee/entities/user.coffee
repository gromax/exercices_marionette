define [], () ->
	User = Backbone.Model.extend {
		urlRoot: "api/users"

		defaults: {
			prenom: ""
			nom: ""
			email: ""
			nomClasse: "N/A"
			rank:"Off"
			cas:""
		},

		toJSON: ()->
			output = _.clone(_.omit(@attributes,"pref"))
			if (pref = @attributes.pref) isnt false
				output.pref = JSON.stringify(pref)
			return output

		parse: (data) ->
			if (data.id)
				data.id = Number(data.id)
			if(data.idClasse)
				data.idClasse = Number(data.idClasse)
			if (data.nomClasse == null)
				data.nomClasse = "N/A"
			data.nomComplet = data.nom+" "+data.prenom
			data.isEleve = (data.rank == "Élève")
			if typeof data.pref is "string" and data.pref isnt ""
				data.pref = JSON.parse(data.pref)
			else data.pref = false
			return data

		testClasseMdp: (mdp) ->
			promise = $.ajax( "api/classes/#{@get('idClasse')}/test", {
				data:{ pwd:mdp }
				dataType: "json"
				method: "GET"
			})
			return promise;

		validate: (attrs, options) ->
			errors = {}
			if @get("rank") is "Root"
				attrs.prenom = ""
				attrs.nom = "Root"
				attrs.email = "root"
			else
				if not attrs.prenom
					errors.prenom = "Ne doit pas être vide"
				if not attrs.nom
					errors.nom = "Ne doit pas être vide"
				else
					if attrs.nom.length<2
						errors.nom = "Trop court"
				# en présence d'un cas, peut importe l'email
				reCas =  /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/
				if not reCas.test(attrs.cas)
					if not attrs.email
						errors.email = "Ne doit pas être vide"
					else
						reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						if not reEmail.test(attrs.email)
							errors.email = "L'email n'est pas valide"
			if not _.isEmpty(errors)
				return errors

	}

	return User
