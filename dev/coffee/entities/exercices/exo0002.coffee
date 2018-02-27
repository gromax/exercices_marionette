define ["utils/math","utils/help"], (mM, help) ->
	# id:2
	# title: "Milieu d'un segment"
	# description: "Calculer les coordonnées du milieu d'un segment."

	return {
		getBriques: (inputs, options) ->
			[A, B, gM] = @init(inputs)

			[
				{
					bareme:100
					title:"Coordonnées de $M$"
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"On se place dans un repère $(O;I,J)$"
								"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
								"Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."
							]
						}
						{
							type:"input"
							rank: 2
							tag:"$x_M$"
							name:"xM"
							description:"Abscisse de M"
							good:gM.x
							waited:"number"
						}
						{
							type:"input"
							rank: 3
							tag:"$y_M$"
							name:"yM"
							description:"Ordonnée de M"
							good:gM.y
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
							list: help.geometrie.analytique.milieu
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
				A.milieu(B,"M")
			]
	}
