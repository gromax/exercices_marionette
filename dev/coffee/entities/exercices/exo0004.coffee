define ["utils/math","utils/help"], (mM, help) ->
	# id:4
	# title:"Quatrième point d'un parallélogramme"
	# description:"Connaissant trois points, calculer les coordonnées d'un quatrième point pour former un parallélogramme. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
	# keyWords: ["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]

	return {
		getBriques: (inputs, options) ->
			[A, B, C, good, goodABDC] = @init(inputs)
			optA = options.a?.value ? 0
			if Number(optA) is 1
				# Exercice en affixes complexes
				[
					{
						bareme:100
						title:"Affixe de $D$"
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
								rank: 1
								ps:[
									"Dans le plan complexe, on donne trois points $A$, $B$ et $C$ d'affixes respectives $z_A=#{A.affixe().tex()}$, $z_B=#{B.affixe().tex()}$ et $z_C=#{C.affixe().tex()}$."
									"Il faut déterminer l'affixe du point $D$ pour que $ABCD$ soit un parallélogramme."
								]
							}
							{
								type:"input"
								rank: 2
								tag:"$z_D$"
								name:"z"
								description:"Affixe de D"
								good:good.affixe()
								waited:"number"
							}
							{
								type:"validation"
								rank: 3
								clavier:["aide"]
							}
							{
								type:"aide"
								rank: 4
								list:help.geometrie.analytique.plg
							}
						]
					}
				]
			else
				# Exercice en coordonnées cartésiennes
				[
					{
						bareme:100
						title:"Coordonnées de $D$"
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
								rank: 1
								ps:[
									"On se place dans un repère $(O;I,J)$"
									"On donne trois points $#{A.texLine()}$, $#{B.texLine()}$ et $#{C.texLine()}$."
									"Il faut déterminer les coordonnées du point $D$ pour que $ABCD$ soit un parallélogramme."
								]
							}
							{
								type:"input"
								rank: 2
								tag:"$x_D$",
								name: "x",
								description:"Abscisse de D"
								good:good.x
								waited:"number"
							}
							{
								type:"input"
								rank: 3
								tag:"$y_D$",
								name:"y"
								description:"Ordonnée de D",
								good:good.y
							}
							{
								type:"validation"
								rank: 4
								clavier:["aide"]
							}
							{
								type:"aide"
								rank: 5
								list:help.geometrie.analytique.plg
							}
						]
					}
				]

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

		getExamBriques: (inputs_list,options) ->
			optA = options.a?.value ? 0
			that = @
			if Number(optA) is 1
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

		getTex: (inputs_list, options) ->
			optA = options.a?.value ? 0
			that = @
			if Number(optA) is 1
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

