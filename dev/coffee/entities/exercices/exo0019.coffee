define ["utils/math","utils/help"], (mM, help) ->
#	id:19
#	title:"Inéquation du second degré"
#	description:"Il faut résoudre une inéquation du second degré."
#	keyWords:["Analyse","Trinome","Équation","Racines","Première"]

# debug : partie portant sur le tableau de signe à améliorer

	return {
		init: (inputs) ->
			if (typeof inputs.a isnt "undefined") and (typeof inputs.b isnt "undefined") and (typeof inputs.c isnt "undefined") and (typeof inputs.ineq isnt "undefined")
				a = Number inputs.a
				b = Number inputs.b
				c = Number inputs.c
				ineq = Number inputs.ineq
			else
				ineq = inputs.ineq = mM.alea.real [0,1,2,3] # <, >, <=, >=
				# 1 fois sur 4, on aura un delta<0
				a = mM.alea.real { min:1, max:3, sign:true }
				if mM.alea.dice(1,4)
					im = mM.alea.real { min:1, max:10 }
					re = mM.alea.real { min:-10, max:10 }
					b = -2*re*a
					c = (re*re+im*im)*a
				else
					x1 = mM.alea.real { min:-10, max:10 }
					x2 = mM.alea.real { min:-10, max:10 }
					b = (-x1-x2)*a
					c = x1*x2*a
				inputs.a = a
				inputs.b = b
				inputs.c = c
			poly = mM.polynome.make { coeffs:[c, b, a] }
			a_is_plus = (a>0) # convexe
			sol_is_ext = (a_is_plus is ((ineq is 1) or (ineq is 3))) # ensemble à l'extérieur des racines
			sol_xor = ((ineq >= 2) isnt sol_is_ext) # On construit l'ensemble solution en prenant d'abord l'espace à l'intérieur des racines. Si sol_is_ext, il faudra inverser l'ensemble. Dans l'ensemble initial, on prend donc les racines si : * ext et strict (alors les racines ne seront pas dans la sol) * int et large (alors les racines y seront), c'est donc un xor qu'il faut faire
			racines = mM.polynome.solve.exact poly, { y:0 }
			console.log racines
			# on prépare les tableaux de signes
			switch racines.length
				when 1
					if sol_xor then ensemble_solution = mM.ensemble.singleton racines[0]
					else ensemble_solution = mM.ensemble.vide()
					tabX = ["$-\\infty$", "$x_0$","$+\\infty$"]
					tabS1 = ",-,z,-,"
					tabS2 = ",+,z,+,"
				when 2
					ensemble_solution = mM.ensemble.intervalle sol_xor,racines[0], racines[1], sol_xor
					tabX = ["$-\\infty$", "$x_1$", "$x_2$", "$+\\infty$"]
					tabS1 = ",-,z,+,z,-,"
					tabS2 = ",+,z,-,z,+,"
				else
					ensemble_solution = mM.ensemble.vide()
					tabX = ["$-\\infty$", "$+\\infty$"]
					tabS1 = ",-,"
					tabS2 = ",+,"
			if sol_is_ext then ensemble_solution.inverse()
			if a_is_plus then goodTab = 1
			else goodTab=0
			# On définit un tableau donnant la suite des étapes
			ineqSign = [ "<", ">", "\\leqslant", "\\geqslant" ]
			polyTex = poly.tex()
			[
				"#{polyTex} #{ineqSign[ineq]} 0"
				polyTex
				poly
				racines
				ensemble_solution
			]

		getBriques: (inputs, options) ->
			[ineqTex, polyTex, poly, racines, ensemble_solution] = @init(inputs)

			[
				{
					bareme:20
					title: "Discriminant"
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"On considère l'inéquation &nbsp; $#{ineqTex}$."
								"Commencez par donner le discriminant de &nbsp; $#{polyTex}$."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name:"delta"
							tag:"$\\Delta$"
							description: "Discriminant"
							good: poly.discriminant()
						}
						{
							type: "validation"
							rank: 7
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 8
							list: help.trinome.discriminant
						}
					]
				}
				{
					bareme:40
					title: "Racines"
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"Donnez les racines de &nbsp; $#{polyTex}$."
								"Séparez les par ; s'il y en a plusieurs."
								"Répondez &nbsp; $\\varnothing$ &nbsp; s'il n'y a pas de racines."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "liste:number"
							name:"racines"
							tag:"Racines"
							description: "Racines"
							good: racines
						}
						{
							type: "validation"
							rank: 7
							clavier: ["empty", "aide"]
						}
						{
							type: "aide"
							rank: 8
							list: help.trinome.racines
						}
					]
				}
				{
					bareme:40
					title: "Ensemble solution"
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"Donnez l'ensemble solution de &nbsp; $#{ineqTex}$."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "ensemble"
							name:"ensemble"
							tag:"$\\mathcal{S}$"
							description: "Ensemble solution"
							good: ensemble_solution
						}
						{
							type: "validation"
							rank: 7
							clavier: ["union", "intersection", "reels", "empty", "infini"]
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ineqTex, polyTex, poly, racines, ensemble_solution] = that.init(inputs,options)
				return {
					type: "enumerate"
					enumi: "1"
					children: [
						"Donnez les racines de &nbsp; $polyTex$"
						"Déduisez-en l'ensemble solution de &nbsp; $ineqTex$."
					]
				}

			return {
				children: [
					{
						type: "subtitles"
						enumi: "A"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ineqTex, polyTex, poly, racines, ensemble_solution] = that.init(inputs,options)
				return {
					type: "enumerate"
					enumi: "1"
					children: [
						"Donnez les racines de $polyTex$"
						"Déduisez-en l'ensemble solution de $ineqTex$."
					]
				}

			return {
				children: [
					{
						type: "enumerate"
						enumi: "A"
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
