define ["utils/math","utils/help"], (mM, help) ->
	# id:46
	# title: "Calcul d'un angle avec les complexes"
	# description: "Trois points A,B et C sont donnés. Il faut trouver l'angle $\\widehat{BAC}$."
	# keyWords:["Géométrie", "Complexe", "Première"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			C = mM.alea.vector({ name:"C", def:inputs, forbidden:[A] }).save(inputs)
			[
				zA = A.affixe()
				zB = B.affixe()
				zC = C.affixe()
				zAB = mM.exec [zB, zA, "-"], {simplify:true}
				zAC = mM.exec [zC, zA, "-"], {simplify:true}
				z = mM.exec [zAB, "conjugue", zAC, "*"], {simplify:true}
				ang = z.arg(false)
			]

		getBriques: (inputs, options) ->
			[zA, zB, zC, zAB, zAC, z, ang] = @init(inputs)

			[
				{
					bareme: 30
					items: [
						{
							type:"text"
							ps:[
								"On donne &nbsp; $A$ &nbsp; d'affixe &nbsp; $z_A=#{zA.tex()}$, &nbsp; $B$ &nbsp; d'affixe &nbsp; $z_B=#{zB.tex()}$ &nbsp; et &nbsp; $C$ &nbsp; d'affixe &nbsp; $z_C=#{zC.tex()}$."
								"On notera &nbsp; $z_1$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AC}$ &nbsp; et &nbsp; $z_2$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AB}$."
							]
						}
						{
							type: "input"
							tag: "$z_1$"
							name:"z1"
							description:"Affixe de AC"
						}
						{
							type: "input"
							tag: "$z_1$"
							name:"z2"
							description:"Affixe de AB"
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type; "aide"
							list: help.complexes.affixeVecteur
						}
					]
					validations:{
						z1:"number"
						z2:"number"
					}
					verifications:[
						{
							name:"z1"
							good:zAC
							tag:"$z_1$"
						}
						{
							name:"z2"
							good:zAB
							tag:"$z_2$"
						}
					]
				}
				{
					bareme: 30
					title: "Produit &nbsp; $z_1\\cdot\\overline{z_2}$"
					items: [
						{
							type:"text"
							ps:[
								"Calculez le produit &nbsp; $z_1\\cdot\\overline{z_2}$ &nbsp; sous sa forme algébrique."
							]
						}
						{
							type: "input"
							tag: "$z$"
							name:"z"
							description:"Forme x+iy"
						}
						{
							type: "validation"
						}
					]
					validations:{
						z:"number"
					}
					verifications:[
						{
							name:"z"
							good:z
							tag:"$z$"
						}
					]
				}
				{
					bareme: 40
					title:"Angle &nbsp; $\\widehat{BAC}$"
					items: [
						{
							type:"text"
							ps:[
								"L'angle que l'on cherche est l'argument de &nbsp; $z$. Donnez une approximation à 1° près de cet angle en degrés."
							]
						}
						{
							type: "input"
							tag: "$\\widehat{BAC}$"
							name:"a"
							description:"Angle"
							good:ang
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type; "aide"
							list: help.complexes.argument
						}
					]
					validations:{
						a:"number"
					}
					verifications:[
						{
							name:"a"
							good:ang
							tag:"$\\widehat{BAC}$"
							parameters:{
								arrondi:0
							}
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[zA, zB, zC, zAB, zAC, z, ang] = that.init(inputs,options)
				return "$z_A=#{zA.tex()}$, &nbsp; $z_B = #{zB.tex()}$ &nbsp; et &nbsp; $z_C = #{zC.tex()}$."

			return {
				children: [
					{
						type: "text",
						children: [
							"On donne les points &nbsp; $A$, &nbsp; $B$ &nbsp; et &nbsp; $C$ &nbsp; d'affixes respectives &nbsp; $z_A$, &nbsp; $z_B$ &nbsp; et &nbsp; $z_C$."
							"À chaque fois :"
						]
					}
					{
						type: "enumerate",
						refresh:false
						enumi:"a",
						children: [
							"Donnez &nbsp;$z_1$ &nbsp; et &nbsp; $z_2$, affixes respectives de &nbsp; $\\overrightarrow{AC}$ &nbsp; $\\overrightarrow{AB}$."
							"Calculez &nbsp; $z_1\\cdot\\overline{z_2}$"
							"Déduisez l'angle &nbsp; $\\widehat{BAC}$."
						]
					}
					{
						type: "enumerate"
						enumi: "1"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			if inputs_list.length is 1
				[zA, zB, zC, zAB, zAC, z, ang] = @init(inputs_list[0],options)
				return {
					children: [
						"On donne les points $A$, $B$ et $C$ d'affixes respectives $z_A$, $z_B$ et $z_C$."
						"$z_A=#{zA.tex()}$, $z_B = #{zB.tex()}$ et $z_C = #{zC.tex()}$."
						{
							type: "enumerate",
							enumi:"a)",
							children: [
								"Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AC}$ $\\overrightarrow{AB}$."
								"Calculez $z_1\\cdot\\overline{z_2}$"
								"Déduisez l'angle $\\widehat{BAC}$."
							]
						}
					]
				}

			else
				that = @

				fct_item = (inputs, index) ->
					[zA, zB, zC, zAB, zAC, z, ang] = that.init(inputs,options)
					return "$z_A=#{zA.tex()}$, $z_B = #{zB.tex()}$ et $z_C = #{zC.tex()}$."

				return {
					children: [
						"On donne les points $A$, $B$ et $C$ d'affixes respectives $z_A$, $z_B$ et $z_C$."
						"À chaque fois :"
						{
							type: "enumerate",
							enumi:"a)",
							children: [
								"Donnez $z_1$ et $z_2$, affixes respectives de $\\overrightarrow{AC}$ $\\overrightarrow{AB}$."
								"Calculez $z_1\\cdot\\overline{z_2}$"
								"Déduisez l'angle $\\widehat{BAC}$."
							]
						}
						{
							type: "enumerate"
							enumi: "1)"
							children: _.map(inputs_list, fct_item)
						}
					]
				}







	}
