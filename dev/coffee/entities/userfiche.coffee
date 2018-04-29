define [], () ->
	UserFiche = Backbone.Model.extend {
		urlRoot: "api/assosUF"
		defaults: {
			nomUser: ""
			prenomUser: ""
			idUser: 0
			idFiche: 0
			actif:false
		}

		parse: (data) ->
			if data.id
				data.id = Number data.id
			data.idUser = Number data.idUser
			data.idFiche = Number data.idFiche
			data.nomCompletUser = "#{data.nomUser} #{data.prenomUser}"
			data.actif = (data.actif is "1") or (data.actif is 1) or (data.actif is true)
			if data.ficheActive
				data.ficheActive = (data.ficheActive is "1") or (data.ficheActive is 1) or (data.ficheActive is true)
			return data

		toJSON: () ->
			return {
				idUser: @get("idUser")
				idFiche: @get("idFiche")
				actif: @get("actif")
			}

		getCoeffs: (aEFsCollec) ->
			exercices_coeff={}
			if aEFsCollec
				models = aEFsCollec.models
				exercices_coeff[item.get("id")] = { coeff:item.get("coeff"), num:item.get("num") } for item in models
			return exercices_coeff

		calcNote: (aEFs_models_array, notes_json_array) ->
			total = aEFs_models_array.reduce (memo, item) ->
				notes_of_EF = _.where(notes_json_array, { aEF: item.get("id") })
				return item.calcNote(notes_of_EF)*item.get("coeff")+ memo
			, 0

			totalCoeff = aEFs_models_array.reduce (memo,item) ->
				return item.get("coeff") + memo
			, 0
			Math.ceil total/totalCoeff

		cloneEFs: () ->
			# La collection des exercices est liée une fiche devoir et non
			# à une fiche userfiche. Elle peut notamment être commune
			# mais à fin d'affichage des EF dans le cadre d'un userfiche, je prévois de générer une collection ad hoc

			Collec = Backbone.Collection.extend {
				model: Backbone.Model
			}
			self = @
			liste = ({ aEF:item, aUF:self } for item in @get("aEFs").models)

			return new Collec liste
	}

# Comme je compte mettre en cache les requêtes, il me semble impossible de faire la requête d'une userfiche
# indépendamment de la collection. En effet, si d'un côté j'ai des models userfiches dans la collection
# et que d'un autre je charge un userfiche indépendamment, l'outil de cache ne va pas comprendre qu'il peut
# piocher le model directement dans la collection déjà en cache et on aura alors travail sur deux copies
# indépendantes d'un même objet qui évolueront séparément tout le temps du cache

	return UserFiche;

