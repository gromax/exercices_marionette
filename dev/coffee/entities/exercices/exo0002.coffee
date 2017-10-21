define ["utils/math","utils/help"], (mM, help) ->
	# id:2
	# title: "Milieu d'un segment"
	# description: "Calculer les coordonnées du milieu d'un segment."

	Controller =
		init: (inputs, options) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			gM = A.milieu(B,"M")

			return {
				inputs: inputs
				options: false
				briques: [
					{
						type:"base"
						#title:"Énoncé" Pas besoin d'écrire un titre sur l'énoncé
						zones:[
							{
								type:"plain"
								ps:[
									"On se place dans un repère $(O;I,J)$"
									"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
									"Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."
								]
							}
						]
					}
					{
						type:"liste"
						bareme:100
						title:"Coordonnées de $M$"
						liste:[
							{
								tag:"$x_M$"
								name:"xM"
								description:"Abscisse de M"
								good:gM.x
								waited:"number"
							}
							{
								tag:"$y_M$"
								name:"yM"
								description:"Ordonnée de M"
								good:gM.y
								waited:"number"
							}
						]
						clavier:["aide"]
						aide: help.geometrie.analytique.milieu
					}
				]
			}

	return Controller
