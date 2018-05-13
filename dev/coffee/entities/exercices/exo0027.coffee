define ["utils/math","utils/help"], (mM, help) ->
#	id:27
#	title: "Calculs avec les complexes"
#	description: "Faire les calculs de base avec les complexes."
#	keyWords:["Géométrie", "Complexe", "Première"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs }).save(inputs)
			zA = A.affixe()
			zB = B.affixe()
			gSomme = mM.exec [zA, zB, "+"], {simplify:true}
			gProduit = mM.exec [zA, zB, "*"], {simplify:true}
			gInverse = mM.exec [zA, "^-1"], {simplify:true}
			gQuotient = mM.exec [zA, zB, "/"], {simplify:true}

			[
				zA
				zB
				gSomme
				gProduit
				gInverse
				gQuotient
			]
		getBriques: (inputs, options) ->
			[ zA, zB, gSomme, gProduit, gInverse, gQuotient] = @init(inputs)

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							ps:[
								"On considère deux nombres complexes &nbsp; $z_1 = #{zA.tex()}$ &nbsp; et &nbsp; $z_2 = #{zB.tex()}$."
								"Donnez sous forme algébrique les résultats des calculs suivants :"
							]
						}
						{
							type:"input"
							format: [
								{ text: "$z_1 + z_2 =$", cols:4, class:"text-right"}
								{ latex: true, cols:8, name:"s"}
							]
						}
						{
							type:"input"
							format: [
								{ text: "$z_1\\cdot z_2 =$", cols:4, class:"text-right"}
								{ latex: true, cols:8, name:"p"}
							]
						}
						{
							type:"input"
							format: [
								{ text: "$\\frac{1}{z_1} =$", cols:4, class:"text-right"}
								{ latex: true, cols:8, name:"i"}
							]
						}
						{
							type:"input"
							format: [
								{ text: "$\\frac{z_1}{z_2} =$", cols:4, class:"text-right"}
								{ latex: true, cols:8, name:"q"}
							]
						}
						{
							type: "validation"
							clavier:["aide"]
						}

						{
							type:"aide"
							list: help.complexes.basics
						}
					]
					validations:{
						s: "number"
						p: "number"
						i: "number"
						q: "number"
					}
					verifications:[
						{
							name:"s"
							tag:"$z_1 + z_2$"
							good: gSomme
						}
						{
							name:"p"
							tag:"$z_1\\times z_2$"
							good: gProduit
						}
						{
							name:"i"
							tag:"$\\frac{1}{z_1}$"
							good: gInverse
							parameters:{
								formes:"FRACTION"
							}
						}
						{
							name:"q"
							tag:"$\\frac{z_1}{z_2}$"
							good: gQuotient
							parameters:{
								formes:"FRACTION"
							}
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ zA, zB, gSomme, gProduit, gInverse, gQuotient] = that.init(inputs,options)
				return "$z_1=#{zA.tex()}$ &nbsp; et &nbsp; $z_2=#{ zB.tex() }$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans chaque cas, calculez &nbsp; $z_1 + z_2$, &nbsp; $z_1\\cdot z_2$, &nbsp; $\\frac{1}{z_1}$ &nbsp; et &nbsp; $\\frac{z_1}{z_2}$."
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
				[ zA, zB, gSomme, gProduit, gInverse, gQuotient] = that.init(inputs,options)
				return "$z_1=#{zA.tex()}$ et $z_2=#{ zB.tex() }$"

			return {
				children: [
					"Dans chaque cas, calculez $z_1 + z_2$, $z_1\\cdot z_2$, $\\frac{1}{z_1}$ et $\\frac{z_1}{z_2}$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
