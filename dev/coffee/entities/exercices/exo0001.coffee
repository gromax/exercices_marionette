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
							ps:[
								"L'équation est de type &nbsp; $x=a$. Donnez &nbsp; $a$."
							]
						}
						{
							type:"input"
							format: [
								{ text:"$a =$", cols:3, class:"text-right" }
								{ name:"a", cols:5, latex:true }
							]
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list: help.droite.equation_reduite.verticale
						}
					]
					validations:{
						a:"number"
					}
					verifications:[
						{
							name: "a"
							tag:"$a$"
							good:droite.k()
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
							ps:[
								"L'équation est de type &nbsp; $y=m\\:x+p$. Donnez &nbsp; $m$ &nbsp; et &nbsp; $p$."
							]
						}
						{
							type:"input"
							format: [
								{ text:"$m =$", cols:3, class:"text-right" }
								{ name:"m", cols:5, latex:true }
							]
						}
						{
							type:"input"
							format: [
								{ text:"$p =$", cols:3, class:"text-right" }
								{ name:"p", cols:5, latex:true }
							]
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list: help.droite.equation_reduite.oblique
						}
					]
					validations:{
						m:"number"
						p:"number"
					}
					verifications:[
						{
							name: "m"
							tag:"$m$"
							good:droite.m()
						}
						(data)->
							if not(droite.m().isOne()) and not(droite.m().isOne(-1)) and mM.float(mM.exec([data["m"].processed.object, droite.m(), "*"])) is 1
								{
									add:{
										type:"ul"
										list: [{ type:"warning", text:"Vous avez calculé &nbsp; $\\frac{x_B-x_A}{y_B-y_A}$ &nbsp; au lieu de &nbsp; $\\frac{y_B-y_A}{x_B-x_A}$."}]
									}
								}
							else
								null
						{
							name: "p"
							tag:"$p$"
							good:droite.p()
						}
					]
				}

			[
				{
					bareme:20
					title:"Forme de l'équation réduite"
					items:[
						{
							type:"text"
							ps:[
								"On se place dans un repère orthogonal &nbsp; $(O;I,J)$"
								"On donne deux points $#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$."
								"Il faut déterminer l'équation réduite de la droite &nbsp; $(AB)$."
								"Quelle est la forme de l'équation réduite ?"
							]
						}
						{
							type:"radio"
							tag:"Équation"
							name:"v"
							radio:[
								"$x=a$"
								"$y=mx+p$"
							]
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list: help.droite.equation_reduite.type
						}
					]
					validations: {
						v:"radio:2"
					}
					verifications: [{
						radio:[ "$x=a$", "$y=mx+p$" ]
						name:"v"
						tag:"Équation"
						good: if verticale then 0 else 1
					}]
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
