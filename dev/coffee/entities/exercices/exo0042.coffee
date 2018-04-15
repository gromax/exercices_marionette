﻿define ["utils/math"], (mM) ->
	# id:42
	# title: "Termes d'une suite récurrente"
	# description: "Calculer les termes d'une suite donnée par récurence."
	# keyWords:["Analyse", "Suite", "Première"]

	return {
		init: (inputs) ->
			if inputs.a? then a = Number inputs.a
			else a = inputs.a = mM.alea.real({min:40, max:90, sign:true})/100
			if inputs.b? then b = Number inputs.b
			else b = inputs.b = mM.alea.real { min:1, max:20 }
			if inputs.u0? then u0 = Number inputs.u0
			else u0 = inputs.u0 = mM.alea.real { min:0, max:20 }
			u = mM.suite.arithmeticogeometrique { premierTerme:{ valeur:u0, rang:0 }, r:b, q:a }
			[
				u0
				u.recurence().tex()
				u.calc(1)
				u.calc(2)
				u.calc(3)
				u.calc(10)
			]

		getBriques: (inputs, options) ->
			[u0, formule, u1, u2, u3, u10] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"On considère la suite &nbsp; $(u_n)$ &nbsp; définie par &nbsp; $u_0=#{u0}$ &nbsp; et &nbsp; $u_{n+1}= #{formule}$ &nbsp; pour &nbsp; $n\\geqslant 0$."
								"On demande de calculer les termes suivants à 0,01 près :"
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$u_1$"
							name:"u1"
							description:"Terme de rang 1"
							good:u1
							arrondi: -2
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$u_2$"
							name:"u2"
							description:"Terme de rang 2"
							good:u2
							arrondi: -2
						}
						{
							type: "input"
							rank:4
							waited: "number"
							tag: "$u_3$"
							name:"u3"
							description:"Terme de rang 3"
							good:u3
							arrondi: -2
						}
						{
							type: "input"
							rank:5
							waited: "number"
							tag: "$u_{10}$"
							name:"u10"
							description:"Terme de rang 10"
							good:u10
							arrondi: -2
						}
						{
							type: "validation"
							rank: 6
							clavier: []
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[u0, formule, u1, u2, u3, u10] = that.init(inputs,options)
				return "$u_0 = #{ u0 }$ &nbsp; et &nbsp; $u_{n+1}= #{formule}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On considère la suite &nbsp; $(u_n)$ &nbsp; définie par récurence."
							"On demande de calculer les termes &nbsp;$u_1$, &nbsp; $u_2$, &nbsp; $u_3$ &nbsp; et &nbsp; $u_{10}$ &nbsp; à 0,01 près."
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
				[u0, formule, u1, u2, u3, u10] = that.init(inputs,options)
				return "$u_0 = #{ u0 }$ et $u_{n+1}= #{formule}$"

			return {
				children: [
					"On considère la suite $(u_n)$ définie par récurence."
					"On demande de calculer les termes $u_1$, $u_2$, $u_3$ et $u_{10}$ à 0,01 près."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}