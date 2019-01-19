define ["entities/exercices/exercices_catalog"], (catalog) ->
	ExoFiche = Backbone.Model.extend {
		urlRoot:"api/exosfiche"
		defaults: {
			title: ""
			description: ""
			keyWords: []
			idE: false
			num:1
			coeff:1
			options:{}
		}

		validate: (attrs, options) ->
			errors = {}
			if not attrs.num
				errors.num = "Ne doit pas être vide"
			else
				if not $.isNumeric(attrs.coeff)
					errors.num = "Il faut enter un nombre"
			if not attrs.coeff
				errors.coeff = "Ne doit pas être vide"
			else
				if not $.isNumeric(attrs.coeff)
					errors.coeff = "Il faut enter un nombre"
			if not _.isEmpty(errors)
				return errors

		calcNote: (notesArray, notation=0) ->
			#notation représente le système de notation
			# 0 : système de poids dégressif, le défaut
			# 1 : on prend les n meilleurs

			notes = (Number(it.note) for it in notesArray)
			num = Math.max(@get("num"), 1)

			l = notes.length
			# Il faut que l'élève ait fait au moins num fois l'exercice
			if l<num
				notes = (0 for i in [1..num-l]).concat(notes)

			if notation is 1
				# attention le sort est alphabétique par défaut...
				notes.sort (a,b)-> if a>b then 1 else -1
				noteExo = notes[-num..].reduce (x,y)-> x+y
				Math.ceil(noteExo/num)
			else
				# Il faut tenir compte du cas où l'élève n'a pas fait tous les exos
				# revient à ajouter les 0 nécessaires
				#if l<num
				#	poidsExo = poidsExo*.9 + 1 for i in [1..num-l]
				noteExo = 0
				poidsExo = 0
				for n in notes
					noteExo = noteExo*.9 + n
					poidsExo = poidsExo*.9 + 1
				Math.ceil(noteExo/poidsExo)

		parse: (data) ->
			if data.id
				data.id = Number data.id
			data.idFiche = Number data.idFiche
			exo_attributes = catalog.get data.idE
			if not exo_attributes
				exo_attributes = {
					title: "Exercice inconnu"
					description: ""
					keyWords: []
					options:{}
				}

			data.options = data.options ? {}
			if typeof data.options is "string"
				# On convertit en objet
				if data.options is ""
					data.options = {}
				else
					data.options = JSON.parse data.options

			iteratee = (value, key) ->
				# On initialise chaque option à sa valeur par défaut
				selectedOption = Number(data.options[key] ? 0)
				if selectedOption<0 or selectedOption>value.options.length
					selectedOption = 0
				output = _.clone value
				output.value = selectedOption
				output
			data.options = _.mapObject(exo_attributes.options, iteratee)

			# Lors d'un new exoFiche, le parse s'éxécute avant que les valeurs par défaut ne soient fournies
			# et on se retrouve avec num et coeff undefined
			# Les valeurs par défaut sont donc imposées ici directement
			data.num = Number(data.num ? 1)
			data.coeff = Number(data.coeff ? 1)
			data = _.extend(data, _.omit(exo_attributes, "id", "filename", "options"))
			return data


		toJSON: () ->
			output = _.clone(_.omit(@attributes,"title", "options", "description", "keyWords"))
			# options peut être l'objet complet contenant toutes les infos
			# { nomOpt:{ tag:"string", options[strin array], def:number, value:number}, ... }
			# ou seulement la liste des valeurs des différents attributs
			# { nomOpt: number, ... }
			iteratee = (val,key) ->
				if (typeof val is "object")
					return val.value ? 0
				else
					return val
			options = _.mapObject(@get("options"), iteratee)
			output.options = JSON.stringify(options)
			return output
	}

	return ExoFiche
