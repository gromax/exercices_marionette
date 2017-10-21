# Classe d'un item exercice
define ["backbone.radio","entities/exercices/exercices_catalog", "utils/math"], (Radio, Catalog, mM) ->
	# debug : J'aimerais pouvoir supprimer mM d'ici
	Exo = Backbone.Model.extend {
		defaults:
			title: "Titre de l'exercice"
			description: "Description de l'exercice"
			keywords: ""
		go: ->
			briques = @get("briquesCollection").models
			for b in briques
				if !b.go()
					b.set("focused",true)
					return false
			return true




	}

	formatListeItem = (item) ->
		# Crée un objet pour BListe qui s'assure de l'intégrité des informations fournies
		# et qui donne aussi les fonctions de correction (verif), de validation (go)
		# Les paramètres sont les suivants :
		# - tag : le tag à afficher à gauche du input correspondant
		# - postTag : tag après le champ
		# - name : le nom pour le node html correspondant et aussi le nom pour l'objet answers stocké en bdd
		# - description : ce qui apparaît dans le champ vide
		# - text : Un message à placer avant le input
		# - moduloKey : une lettre de variable pour le modulo, comme k dans 2kpi
		# - un choix entre plusieurs options pour la bonne solution :
		# -- good : Solution unique qui peut être number, ensemble, équation
		# -- equations : objets équations, séparées de ; ou ∅ pour rien
		# -- solutions : objets numbers multiples, séparées de ; ou ∅ pour rien
		# - customTemplate : Une fonction qui renvoie un tableau de string à ajouter dans un template
		# - Des paramètres concernant le parse :
		# -- simplify : true/false
		# -- alias : { key:[v1, v2] }, chaque occurence de v1, v2... est remplacée par key
		# -- developp : true/false
		# -- toLowerCase : true/false

		output = {
			name: item.name
			description : item.description ? ""	# Dans le input, s'il est vide (placeholder)
			tag: item.tag ? false			# Étiquette, devant le input
			text:item.text ? false			# texte à placer avant le input
			answerPreprocess: item.answerPreprocess ? false
			answer:false					# réponse utilisateur
		}

		###

		output.verifParams = {
			arrondi : item.arrondi ? false
			formes : item.formes ? null
			custom: if typeof item.customVerif is "function" then item.customVerif else null
			tolerance : item.tolerance ? false
		}

		output.templateParams = {
			name:item.name					# nécessaire pour les inputs
			arrondi:item.arrondi ? false	# Si on demande un arrondi, on précise ici une puissance (-2 pour 0.01 par ex.)
			cor_prefix:item.cor_prefix ? ""	# Permet d'ajouter un préfixe à la valeur correction. Différent de goodTex car permet de préfixer également le userTex

			custom: if typeof item.customTemplate is "function" then item.customTemplate else () -> false
		}


		output.parseParams = {
			type:item.type ? ""
			developp:item.developp is true
			toLowerCase:item.toLowerCase is true
			alias : item.alias ? false
		}

		if typeof item.moduloKey is "string" then output.moduloKey = item.moduloKey
		else output.moduloKey = false
		fct_go = (answers) ->
			user = answers[@name]
			switch
				when (typeof user isnt "string")
					# Dans ce cas, le champ n'est pas invalide car il n'a rien reçu
					@templateParams.invalid = false
					false
				when user is "∅"
					@templateParams.user = "∅"
					@info = []
					@templateParams.invalid = false
					true
				else
					@templateParams.user = user
					if @moduloKey then user = user.replace(new RegExp(@moduloKey,"g"), "#")
					users = ( mM.p.userAnswer(str, @parseParams) for str in user.split ";" when str.trim() isnt "")
					@info = (usItem for usItem in users when usItem.valid is true)
					@templateParams.invalid = (users.length>@info.length) or (users.length is 0)
					if (@templateParams.invalid) then @templateParams.parseMessages = "Vérifiez : #{ (infoItem.expression for infoItem in users when infoItem.valid is false).join(' ; ') }"
					not(@templateParams.invalid)

		fct_verif = ->
			# fonction servant pour les équations et les solutions
			# Si l'utilisateur a répondu ensemble vide...
			if @info.length is 0
				@templateParams[key] = value for key, value of {
					users:false
					goods:null
					bads:null
					lefts: (l.tex() for l in @solutions).join(" ; ")
					goodIsEmpty:@solutions.length is 0
				}
				if @solutions.length is 0 then 1 else 0
			else
				# On considère que l'on a une série de valeurs
				N = Math.max @solutions.length, @info.length
				sorted = mM.tri @info, @solutions
				list=[]
				goods = []
				bads = []
				for sol,i in sorted.closests
					list.push sol.user.tex()
					if sol.good?
						verif = mM.verif[@parseParams.type](sol.info, sol.good, @verifParams)
						if verif.ok
							verif.userTex = sol.info.tex
							verif.goodTex = sol.good.tex()
							goods.push verif
						else
							bads.push sol.info.tex
							sorted.lefts.push sol.good
					else bads.push sol.info.tex
				@templateParams[key] = value for key, value of {
					users:list.join(" ; ")
					goods:goods
					bads:bads.join(" ; ")
					lefts:(l.tex() for l in sorted.lefts).join(" ; ")
					goodIsEmpty:@solutions.length is 0
				}
				goods.length/N

		switch
			when item.solutions?
				output.templateParams.corTemplateName = "cor_solutions"
				unless output.templateParams.text? then output.templateParams.text = "Donnez les solutions séparées par ; ou $\\varnothing$ s'il n'y en a pas"
				output.solutions = ( mM.toNumber(it) for it in item.solutions )
				output.parseParams.type = "number"
				output.go = fct_go
				output.verif = ->fct_verif
			when item.equations?
				output.templateParams.corTemplateName = "cor_solutions"
				unless output.templateParams.text? then output.templateParams.text = "Donnez les solutions séparées par ; ou $\\varnothing$ s'il n'y en a pas"
				output.solutions = item.equations
				output.parseParams.type = "equation"
				@go = fct_go
				@verif = fct_verif
			else # par défaut, ce sera un item avec good
				goodArray = null
				goodValue = null
				switch
					when Array.isArray(item.good)
						switch item.good.length
							when 0 then goodValue = 0
							when 1 then goodValue = item.good[0]
							else
								goodArray = item.good
								goodValue  = item.good[0]
					when typeof item.good is "undefined" then goodValue = 0
					else goodValue = item.good
				output.parseParams = mM.p.type goodValue, output.parseParams
				if goodArray isnt null
					if (output.parseParams.type is "number") then output.good = ( mM.toNumber(it) for it in goodArray )
					else output.good = goodArray
				else
					if (output.parseParams.type is "number") then output.good = mM.toNumber(goodValue)
					else output.good = goodValue
				output.templateParams.corTemplateName = "cor_number"
				if typeof item.goodTex is "string" then output.templateParams.goodTex = item.goodTex
				else output.templateParams.goodTex = output.good.tex()
				output.go = (answers) ->
					user = answers[@name]
					if (typeof user isnt "string")
						# Dans ce cas, le champ n'est pas invalide car il n'a rien reçu
						@templateParams.invalid = false
						false
					else
						@templateParams.user = user
						@info = mM.p.userAnswer user, @parseParams
						@templateParams.userTex = @info.tex
						@templateParams.invalid = not(@info.valid)
						@templateParams.parseMessages = @info.messages.join(" ; ")
						@info.valid
				output.verif = () ->
					if isArray(@good)
						verif_result = ( mM.verif[@parseParams.type](@info, it,@verifParams) for it in @good)
						verif_result.sort (a,b) ->
							if b.ponderation>a.ponderation then -1
							else 1
						verif_result = verif_result.pop()
					else verif_result = mM.verif[@parseParams.type](@info, @good,@verifParams)
					@templateParams.customItems = @templateParams.custom(verif_result)
					@templateParams[key] = value for key,value of verif_result
					verif_result.ponderation
		###
		output

	BPlain = Backbone.Model.extend {
		parse: (data) ->
			if typeof data.title isnt "string" then data.title=false
			data.focused = false
			data.done = true
			return data
		go: -> true
		validation: -> false
	}

	BListe = Backbone.Model.extend {
		parse: (data) ->
			if not(Array.isArray(data.aide)) then data.aide = false
			if typeof data.title isnt "string" then data.title=false
			if data.liste?
				items = ( formatListeItem(it) for it in data.liste )
				data.liste = items
			data.focused = false
			data.done = false
			return data
		validation: (data) ->
			liste = @get "liste"
			if _.isEmpty(liste) then return false
			errors = {}
			data = data ? {}
			validated_data = {}
			for it in liste
				name = it.name
				waited = it.waited
				if data[name]?
					userValue = data[name]
					if userValue is "" then errors[name] = "Ne doit pas être vide"
					else
						error_found = false
						if it.answerPreprocess isnt false
							{ processed, error } = it.answerPreprocess(userValue)
							if error is false then userValue = processed
							else
								error_found = true
								errors[name] = error
						if error_found is false
							{ info, error } = mM.p.validate userValue, waited
							if error is false then validated_data[name] = info
							else errors[name] = error
				else
					errors[name] = "Indéfini"
			if _.isEmpty errors
				# Tout est bon, on peut mettre à jour les answer des différents items
				it.answer = validated_data[it.name] for it in liste
				return false
			errors
		go: ->
			if !@get("done")
				liste = @get("liste")
				ok = true
				if (it for it in liste when it.answer is false).length is 0
					@set("done", true)
					@set("focused", false)
			@get("done")
	}

	BriquesCollection = Backbone.Collection.extend {
		model: (data) ->
			switch data.type
				when "liste"
					return new BListe data, { parse:true }
				else
					return new BPlain data, { parse:true }
	}

# Il faut définir une collection de briques avec pour model une fonction
# type model:(attr,options)->
# qui fait un new de brique différente suivant le cas
# et définir des briques adhoc pour chaque élément de l'exercice


	API =
		getEntity: (id, data) ->
			inputs = data?.inputs ? { }
			options = data?.options ? { }
			itemData = Catalog.get id
			defer = $.Deferred()
			if itemData?
				filename = itemData.filename
				exo = new Exo itemData

				successCB = (exoController) ->
					exoData = exoController.init(inputs, options)
					collection = new BriquesCollection exoData.briques
					collection.parent = exo
					exo.set("briquesCollection", collection)
					exo.set("inputs", inputs)
					exo.set("options", options)
					exo.go() # place le curseur sur la première brique pas encore faite
					defer.resolve exo

				failedCB = () ->
					defer.reject()

				require ["entities/exercices/#{filename}"], successCB, failedCB
			else
				defer.reject()

			promise = defer.promise()
			return promise

	channel = Radio.channel 'exercices'
	channel.reply 'exercice:entity', API.getEntity

	return null
