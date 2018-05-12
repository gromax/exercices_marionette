define ["backbone.radio","entities/exercices/exercices_catalog", "jst"], (Radio, Catalog, JST)->
	Exam = Backbone.Model.extend {
		urlRoot:"api/exams"
		defaults: {
			nom: "Version papier"
		}

		parse: (data)->
			if data.id then data.id = Number(data.id)
			data.idFiche = Number data.idFiche
			data.locked = (data.locked is "1") or (data.locked is 1) or (data.locked is true)
			if typeof data.data is "string"
				data.data = JSON.parse(data.data)
			return data

		toJSON: ->
			output = _.pick(@attributes, 'id', 'nom', 'idFiche', 'data', 'locked')
			if typeof output.data is "object"
				output.data = JSON.stringify(output.data)
			return output

		toExamBriques: ->
			params = @get("data");
			# params est un tableau de inputs avec idE, options, inputs array
			# Les options sont sous forme { key:value }

			deferGlobal = $.Deferred()
			counter = params.length; # permet de compter le travail restant à faire
			out = ( { children:[], message:false } for it in params )

			fct_item_exo = (item, index) ->
				itemParams = params[index]
				idE = itemParams.idE
				iteratee_options = (option_item) -> { value: option_item }
				options = _.mapObject(itemParams.options, iteratee_options)
				inputs = itemParams.inputs

				exoData = Catalog.get(idE)
				if exoData
					filename = exoData.filename
					item.title = exoData.title
					# Prise en compte des paramètres d'options

					successCB = (exoController)->
						if typeof exoController.getExamBriques is "function"
							_.extend(item, exoController.getExamBriques(inputs,options, exoData.fixedSettings))
						else
							item.message = "Cet exercice n'a pas de fonction Exam [##{idE}]"
						counter--
						if counter is 0
							deferGlobal.resolve(new ExerciceCollection(out))

					failedCB = () ->
						item.message = "Le fichier "+filename+" n'a pu être chargé."
						counter--
						if counter is 0
							deferGlobal.resolve(new ExerciceCollection(out))

					require(["entities/exercices/#{filename}"], successCB, failedCB)
				else
					item.message="L'exercice ##{idE} n'est pas dans le catalogue."
					item.title = "Exercice inconnu !"
					counter--
					if counter is 0
						deferGlobal.resolve(new ExerciceCollection(out))

			if counter is 0
				deferGlobal.resolve(new ExerciceCollection(out))
			else
				_.each(out, fct_item_exo)

			return deferGlobal.promise();

		refresh: (exo_index, item_index) ->
			defer = $.Deferred()
			data = @get("data")
			if data.length<exo_index
				defer.reject("Il n'y a que #{data.length} exercices dans la liste, pas #{exo_index+1} !")
				return defer.promise()
			exo_data = data[exo_index]
			if exo_data.inputs.length<item_index
				defer.reject("L'exercice #{exo_index+1} ne doit être répété que #{exo_data.length}, pas #{exo_index+1} fois !")
				return defer.promise()
			# L'item peut être réinitialisé
			idE = exo_data.idE
			# Il faut reconstruire l'objet options
			options = _.mapObject(exo_data.options, (itO)->
				return { value: itO }
			)

			exoInCatalog = Catalog.get(idE)
			if exoInCatalog
				filename = exoInCatalog.filename
				# Prise en compte des paramètres d'options

				successCB = (exoController)->
					inputs = {}
					exoController.init(inputs,options) # Cette fonction change inputs
					exo_data.inputs[item_index] = inputs

					briques = { children:[], message:false, title:exoInCatalog.title }

					if typeof exoController.getExamBriques is "function"
						_.extend(briques, exoController.getExamBriques(exo_data.inputs,options, exoInCatalog.fixedSettings))
					else
						briques.message = "Cet exercice n'a pas de fonction Exam"

					defer.resolve {
						inputs:inputs
						briques: briques
					}

				failedCB = -> defer.reject("Fichier #{filename} introuvable.")

				require(["entities/exercices/#{filename}"], successCB, failedCB)
			else
				defer.reject("Exercice ##{idE} introuvable dans le catalogue.")
			return defer.promise()

		getTex: ->
			defer = $.Deferred()
			params = @get("data")
			# params est un tableau de inputs avec idE, options, inputs array
			# Les options sont sous forme { key:value }

			counter = params.length # permet de compter le travail restant à faire
			exercices_tex_object = ({ children:[], title:"", message:false} for it in params)
			templateDatas = {
				exercices: exercices_tex_object
				id: @get("id")
				nom: @get("nom")
			}

			fct_remove_blank_lines = (text)-> text.replace(/^\s*[\r\n]/gm, "\r\n")

			fct_item_exo = (item, index) ->
				template = window.JST["devoirs/exam/exam-tex"]
				itemParams = params[index]
				idE = itemParams.idE
				iteratee_options = (option_item) -> { value: option_item }

				options = _.mapObject(itemParams.options, iteratee_options)
				inputs = itemParams.inputs

				exoData = Catalog.get(idE)
				if exoData
					filename = exoData.filename
					item.title = exoData.title
					# Prise en compte des paramètres d'options

					successCB = (exoController) ->
						if typeof exoController.getTex is "function"
							_.extend(item, exoController.getTex(inputs,options, exoData.fixedSettings))
						else
							item.message = "\\textcolor{red}{Cet exercice n'a pas de fonction Tex [#{idE}]}"
						counter--
						if counter is 0
							defer.resolve( fct_remove_blank_lines(template(templateDatas)) )

					failedCB = ->
						item.message = "\\textcolor{red}{Le fichier \\verb?#{filename}? n'a pu être chargé.}"
						counter--
						if counter is 0
							defer.resolve( fct_remove_blank_lines(template(templateDatas)) )

					require(["entities/exercices/"+filename], successCB, failedCB)
				else
					item.message="\\textcolor{red}{L'exercice [#{idE}] n'est pas dans le catalogue.}"
					item.title = "Exercice inconnu"
					counter--
					if counter is 0
						defer.resolve( fct_remove_blank_lines(template(templateDatas)) )

			if counter is 0
				defer.resolve( fct_remove_blank_lines(template(templateDatas)) )
			else
				_.each(exercices_tex_object, fct_item_exo)

			return defer.promise()
	}

	ExerciceInExam = Backbone.Model.extend {
		defaults: {
			title: "Exercice",
			unique: false,
		},
	}

	ExerciceCollection = Backbone.Collection.extend {
		model: ExerciceInExam,
	}


	API= {
		newExamEntityWithIdFiche: (idFiche)->
			defer = $.Deferred()
			require ["entities/dataManager"], () ->
				fetchingData = channel.request("custom:entities", ["exofiches"])
				$.when(fetchingData).done( (exofiches)->
					ex = exofiches.where({idFiche: Number(idFiche)})
					params = ( {
							idE: item.get "idE"
							options:item.get "options"
							num:Number item.get("num")
						} for item in ex)

					fetchingExo = API.newExamEntityWithParams(params)
					$.when(fetchingExo).done( (exoModel)->
						defer.resolve(exoModel)
					).fail( (response) ->
						defer.reject(response)
					)
				)

			return defer.promise()

		newExamEntityWithParams: (params)->
			# params est un tableau
			# pour chaque item, il faut préciser idE, options, num
			# Les options sont complètes
			out = {
				messages:[]
				data: ( {} for it in params )
				erreur:false
			}
			deferGlobal = $.Deferred()
			counter = params.length # permet de compter le travail restant à faire

			fct_item_exo = (item, index) ->
				itemParams = params[index]
				idE = itemParams.idE
				num = itemParams.num
				options = itemParams.options

				item.idE = idE
				item.options = _.mapObject(options, (itO)->
					return itO.value
				)

				exoData = Catalog.get(idE)
				if exoData
					filename = exoData.filename
					# Prise en compte des paramètres d'options

					successCB = (exoController)->
						outExoInputs = []
						for i in [0..num-1]
							inputs = {}
							exoController.init(inputs,options) # Cette fonction change inputs
							outExoInputs.push(inputs)

						item.inputs = outExoInputs
						counter--
						if counter is 0
							if out.erreur
								deferGlobal.reject(out)
							else
								deferGlobal.resolve(out)

					failedCB = ->
						item.inputs = []
						out.messages.push("Fichier #{filename} introuvable.")
						out.erreur = true
						counter--
						if counter is 0
							deferGlobal.reject(out)

					require(["entities/exercices/#{filename}"], successCB, failedCB)
				else
					item.inputs=[]
					out.erreur = true
					out.messages.push("Exercice ##{idE} introuvable dans le catalogue.")
					counter--
					if counter is 0
						deferGlobal.reject(out)

			if counter is 0
				deferGlobal.resolve(out)
			else
				_.each(out.data, fct_item_exo)

			return deferGlobal.promise()
	}

	channel = Radio.channel 'entities'
	channel.reply 'new:exam:entity', API.newExamEntityWithIdFiche

	return Exam
