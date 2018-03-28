define ["utils/math", "utils/help"], (mM, help) ->

	# id:26
	# title: "Coordonnées d'un vecteur"
	# description: "Calculer les coordonnées du vecteur entre deux points."
	# keyWords:["Géométrie", "Repère", "Vecteur", "Seconde"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs }).save(inputs)
			[
				A
				B
				B.toClone("\\overrightarrow{AB}").am(A, true).simplify()
			]

		getBriques: (inputs, options) ->
			[A, B, gAB] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On se place dans un repère &nbsp; $(O;I,J)$."
								"On donne deux points &nbsp; $#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$."
								"Il faut déterminer les coordonnées de &nbsp; $\\overrightarrow{AB}$."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name: "x"
							description: "Abscisse du vecteur"
							tag:"$x_{\\overrightarrow{AB}}$"
							good: gAB.x
						}
						{
							type: "input"
							rank: 3
							waited: "number"
							name: "y"
							description: "Ordonnée du vecteur"
							tag:"$y_{\\overrightarrow{AB}}$"
							good: gAB.y
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 5
							list: help.vecteur.coordonnes
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, gAB] = that.init(inputs,options)
				return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$."
							"Donnez les coordonnées du vecteur &nbsp; $\\overrightarrow{AB}$."
						]
					}
					{
						type: "enumerate",
						refresh:true
						enumi:"1",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, gAB] = that.init(inputs,options)
				return "$#{A.texLine()}$ et $#{B.texLine()}$"

			return {
				children: [
					"On donne les coordonnées de deux points $A$ et $B$."
					"Donnez les coordonnées du vecteur $\\overrightarrow{AB}$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}




	}
