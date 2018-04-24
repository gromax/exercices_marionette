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
							ps: [
								"On se place dans un repère &nbsp; $(O;I,J)$."
								"On donne deux points &nbsp; $#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$."
								"Il faut déterminer les coordonnées de &nbsp; $\\overrightarrow{AB}$."
							]
						}
						{
							type: "input"
							name: "x"
							description: "Abscisse du vecteur"
							tag:"Abscisse"
						}
						{
							type: "input"
							name: "y"
							description: "Ordonnée du vecteur"
							tag:"Ordonnée"
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.vecteur.coordonnes
						}
					]
					validations:{
						x:"number"
						y:"number"
					}
					verifications:[
						{
							name:"x"
							tag:"Abscisse"
							good:gAB.x
						}
						{
							name:"y"
							tag:"Ordonnée"
							good:gAB.x
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
