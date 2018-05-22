define ["utils/math","utils/help"], (mM, help) ->
	# id:4
	# title:"Quatrième point d'un parallélogramme"
	# description:"Connaissant trois points, calculer les coordonnées d'un quatrième point pour former un parallélogramme. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
	# keyWords: ["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			C = mM.alea.vector({ name:"C", def:inputs, forbidden:[{aligned:[A,B]}] }).save(inputs)
			[
				A
				B
				C
				A.toClone("D").minus(B).plus(C)
				B.toClone("E").minus(A).plus(C)
			]

		getBriques: (inputs, options, fixedSettings) ->
			[A, B, C, good, goodABDC] = @init(inputs)
			complexe = fixedSettings.complexe
			if complexe
				# Exercice en affixes complexes
				[
					{
						bareme:100
						items:[
							{
								type:"text"
								ps:[
									"Dans le plan complexe, on donne trois points $A$, $B$ et $C$ d'affixes respectives $z_A=#{A.affixe().tex()}$, $z_B=#{B.affixe().tex()}$ et $z_C=#{C.affixe().tex()}$."
									"Il faut déterminer l'affixe du point $D$ pour que $ABCD$ soit un parallélogramme."
								]
							}
							{
								type:"input"
								tag:"$z_D$"
								name:"z"
								description:"Affixe de D"
							}
							{
								type:"validation"
								clavier:["aide"]
							}
							{
								type:"aide"
								list:help.geometrie.analytique.plg
							}
						]
						validations: {
							z:"number"
						}
						verifications:[
							{
								name: "z"
								tag:"$z_D$"
								good:good.affixe()
							}
							(data)->
								z = data.z.processed.object
								if mM.equals(z, goodABDC.affixe())
									{
										add: {
											type: "ul"
											list: [
												{
													type:"warning"
													text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
												}
											]
										}
									}
								else
									null
						]
					}
				]
			else
				# Exercice en coordonnées cartésiennes
				[
					{
						bareme:100
						custom_verification_message: (answers_data) ->
							x = answers_data.x.processedAnswer.object
							y = answers_data.y.processedAnswer.object
							if mM.equals(x, goodABDC.x) and mM.equals(y, goodABDC.y)
								return {
									add:[
										{
											type: "ul"
											rank: 6
											list: [
												{
													type:"warning"
													text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
												}
											]
										}
									]
								}
							null
						items:[
							{
								type:"text"
								ps:[
									"On se place dans un repère $(O;I,J)$"
									"On donne trois points $#{A.texLine()}$, $#{B.texLine()}$ et $#{C.texLine()}$."
									"Il faut déterminer les coordonnées du point $D$ pour que $ABCD$ soit un parallélogramme."
								]
							}
							{
								type:"input"
								format:[
									{ text:"D (", cols:3, class:"text-right h4"}
									{ name:"x", cols:3, latex:true }
									{ text:";", cols:1, class:"text-center h4"}
									{ name:"y", cols:3, latex:true }
									{ text:")", cols:1, class:"h4"}
								]
							}
							{
								type:"validation"
								clavier:["aide"]
							}
							{
								type:"aide"
								list:help.geometrie.analytique.plg
							}
						]
						validations: {
							x:"number"
							y:"number"
						}
						verifications: [
							{
								name: "x"
								tag:"$x_D$"
								good:good.x
							}
							{
								name: "y"
								tag:"$y_D$"
								good:good.y
							}
							(data)->
								x = data.x.processed.object
								y = data.y.processed.object
								if mM.equals(x, goodABDC.x) and mM.equals(y, goodABDC.y)
									{
										add: {
											type: "ul"
											list: [
												{
													type:"warning"
													text: "Avec vos coordonnées, &nbsp; $ABDC$ &nbsp; est un parallélogramme, pas &nbsp; $ABCD$ &nbsp; !"
												}
											]
										}
									}
								else
									null
						]
					}
				]

		getExamBriques: (inputs_list,options, fixedSettings) ->
			complexe = fixedSettings.complexe
			that = @
			if complexe
				fct_item = (inputs, index) ->
					[A, B, C, good, goodABDC] = that.init(inputs,options)
					return "$z_A=#{A.affixe().tex()}$ &nbsp; ; &nbsp; $z_B=#{B.affixe().tex()}$ &nbsp; et &nbsp; $z_C=#{C.affixe().tex()}$"

				return {
					children: [
						{
							type: "text",
							children: [
								"On donne les affixes de trois points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$."
								"Vous devez donner l'affixe du point &nbsp; $D$ &nbsp; tel que &nbsp; $ABCD$ &nbsp; soit un parallélogramme."
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
					[A, B, C, good, goodABDC] = that.init(inputs,options)
					return "$#{A.texLine()}$ &nbsp; ; &nbsp; $#{B.texLine()}$ &nbsp; et &nbsp; $#{C.texLine()}$"

				return {
					children: [
						{
							type: "text",
							children: [
								"On donne les coordonnées de trois points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$."
								"Vous devez donner les coordonnées du point &nbsp; $D$ &nbsp; tel que &nbsp; $ABCD$ &nbsp; soit un parallélogramme."
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
			complexe = fixedSettings.complexe
			that = @
			if complexe
				fct_item = (inputs, index) ->
					[A, B, C, good, goodABDC] = that.init(inputs,options)
					return "$z_A=#{A.affixe().tex()}$ ; $z_B=#{B.affixe().tex()}$ et $z_C=#{C.affixe().tex()}$"

				return {
					children: [
						"On donne les affixes de trois points $A$, $B$ et $C$."
						"Vous devez donner l'affixe de $D$ tel que $ABCD$ soit un parallélogramme."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
			else
				fct_item = (inputs, index) ->
					[A, B, C, good, goodABDC] = that.init(inputs,options)
					return "$#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$"

				return {
					children: [
						"On donne les coordonnées de trois points $A$, $B$ et $C$."
						"Vous devez donner les coordonnées de $D$ tel que $ABCD$ soit un parallélogramme."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
	}

