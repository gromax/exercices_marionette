﻿define ["utils/math","utils/help"], (mM, help) ->
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
							rank: 1
							ps:[
								"On considère deux nombres complexes &nbsp; $z_1 = #{zA.tex()}$ &nbsp; et &nbsp; $z_2 = #{zB.tex()}$."
								"Donnez les résultats des calculs suivants :"
							]
						}
						{
							type:"input"
							rank: 2
							tag:"$z_1 + z_2$"
							name:"s"
							description:"Somme"
							good:gSomme
							waited:"number"
						}
						{
							type:"input"
							rank: 3
							tag:"$z_1\\times z_2$"
							name:"p"
							description:"Produit"
							good:gProduit
							waited:"number"
						}
						{
							type:"input"
							rank: 4
							tag:"$\\frac{1}{z_1}$"
							name:"i"
							description:"Inverse"
							good:gInverse
							formes:"FRACTION"
							waited:"number"
						}
						{
							type:"input"
							rank: 5
							tag:"$\\frac{z_1}{z_2}$"
							name:"q"
							description:"Quotient"
							good:gQuotient
							formes:"FRACTION"
							waited:"number"
						}
						{
							type: "validation"
							rank: 6
							clavier:["aide"]
						}

						{
							type:"aide"
							rank: 7
							list: help.complexes.basics
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
