define ["utils/math","utils/help"], (mM, help) ->
	# id:41
	# title: "Termes d'une suite explicite"
	# description: "Calculer les termes d'une suite donnée explicitement."
	# keyWords:["Analyse", "Suite", "Première"]

	return {
		init: (inputs) ->
			if inputs.p? then poly = mM.toNumber(inputs.p)
			else
				poly = mM.alea.poly { variable:"n", degre:2, coeffDom:{ min:1, max:3, sign:true}, values: { min:1, max:20, sign:true} }
				inputs.p = String poly
			[
				"$u_n = #{poly.tex()}$"
				mM.float(poly, [ {n:0}, {n:1}, {n:2}, {n:10} ])
			]

		getBriques: (inputs, options) ->
			[expression, [u0, u1, u2, u10]] = @init(inputs)
			[
				{
					title: "Termes de la suite"
					bareme: 100
					items: [
						{
							type:"text"
							ps: [
								"On considère la suite $(u_n)$ définie par &nbsp; #{expression} &nbsp; pour $n\\geqslant 0$."
								"On demande de calculer les termes suivants :"
							]
						}
						{
							type: "input"
							tag: "$u_0$"
							name:"u0"
							description:"Terme de rang 0"
						}
						{
							type: "input"
							tag: "$u_1$"
							name: "u1"
							description: "Terme de rang 1"
						}
						{
							type: "input"
							tag: "$u_2$"
							name: "u2"
							description: "Terme de rang 2"
						}
						{
							type: "input"
							tag: "$u_{10}$"
							name: "u10"
							description: "Terme de rang 10"
						}
						{
							type: "validation"
						}
					]
					validations:{
						u0:"number"
						u1:"number"
						u2:"number"
						u10:"number"
					}
					verifications:[
						{
							name: "u0"
							good: u0
							tag: "$u_0$"
						}
						{
							name: "u1"
							good: u1
							tag: "$u_1$"
						}
						{
							name: "u2"
							good: u2
							tag: "$u_2$"
						}
						{
							name: "u10"
							good: u10
							tag: "$u_{10}$"
						}
					]
				}
			]
		getExamBriques: (inputs,options) ->
			that = @
			fct_item = (inputs_item, index) ->
				[expression, [u0, u1, u2, u10]] = that.init(inputs_item,options)
				return expression

			list = _.map(inputs, fct_item)

			if inputs.length is 1
				return {
					unique: true,
					children: [
						{
							type: "text",
							children: [
								"Calculez &nbsp; $u_0$, &nbsp; $u_1$, &nbsp; $u_2$ &nbsp; et &nbsp; $u_{10}$ &nbsp; avec :"
								list[0]
							]
						}
					]
				}
			else
				return {
					children: [
						{
							type: "text",
							children: [
								"Dans les cas suivants, calculez &nbsp; $u_0$, &nbsp; $u_1$, &nbsp; $u_2$ &nbsp; et &nbsp; $u_{10}$."
							]
						}
						{
							type: "enumerate",
							enumi: "1",
							refresh: true,
							children: list
						}
					]
				}

		getTex: (inputs_list, options) ->
			that = @
			fct_item = (inputs, index) ->
				[expression, [u0, u1, u2, u10]] = that.init(inputs_item,options)
				return expression

			return {
				children: [
					"Dans les cas suivants, calculez $u_0$, $u_1$, $u_2$ et $u_{10}$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
