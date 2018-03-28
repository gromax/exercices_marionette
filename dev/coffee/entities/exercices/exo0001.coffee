define ["utils/math","utils/help"], (mM, help) ->
	#id:1
	#title:"Équation de droite"
	#description:"Déterminer l'équation d'une droite passant par deux points."
	#keyWords:["Géométrie", "Droite", "Équation", "Seconde"]

	return {
		getBriques: (inputs, options) ->
			[A, B, droite] = @init(inputs)
			verticale = droite.verticale()
			if verticale
				lastStage = {
					title:"Équation"
					bareme:80
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"L'équation est de type &nbsp; $x=a$. Donnez &nbsp; $a$."
							]
						}
						{
							type:"input"
							rank:2
							tag:"$a$"
							name:"a"
							description:"Valeur de a"
							good:droite.k()
							waited:"number"
						}
						{
							type:"validation"
							rank:3
							clavier:["aide"]
						}
						{
							type:"aide"
							rank:4
							list: help.droite.equation_reduite.verticale
						}
					]
				}
			else
				lastStage = {
					title:"Équation"
					bareme:80
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"L'équation est de type &nbsp; $y=m\\:x+p$. Donnez &nbsp; $m$ &nbsp; et &nbsp; $p$."
							]
						}
						{
							type:"input"
							rank: 2
							tag:"$m$"
							name:"m"
							description:"Valeur de m"
							good:droite.m()
							waited:"number"
							custom_verification_message: (answer_data)->
								if not(droite.m().isOne()) and mM.float(mM.exec([answer_data["m"].processedAnswer.object, droite.m(), "*"])) is 1
									return {
										type:"warning"
										text:"Vous avez calculé &nbsp; $\\frac{x_B-x_A}{y_B-y_A}$ &nbsp; au lieu de &nbsp; $\\frac{y_B-y_A}{x_B-x_A}$."
									}
								else return null

						}
						{
							type:"input"
							rank:3
							tag:"$p$"
							name:"p"
							description:"Valeur de p"
							good:droite.p()
							waited:"number"
						}
						{
							type:"validation"
							rank: 4
							clavier:["aide"]
						}
						{
							type:"aide"
							rank: 5
							list: help.droite.equation_reduite.oblique
						}
					]
				}

			[
				{
					items:[{
						type:"text"
						rank: 1
						ps:[
							"On se place dans un repère orthogonal &nbsp; $(O;I,J)$"
							"On donne deux points $#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$."
							"Il faut déterminer l'équation réduite de la droite &nbsp; $(AB)$."
						]
					}]
				}
				{
					bareme:20
					title:"Forme de l'équation réduite"
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"Quelle est la forme de l'équation réduite ?"
							]
						}
						{
							type:"radio"
							rank: 2
							tag:"Équation"
							name:"v"
							radio:[
								"$x=a$"
								"$y=mx+p$"
							]
							good: if verticale then 0 else 1
						}
						{
							type:"validation"
							rank: 3
							clavier:["aide"]
						}
						{
							type:"aide"
							rank: 4
							list: help.droite.equation_reduite.type
						}
					]
				}
				lastStage
			]
		init: (inputs, options) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]


		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs,options)
				return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$."
							"Vous devez donner l'équation réduite de la droite &nbsp; $(AB)$."
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
				[A, B, droite] = that.init(inputs,options)
				return "$#{A.texLine()}$ et $#{B.texLine()}$"

			return {
				children: [
					"On donne les coordonnées de deux points $A$ et $B$."
					"Vous devez donner l'équation réduite de la droite $(AB)$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
