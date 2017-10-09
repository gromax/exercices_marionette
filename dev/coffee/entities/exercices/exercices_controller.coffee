define [], () ->
	Controller =
		list : [
			{
				id:1
				title:"Équation de droite"
				description:"Déterminer l'équation d'une droite passant par deux points."
				keyWords:["Géométrie", "Droite", "Équation", "Seconde"]
			}
			{
				id:2
				title: "Milieu d'un segment"
				description: "Calculer les coordonnées du milieu d'un segment."
				keyWords: ["Géométrie", "Repère", "Seconde"]
			}
			{
				id:3
				title:"Symétrique d'un point"
				description:"Calculer les coordonnées du symétrique d'un point par rapport à un autre point."
				keyWords : ["Géométrie", "Repère", "Seconde"]
			}

		]
		get: (id) ->
			idExo = Number id
			(exo for exo in @list when exo.id is idExo)[0]
		all: -> @list

	return Controller
