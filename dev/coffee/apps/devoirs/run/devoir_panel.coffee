define ["jst","marionette"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["devoirs/run/devoir-panel"]
		serializeData: ->
			data = _.clone(@model.attributes)
			# Il faut fournir actif, nomFiche et description
			if data.nomFiche
				# C'est un userfiche d'élève
				data.actif = data.actif and data.ficheActive
			else
				# C'est une fiche dans le cadre d'un affichage prof
				data.nomFiche = data.nom
			data.profMode = (@options.profMode is true)
			data
	}
	return Panel
