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

		getBriques: (inputs, options, fixedSettings) ->
			complexe = fixedSettings.c
			[A, B, gAB] = @init(inputs)

			if complexe
				[
					{
						bareme: 100
						items: [
							{
								type: "text"
								ps: [
									"On se place dans le plan complexe."
									"Soit les points A et B d'affixes &nbsp; $z_A = #{A.affixe().tex()}$ &nbsp; et &nbsp; $z_B = #{B.affixe().tex()}$."
									"Il faut déterminer l'affixe de &nbsp; $\\overrightarrow{AB}$."
								]
							}
							{
								type: "input"
								format: [
									{ text: "$z_{\\overrightarrow{AB}} = $", cols:3, class:"text-right" }
									{ latex: false, cols:9, name:"z", description: "Affixe du vecteur" }
								]
							}
							{
								type: "validation"
								clavier: ["aide"]
							}
							{
								type: "aide"
								list: [ "La méthode est la même qu'en géométrie analytique ordinaire : &nbsp;$z_{\\overrightarrow{AB}}=z_B-z_A$." ]
							}
						]
						validations:{
							z:"number"
						}
						verifications:[
							{
								name:"z"
								tag:"$z_{\\overrightarrow{AB}}$"
								good:gAB.affixe()
							}
						]
					}
				]
			else
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
								format: [
									{ text: "$x_{\\overrightarrow{AB}} = $", cols:3, class:"text-right" }
									{ latex: false, cols:9, name:"x", description: "Abscisse du vecteur" }
								]
							}
							{
								type: "input"
								format: [
									{ text: "$y_{\\overrightarrow{AB}} = $", cols:3, class:"text-right" }
									{ latex: false, cols:9, name:"y", description: "Ordonnée du vecteur" }
								]
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

		getExamBriques: (inputs_list,options, fixedSettings) ->
			complexe = fixedSettings.c
			that = @
			fct_item = (inputs, index) ->
				[A, B, gAB] = that.init(inputs,options)
				if complexe
					return "$z_A=#{A.affixe().tex()}$ &nbsp; et &nbsp; $z_B=#{B.affixe().tex()}$"
				else
					return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

			return {
				children: [
					{
						type: "text",
						children: if complexe
							[
								"Dans le plan complexe, on donne les affixes de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$."
								"Donnez l'affixe du vecteur &nbsp; $\\overrightarrow{AB}$."
							]
						else
							[
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

		getTex: (inputs_list, options, fixedSettings) ->
			complexe = fixedSettings.c
			that = @
			fct_item = (inputs, index) ->
				[A, B, gAB] = that.init(inputs,options)
				if complexe
					return "$z_A=#{A.affixe().tex()}$ et $z_B=#{B.affixe().tex()}$"
				else
					return "$#{A.texLine()}$ et $#{B.texLine()}$"

			return {
				children: if complexe
						[
							"Dans le plan complexe, on donne les affixes de deux points $A$ et $B$."
							"Donnez l'affixe du vecteur $\\overrightarrow{AB}$."
							{
								type: "enumerate",
								children: _.map(inputs_list, fct_item)
							}
						]
					else
						[
							"On donne les coordonnées de deux points $A$ et $B$."
							"Donnez les coordonnées du vecteur $\\overrightarrow{AB}$."
							{
								type: "enumerate",
								children: _.map(inputs_list, fct_item)
							}
						]
			}




	}
