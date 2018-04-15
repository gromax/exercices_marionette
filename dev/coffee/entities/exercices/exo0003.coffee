﻿define ["utils/math","utils/help"], (mM, help) ->
	# id:3
	# title:"Symétrique d'un point"
	# description:"Calculer les coordonnées du symétrique d'un point par rapport à un autre point."
	# keyWords : ["Géométrie", "Repère", "Seconde"]

	return {
		getBriques: (inputs, options) ->
			[A, B, gAp] = @init(inputs)

			[
				{
					bareme:100
					title:"Coordonnées de $A'$"
					items:[
						{
							type:"text"
							rank: 1
							ps: [
								"On se place dans un repère $(O;I,J)$."
								"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
								"Il faut déterminer les coordonnées de $A'$, symétrique de $A$ par rapport à $B$."
							]
						}
						{
							type:"input"
							rank: 2
							tag: "$x_{A'}$"
							name: "xAp"
							description: "Abscisse de A'"
							good: gAp.x
							waited: "number"
						}
						{
							type:"input"
							rank: 3
							tag: "$y_{A'}$"
							name: "yAp"
							description: "Ordonnée de A'"
							good: gAp.y
							waited: "number"
						}
						{
							type:"validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type:"aide"
							rank: 5
							list:help.geometrie.analytique.symetrique
						}
					]
				}
			]

		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			[
				A
				B
				A.symetrique(B, "A'").simplify()
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, gAp] = that.init(inputs,options)
				return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$."
							"Vous devez donner les coordonnées du symétrique de &nbsp; $A$ &nbsp; par rapport à &nbsp; $B$."
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
				[A, B, gAp] = that.init(inputs,options)
				return "$#{A.texLine()}$ et $#{B.texLine()}$"

			return {
				children: [
					"On donne les coordonnées de deux points $A$ et $B$."
					"Vous devez donner les coordonnées du symétrique de $A$ par rapport à $B$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}


	}