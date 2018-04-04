# Classe d'un item exercice
define ["backbone.radio","entities/exercices/exercices_catalog", "utils/math"], (Radio, Catalog, mM) ->
	# debug : J'aimerais pouvoir supprimer mM d'ici
	Exo = Backbone.Model.extend {
		defaults:
			title: "Titre de l'exercice"
			description: "Description de l'exercice"
			keywords: ""
			options:{}

		getBriquesUntilFocus:()->
			# Renvoie un tableau de toutes les briques qui ne sont pas done jusqu'à celle qui a le focus
			output = []
			briques = @get("briquesCollection").models
			for b in briques when b.get("done") is false
				output.push(b)
				if b.isFocusPoint() is true
					return output
			# Si aucun focus n'a été trouvé, on termine avec false
			output.push(false)
			return output

		baremeTotal: () ->
			briques = @get("briquesCollection").models
			baremes = _.map(briques, (it)-> it.get("bareme"));
			iteratee = (memo,it) ->
				if typeof it is "number" then memo + it
				else memo
			_.reduce(baremes, iteratee, 0)
	}

	BriqueItem = Backbone.Model.extend {
		initialize: (modelData) ->
			switch
				when typeof modelData.verification is "function"
					@verification = modelData.verification
				when modelData.type is "input"
					@verification = Functions_helpers.inputVerification
				when modelData.type is "radio"
					@verification = Functions_helpers.radioVerification
				when modelData.type is "color-choice"
					@verification = Functions_helpers.color_choiceVerification
				when modelData.type is "validation"
					@verification = () -> { toTrash:@ }
				when modelData.type is "aide"
					@verification = () -> { toTrash:@ }
				else
					@verification = () -> null
			switch
				when typeof modelData.answerProcessing is "function"
					@answerProcessing = modelData.answerProcessing
				when modelData.type is "input"
					@answerProcessing = Functions_helpers.inputAnswerProcessing
				when modelData.type is "radio"
					@answerProcessing = Functions_helpers.radioAnswerProcessing
				when modelData.type is "color-choice"
					@answerProcessing = Functions_helpers.color_choiceAnswerProcessing
				else
					@answerProcessing = Functions_helpers.defaultAnswerProcess
			if typeof modelData.answerPreprocessing is "function"
				@answerPreprocessing = modelData.answerPreprocessing

		parse:(data)->
			switch data.type
				when "input"
					parsedData = _.extend({
						description : ""
						waited: "number"
						arrondi : false
						formes : null
						custom: if typeof data.customVerif is "function" then data.customVerif else null
						tolerance : false
					}, data)
				else
					parsedData = data
			parsedData
	}

	BriqueItemsCollection = Backbone.Collection.extend {
		model: BriqueItem
		comparator: "rank"
	}

	Brique = Backbone.Model.extend {
		defaults: {
			done: false
			title: false
		}

		parse: (data) ->
			data.items = new BriqueItemsCollection data.items, { parse:true }
			return data

		verification: (data)->
			verif_processing = (model)->
				verif = model.verification(data)
				if typeof (post = verif?.post) is "function"
					verif.post = { item: model, post:post }
				verif

			verif = _.map(@get("items").models, verif_processing )

			customBriqueVerifFunction = @get("custom_verification_message")
			if (typeof customBriqueVerifFunction is "function") && (customAdd = customBriqueVerifFunction(data))
				verif.push customAdd

			# Le verif produit de simple items json, comme le font les exercices
			add_json = _.flatten(_.compact(_.pluck(verif, "add")))

			# posts : fonctions à éxécuter après le render (a priori pour une fonction déjà traitée)
			posts = _.compact(_.pluck(verif, "post"))
			# On convertit ces json en BriqueItems
			add_models = _.map(add_json, (item)-> new BriqueItem(item, {parse:true}))
			notes = _.filter(_.pluck(verif,"note"), (item)-> typeof item is "number" )
			sum = (it,memo) -> it+memo
			note = _.reduce(notes, sum) / notes.length
			{ toTrash: _.compact(_.pluck(verif, "toTrash")), add:add_models, posts:posts, note:note }

		checkIfNeedValidation: () -> @get("items").where({type:"validation"}).length > 0

		validation:(data) ->
			reduce_fct = (memo,item) ->
				if item isnt null
					_.extend(memo, item)
				else
					memo
			list = _.map(@get("items").models, (model)-> model.answerProcessing(data))
			# On produit un objet avec { clé objet erreur }
			_.reduce(list, reduce_fct, {})


		# La fonction go me crée du soucis :
		# Si j'appelle go dans un contexte d'initialisation de l'exercice
		# avec les answers déjà enregistrées, je veux que go parcours toutes les briques jusqu'à blocage
		# et donc fasse les vérifications et toutes les transformations nécessaires à liste d'item (par exemple de remplacer les briques par les messages de correction)

		# En revanche, si j'appelle go suite à une validation, je veux faire une validation, si la validation se passe bien, envoyer les answers au serveur,
		# et seulement si le serveur répond, modifier la liste
		# et encore, nouveau problème : l'envoi au serveur ne pourra pas se faire si on n'a pas calculé la nouvelle note et donc si la vérification n'a pas eu lieu...


		isFocusPoint: () ->
			# Cette fonction recherche le prochain point de focus
			# Si la brique requiert des réponses, c'est le point de focus et on retourne true
			if @get("done") then return false
			if @checkIfNeedValidation() then return true
			@set("done", true)
			false
	}

	BriquesCollection = Backbone.Collection.extend {
		model: Brique
	}

	Functions_helpers =
		defaultAnswerProcess: (answers_data)->
			name = @get("name")
			if (name?)
				out = {}
				answers_data = answers_data ? {}
				if typeof name is "string"
					if answers_data[name]?
						out[name] = answers_data[name]
					else
						out[name] = { error:"Vous devez donner une réponse" }
				else if _.isArray(name)
					for n in name
						if answers_data[n]?
							out[n] = answers_data[n]
						else
							out[n] = { error:"Vous devez donner une réponse" }
				if _.isEmpty(out) then return null
				out
			else
				null
		radioAnswerProcessing: (data) ->
			# renvoie null si pas concerné
			# sinon un objet contenant { name:string, answer:string, tout autre attribut utile pour le modèle }
			# ou { name:string , error: string } en cas d'erreur
			data = data ? {}
			name = @get("name")
			out = {}
			if (userValue = data[name])?
				# Il suffit de vérifier que userValue est dans liste
				userValue = Number userValue
				radioItems = @get "radio"
				if userValue < radioItems.length
					# C'est bon
					out[name] = {
						processedAnswer: userValue
						answer : userValue
					}
				else
					out[name] = {
						error: "La réponse n'est pas dans la liste."
					}
			else
				out[name] = {
					error: "Vous devez donner une réponse"
				}
			out

		inputAnswerProcessing: (data) ->
			# renvoie null si pas concerné
			# sinon un objet contenant { name:string, answer:string, tout autre attribut utile pour le modèle }
			# ou { name:string , error: string } en cas d'erreur
			data = data ? {}
			name = @get("name")
			out = {}
			if (userValue = data[name])?
				waited = @get("waited")
				error = false
				processedAnswer = false
				if userValue is "" then error = "Ne doit pas être vide"
				else
					if typeof @answerPreprocessing is "function"
						{ processed, error } = @answerPreprocessing(userValue)
						if error is false then userValue = processed
					if error is false
						{ info, error } = mM.p.validate userValue, waited
						if error is false then processedAnswer = info
				if error is false
					out[name] = {
						processedAnswer: processedAnswer
						answer: data[name]
					}
				else
					out[name] = {
						error: error
					}
			else
				out[name] = {
					name: name
					error: "Vous devez donner une réponse"
				}
			out

		color_choiceAnswerProcessing: (data) ->
			data = data ? {}
			name = @get("name")
			nVal = @get("list").length
			out = {}
			values = []
			for i in [0..nVal-1]
				userValue = Number(data[name+i])
				if userValue is -1
					out[name] = {
						error : "Vous devez attribuer toutes les couleurs."
					}
					return out
				else
					values[i] = userValue
			out[name] = values.join(";")
			out

		radioVerification: (answers_data) ->
			note = 0
			model_data=@attributes
			answer_data = answers_data[model_data.name]

			title = model_data.corectionTag || model_data.tag || model_data.name
			items = [{
				type:"normal"
				text:"<b>#{title} &nbsp; \:</b>&emsp; Vous avez répondu &nbsp; #{model_data.radio[answer_data.processedAnswer]}"
			}]

			if answer_data.processedAnswer is model_data.good
				note = 1
				items.push {
					type:"success"
					text:"C'est la bonne réponse."
				}
			else
				note = 0
				items.push {
					type:"error"
					text:"La bonne réponse était &nbsp; #{model_data.radio[model_data.good]}."
				}

			{
				toTrash:@
				note:note
				add: {
					type:"ul"
					rank: @get("rank")
					list:items
				}
			}

		inputVerification: (answers_data) ->
			note = 0
			model_data=@attributes
			answer_data = answers_data[model_data.name]

			title = model_data.corectionTag || model_data.tag || model_data.name
			items = [{
				type:"normal"
				text:"<b>#{title} &nbsp; \:</b>&emsp; Vous avez répondu &nbsp; <i>#{answer_data.answer}</i>"
			}]

			if Array.isArray(answer_data.processedAnswer)
				# On attendait une liste de valeurs
				if answer_data.processedAnswer.length is 0
					# L'utilisateur a répondu ensemble vide
					if (model_data.good.length is 0)
						# La réponse était ensemble vide, c'est donc une bonne réponse
						items.push { type:"success", text:"Bonne réponse" }
						note = 1
					else
						# La bonne réponse n'était pas vide
						stringAnswer = ( "$#{it.tex()}$" for it in model_data.good).join(" ; ")
						items.push { type:"error", text:"Vous auriez dû donner #{stringAnswer}" }
				else
					# L'utilisateur a donné plusieurs réponses
					if (model_data.good.length is 0)
						# La réponse était ensemble vide, L'utilisateur s'est donc trompé
						items.push { type:"error", text:"La bonne réponse était $\\varnothing$." }
					else
						# Il faut faire le tri pour associer deux à deux user et good
						{ closests, lefts } = mM.tri answer_data.processedAnswer, model_data.good
						bads = []
						N = model_data.good.length
						for sol in closests
							if sol.good?
								# Un objet good a été associé à cette réponse utilisateur
								verifResponse = mM.verif[sol.info.type](sol.info, sol.good, model_data)
								note += verifResponse.note/N
								switch
									when verifResponse.note is 1
										items.push { type:"success", text:"<i>#{sol.info.expression}</i> &nbsp; est une bonne réponse." }
									when verifResponse.note > 0
										if verifResponse.errors.length>0
											items.push { type:"warning", text:"<i>#{sol.info.expression}</i> &nbsp; est accepté, mais :" }
											items.push({ type:"warning", text:errorItem }) for errorItem in verifResponse.errors
										else
											items.push { type:"warning", text:"<i>#{sol.info.expression}</i> &nbsp; est accepté mais la réponse peut être améliorée." }
									else
										bads.push sol.info.expression
										lefts.push sol.good
							else
								bads.push sol.info.expression
						if bads.length>0 then items.push { type:"error", text:"Ces solutions que vous donnez sont fausses : #{bads.join(" ; ")}" }
						if lefts.length>0 then items.push { type:"error",text:"Vous n'avez pas donné ces solutions : #{ ("$#{it.tex()}$" for it in lefts).join(" ; ") }" }
			else
				# On attend une réponse simple
				# mais on peut avoir proposé plusieurs réponses possibles
				type = answer_data.processedAnswer.type
				if Array.isArray(model_data.good)
					# Dans ce cas, on teste tous les cas et on prend la meilleure pondération
					verif_results = ( mM.verif[type](answer_data.processedAnswer, it_good, model_data ) for it_good in model_data.good)
					# On trie pour extraire le résultat donnant la pondération la plus haute
					{ note, errors } = _.max(verif_results, (item)-> item.note )
				else
					# C'est une réponse simple
					{ note, errors } = mM.verif[type](answer_data.processedAnswer, model_data.good, model_data)
				switch
					when note is 1
						items.push { type:"success", text:"<i>#{answer_data.answer}</i> &nbsp; est une bonne réponse."}
					when note>0
						if errors.length>0
							items.push { type:"warning", text:"<i>#{answer_data.answer}</i> &nbsp; est accepté, mais :" }
							items.push({ type:"warning", text:errorItem }) for errorItem in errors
						else
							items.push { type:"warning", text:"<i>#{answer_data.answer}</i> &nbsp; est accepté mais la réponse peut être améliorée." }
					else
						items.push { type:"error", text:"Mauvaise réponse." }
						if errors.length>0
							items.push({ type:"warning", text:errorItem }) for errorItem in errors
				customMessageFunction = @get("custom_verification_message")
				if (typeof customMessageFunction is "function") && (customMessage = customMessageFunction(answers_data))
					if customMessage.note then note += customMessage.note
					items.push customMessage
			{
				toTrash:@
				note:note
				add: {
					type:"ul"
					rank: @get("rank")
					list:items
				}
			}
		color_choiceVerification: (answers_data)->
			name = @get("name")
			answers = answers_data[name].split(";")
			list = @get("list")
			note = 0
			colors = require("utils/colors")
			fct = (it)->
				rank = it.rank
				answer = Number(answers[rank])
				if answer is rank
					# C'est la bonne réponse
					return { text:it.text, type:"success", color:colors.html(rank), note:1 }
				else
					# mauvaise réponse
					return { text:it.text, type:"error", color:colors.html(answer), secondColor:colors.html(rank), note:0 }
			correcList = ( fct(it) for it in list )
			note = _.reduce(
				correcList,
				(memo,it)-> return memo+it.note,
				0
			)/list.length
			{
				toTrash:@
				note:note
				add: {
					type: "color-list"
					rank: @get("rank")
					list: correcList
				}
			}


	API =
		getEntity: (id, options_for_this_instance, inputs) ->
			inputs = inputs ? { }
			options_for_this_instance = options_for_this_instance ? { }
			itemData = Catalog.get id
			defer = $.Deferred()
			if itemData?
				filename = itemData.filename
				exo = new Exo itemData

				# Ici on dispose de deux objets options d'origine différentes :
				# Le options_for_this_instance contenant les valeurs pour l'exécution de cette occurence de l'exercice
				# Le itemData.options contenant les config de l'exerice
				iteratee = (val, key)->
					value = options_for_this_instance[key]
					if value? then val.value = value
					else val.value = 0
					val
				options = _.mapObject(itemData.options,iteratee)
				exo.set {
					"inputs": inputs
					"options": options
				}

				successCB = (exoController) ->
					briques = exoController.getBriques(inputs, options)
					# initBriques modifie inputs qui est un objet, donc pas de pb
					collection = new BriquesCollection briques, { parse:true }
					collection.parent = exo
					exo.set {
						"briquesCollection": collection
					}
					defer.resolve exo

				failedCB = () ->
					defer.reject({ message: "Fichier #{filename} introuvable."})

				switch filename
					when "exo0001" then require ["entities/exercices/exo0001"], successCB, failedCB
					when "exo0002" then require ["entities/exercices/exo0002"], successCB, failedCB
					when "exo0003" then require ["entities/exercices/exo0003"], successCB, failedCB
					when "exo0004" then require ["entities/exercices/exo0004"], successCB, failedCB
					when "exo0005" then require ["entities/exercices/exo0005"], successCB, failedCB
					when "exo0006" then require ["entities/exercices/exo0006"], successCB, failedCB
					when "exo0007" then require ["entities/exercices/exo0007"], successCB, failedCB
					when "exo0008" then require ["entities/exercices/exo0008"], successCB, failedCB
					when "exo0009" then require ["entities/exercices/exo0009"], successCB, failedCB
					when "exo0010" then require ["entities/exercices/exo0010"], successCB, failedCB
					when "exo0011" then require ["entities/exercices/exo0011"], successCB, failedCB
					when "exo0012" then require ["entities/exercices/exo0012"], successCB, failedCB
					when "exo0013" then require ["entities/exercices/exo0013"], successCB, failedCB
					when "exo0014" then require ["entities/exercices/exo0014"], successCB, failedCB
					when "exo0015" then require ["entities/exercices/exo0015"], successCB, failedCB
					when "exo0016" then require ["entities/exercices/exo0016"], successCB, failedCB
					when "exo0017" then require ["entities/exercices/exo0017"], successCB, failedCB
					when "exo0018" then require ["entities/exercices/exo0018"], successCB, failedCB
					when "exo0019" then require ["entities/exercices/exo0019"], successCB, failedCB
					when "exo0020" then require ["entities/exercices/exo0020"], successCB, failedCB
					when "exo0021" then require ["entities/exercices/exo0021"], successCB, failedCB
					when "exo0022" then require ["entities/exercices/exo0022"], successCB, failedCB
					when "exo0023" then require ["entities/exercices/exo0023"], successCB, failedCB
					when "exo0024" then require ["entities/exercices/exo0024"], successCB, failedCB
					when "exo0025" then require ["entities/exercices/exo0025"], successCB, failedCB
					when "exo0026" then require ["entities/exercices/exo0026"], successCB, failedCB
					when "exo0027" then require ["entities/exercices/exo0027"], successCB, failedCB
					when "exo0028" then require ["entities/exercices/exo0028"], successCB, failedCB
					when "exo0029" then require ["entities/exercices/exo0029"], successCB, failedCB
					when "exo0030" then require ["entities/exercices/exo0030"], successCB, failedCB
					when "exo0031" then require ["entities/exercices/exo0031"], successCB, failedCB
					when "exo0032" then require ["entities/exercices/exo0032"], successCB, failedCB
					when "exo0033" then require ["entities/exercices/exo0033"], successCB, failedCB
					when "exo0034" then require ["entities/exercices/exo0034"], successCB, failedCB
					when "exo0035" then require ["entities/exercices/exo0035"], successCB, failedCB
					when "exo0036" then require ["entities/exercices/exo0036"], successCB, failedCB
					when "exo0037" then require ["entities/exercices/exo0037"], successCB, failedCB
					when "exo0038" then require ["entities/exercices/exo0038"], successCB, failedCB
					when "exo0039" then require ["entities/exercices/exo0039"], successCB, failedCB
					when "exo0040" then require ["entities/exercices/exo0040"], successCB, failedCB
					when "exo0041" then require ["entities/exercices/exo0041"], successCB, failedCB
					when "exo0042" then require ["entities/exercices/exo0042"], successCB, failedCB
					when "exo0043" then require ["entities/exercices/exo0043"], successCB, failedCB
					when "exo0044" then require ["entities/exercices/exo0044"], successCB, failedCB
					when "exo0045" then require ["entities/exercices/exo0045"], successCB, failedCB
					when "exo0046" then require ["entities/exercices/exo0046"], successCB, failedCB
					when "exo0047" then require ["entities/exercices/exo0047"], successCB, failedCB
					when "exo0048" then require ["entities/exercices/exo0048"], successCB, failedCB
					when "exo0049" then require ["entities/exercices/exo0049"], successCB, failedCB
					when "exo0050" then require ["entities/exercices/exo0050"], successCB, failedCB
					when "exo0051" then require ["entities/exercices/exo0051"], successCB, failedCB
					when "exo0052" then require ["entities/exercices/exo0052"], successCB, failedCB
					when "exo0053" then require ["entities/exercices/exo0053"], successCB, failedCB
					when "exo0054" then require ["entities/exercices/exo0054"], successCB, failedCB
					when "exo0055" then require ["entities/exercices/exo0055"], successCB, failedCB
					when "exo0056" then require ["entities/exercices/exo0056"], successCB, failedCB
					#when "exo0057" then require ["entities/exercices/exo0057"], successCB, failedCB
					#when "exo0058" then require ["entities/exercices/exo0058"], successCB, failedCB
					#when "exo0059" then require ["entities/exercices/exo0059"], successCB, failedCB
					else require ["entities/exercices/#{filename}"], successCB, failedCB
			else
				defer.reject({ message: "Exercice ##{id} introuvable dans le catalogue."})

			promise = defer.promise()
			return promise

	channel = Radio.channel 'entities'
	channel.reply 'exercice:entity', API.getEntity

	return null
