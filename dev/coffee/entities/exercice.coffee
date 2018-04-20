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

	BriqueItem = Backbone.Model
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
			verif_processing = (verifItem)->
				switch
					when typeof verifItem is "function"
						out = verifItem(data)
					when verifItem.type is "all"
						out = mM.verification.all(data[verifItem.name].processed, verifItem.good, verifItem.parameters)
						if data[verifItem.name].processed.length is 0
							stringAnswer = "\\varnothing"
						else
							stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join("$ &nbsp; ; &nbsp; $")
						list = [{ type:"normal", text:"Vous avez répondu &nbsp; $#{stringAnswer}$" }]
						if out.goodMessage then list.push out.goodMessage
						out.add = {
							type:"ul"
							list: list.concat(out.errors)
						}
						if verifItem.rank? then out.add.rank = verifItem.rank
					when verifItem.type is "some"
						out = mM.verification.some(data[verifItem.name].processed, verifItem.good, verifItem.parameters)
						if data[verifItem.name].processed.length is 0
							stringAnswer = "\\varnothing"
						else
							stringAnswer = _.pluck(data[verifItem.name].processed, "tex").join("$ &nbsp; ; &nbsp; $")
						list = [
							{ type:"normal", text:"Vous avez répondu &nbsp; $#{stringAnswer}$" }
						]
						if out.goodMessage then list.push out.goodMessage
						out.add = {
							type:"ul"
							list: list.concat(out.errors)
						}
						if verifItem.rank? then out.add.rank = verifItem.rank
					when verifItem.radio?
						name = verifItem.name
						tag = verifItem.tag ? name
						p = data[name].processed
						g = verifItem.good
						out = {
							add: {
								type: "ul"
								list: [{
									type:"normal"
									text:"<b>#{tag} &nbsp; :</b>&emsp; Vous avez répondu &nbsp; #{verifItem.radio[p]}."
								}]
							}
						}

						if p is g
							out.note = 1
							out.add.list.push {
								type:"success"
								text:"C'est la bonne réponse."
							}
						else
							out.note = 0
							out.add.list.push {
								type:"error"
								text:"La bonne réponse était &nbsp; #{verifItem.radio[g]}."
							}
						if verifItem.rank? then out.add.rank = verifItem.rank
					else
						out = mM.verification.isSame(data[verifItem.name].processed, verifItem.good, verifItem.parameters)
						tag = verifItem.tag ? verifItem.name
						list = [
							{ type:"normal", text:"<b>#{tag}</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $#{data[verifItem.name].processed.tex}$" }
						]
						list.push out.goodMessage
						out.add = {
							type:"ul"
							list: list.concat(out.errors)
						}
						if verifItem.rank? then out.add.rank = verifItem.rank
				out

			verif = _.map(@get("verifications"), verif_processing )

			# On convertit ces json en BriqueItems
			add_models = _.map(_.flatten(_.compact(_.pluck(verif, "add"))), (item)-> new BriqueItem(item))
			notes = _.filter(_.pluck(verif,"note"), (item)-> typeof item is "number" )
			sum = (it,memo) -> it+memo
			note = _.reduce(notes, sum, 0) / notes.length
			{ add:add_models, note:note }

		checkIfNeedValidation: () -> @get("items").where({type:"validation"}).length > 0

		validation:(data) ->
			fct_iteratee = (val, key) ->
				if (userValue = data[key])?
					switch
						when val is "liste"
							if userValue is "∅" or userValue is "\\varnothing"
								processed = []
								error = false
							else
								liste = userValue.split(";")
								verifs = (mM.verification.numberValidation(it) for it in liste)
								errors = _.flatten(_.compact(_.pluck(verifs, "error")))
								if errors.length>0 then error = errors
								else error = false
								processed = _.pluck(verifs,"processed")
							{
								processed: processed
								user: userValue
								error: error
							}
						when val is "number"
							mM.verification.numberValidation(userValue)
						when val is "real"
							if typeof userValue is "string"
								v = Number(userValue.trim().replace '.', ",")
							else
								v = Number(userValue)
							if isNaN(v)
								{
									processed: false
									user: userValue
									error: "Vous devez entrer un nombre"
								}
							else
								{
									processed: v
									user: userValue
									error:false
								}
						when result=/radio:([0-9]+)/.exec(val)
							result = Number(result[1])
							p = Number userValue
							if p<0 or p>result
								error = "La réponse n'est pas dans la liste"
							else
								error = false
							{
								processed: p
								user: userValue
								error:error
							}
						when typeof val is "function"
							val(userValue)
						else
							{ processed:false, user:userValue, error:"Aucun type de validation défini !"}
				else
					{ processed:false, user:"?", error: "Réponse manquante !" }
			_.mapObject(@get("validations"), fct_iteratee)

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
					when "exo0057" then require ["entities/exercices/exo0057"], successCB, failedCB
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
