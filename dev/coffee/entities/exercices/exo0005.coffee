define ["utils/math","utils/help"], (mM, help) ->
	# id:5
	# title:"Distance entre deux points"
	# description:"Dans un repère orthonormé, calculer la distance entre deux points. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
	# keyWords:["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			[
				A
				B
				A.toClone().minus(B).norme()
			]

		getBriques: (inputs,options, fixedSettings) ->
			[A, B, gAB] = @init(inputs)
			if fixedSettings.complexe
				zA = A.affixe().tex()
				zB = B.affixe().tex()
				enonce = [
					"Dans le plan complexe, on donne deux points $A$, d'affixe $z_A=#{zA}$ et $B$, d'affixe $z_B=#{zB}$."
					"Il faut déterminer la valeur exacte de la distance $AB$."
				]
			else
				enonce = [
					"On se place dans un repère orthonormé $(O;I,J)$"
					"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
					"Il faut déterminer la valeur exacte de la distance $AB$."
				]

			[
				{
					bareme:100
					title:"Distance $AB$"
					items:[
						{
							type: "text"
							ps: enonce
						}
						{
							type: "input"
							format: [
								{ text: "$AB =$", cols:3, class:"text-right" }
								{ latex: true, cols:5, name:"AB"}
							]
						}
						{
							type: "validation"
							clavier: ["aide", "sqrt", "pow"]
						}
						{
							type: "aide"
							list: help.geometrie.analytique.distance
						}
					]
					validations:{
						"AB": "number"
					}
					verifications:[
						{
							name: "AB"
							tag:"$AB$"
							good: gAB
							parameters: { formes:"RACINE" }
						}
					]
				}
			]

		getExamBriques: (inputs_list,options, fixedSettings) ->
			that = @

			if fixedSettings.complexe
				fct_item = (inputs, index) ->
					[A, B, gAB] = that.init(inputs,options)
					return "$z_A = #{A.affixe().tex()}$ &nbsp; et &nbsp; $z_B = #{B.affixe().tex()}$"
				return {
					children: [
						{
							type: "text",
							children: [
								"On donne les affixes de deux points &nbsp; $A$, &nbsp et &nbsp; $B$."
								"Vous devez donner la distance &nbsp; $AB$."
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

			else
				fct_item = (inputs, index) ->
					[A, B, gAB] = that.init(inputs,options)
					return "$#{A.texLine()}$ &nbsp; et &nbsp; $#{B.texLine()}$"

				return {
					children: [
						{
							type: "text",
							children: [
								"On donne les coordonnées de deux points &nbsp; $A$, &nbsp et &nbsp; $B$."
								"Vous devez donner la distance &nbsp; $AB$."
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
			that = @
			if fixedSettings.complexe
				fct_item = (inputs, index) ->
					[A, B, gAB] = that.init(inputs,options)
					return "$z_A = #{A.affixe().tex()}$ et $z_B = #{B.affixe().tex()}$"

				return {
					children: [
						"On donne les affixes de deux points $A$ et $B$."
						"Vous devez donner la distance $AB$."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}

			else
				fct_item = (inputs, index) ->
					[A, B, gAB] = that.init(inputs,options)
					return "$#{A.texLine()}$ et $#{B.texLine()}$"

				return {
					children: [
						"On donne les coordonnées de deux points $A$ et $B$."
						"Vous devez donner la distance $AB$."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
	}
