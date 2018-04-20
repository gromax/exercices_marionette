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
					items:[
						{
							type:"text"
							ps:[
								"On se place dans un repère $(O;I,J)$"
								"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
								"Il faut déterminer les coordonnées de $M$, milieu de $[AB]$."
							]
						}
						{
							type:"input"
							format:[
								{ text:"M (", cols:3, class:"text-right h4"}
								{ name:"xM", cols:2, latex:true }
								{ text:";", cols:1, class:"text-center h4"}
								{ name:"yM", cols:2, latex:true }
								{ text:")", cols:1, class:"h4"}
							]
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list: help.geometrie.analytique.milieu
						}
					]
					validations:{
						xM: "number"
						yM: "number"
					}
					verifications:[
						{
							name: "xM"
							tag:"$x_M$"
							good:gM.x
						}
						{
							name: "yM"
							tag:"$y_M$"
							good:gM.y
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

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, gM] = that.init(inputs,options)
				return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On donne les coordonnées de deux points &nbsp; $A$ &nbsp; et &nbsp; $B$."
							"Vous devez donner les coordonnées du milieu de &nbsp; $[AB]$."
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
				[A, B, gM] = that.init(inputs,options)
				return "$#{A.texLine()}$ et $#{B.texLine()}$"

			return {
				children: [
					"On donne les coordonnées de deux points $A$ et $B$."
					"Vous devez donner les coordonnées du milieu de $[AB]$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
