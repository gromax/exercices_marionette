define ["utils/math", "utils/help"], (mM, help) ->
	# id:38
	# title: "Choix de la meilleure forme"
	# description: "Une fonction du second degré est donnée sous différentes formes. Vous devez utiliser la plus appropriée meilleure pour répondre à différentes questions."
	# keyWords:["Analyse", "Second degré", "Seconde"]

	return {
		init: (inputs) ->
			# On définit le polynome par ses racines et a
			if inputs.a? then a = mM.toNumber inputs.a
			else inputs.a = String(a = mM.alea.number { min:1, max:5, sign:true })
			if inputs.x1? then x1 = Number inputs.x1
			else inputs.x1 = String(x1= mM.alea.real { min:-10, max:10 })
			if inputs.x2? then x2 = Number inputs.x2
			else inputs.x2 = String(x2 = mM.alea.real { min:-10, max:10, no:[x1]})
			if inputs.xA? then xA = Number inputs.xA # Pour résoudre f(x)=f(xA)
			else inputs.xA = String( xA = mM.alea.real { min:-20, max:20, no:[x1, x2]} )
			polyFacto = mM.exec [a, "x", x1, "-", "x", x2, "-", "*", "*"], { simplify:true }
			xS = mM.exec [x1, x2, "+", 2, "/"], {simplify:true}
			yS = mM.exec [a, xS, x1, "-", xS, x2, "-", "*", "*"], { simplify:true }
			polyCanonique = mM.exec [ a, "x", xS, "-", 2, "^", "*", yS, "+"], { simplify:true }
			factoTex = polyFacto.tex()
			canoniqueTex = polyCanonique.tex()
			poly = mM.exec [ polyFacto ], {simplify:true, developp:true }
			normalTex = poly.tex()
			yA = mM.exec [a, xA, xS, "-", 2, "^", yS, "+"], { simplify:true }
			if xA is (x1+x2)/2 then solutionsA = [ mM.toNumber(xA) ]
			else solutionsA = [ mM.toNumber(xA), mM.toNumber(x1+x2-xA) ]

			[normalTex, canoniqueTex, factoTex, xS, yS, [x1, x2], yA, solutionsA]

		getBriques: (inputs, options) ->
			[normalTex, canoniqueTex, factoTex, xS, yS, racines, yA, solutionsA] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On propose la fonction &nbsp; $f$ &nbsp; définie par :"
								"$f(x)=#{normalTex}$."
								"La forme canonique est &nbsp; $f(x)=#{canoniqueTex}$."
								"La forme factorisée est &nbsp; $f(x)=#{factoTex}$."
								"En utilisant bien ces différentes formes, les deux premières questions ne nécessitent aucun calcul."
							]
						}
						{
							type: "text"
							rank: 2
							ps: [
								"Donnez les coordonnées de &nbsp; $S$, sommet de la courbe de &nbsp; $f$."
							]
						}
						{
							type: "input"
							rank: 3
							format:[
								{ text:"S (", cols:3, class:"text-right h4"}
								{ name:"xS", cols:2, latex:true }
								{ text:";", cols:1, class:"text-center h4"}
								{ name:"yS", cols:2, latex:true }
								{ text:")", cols:1, class:"h4"}
							]
						}
						{
							type: "text"
							rank: 5
							ps: [
								"Donnez les solutions de l'équation &nbsp; $f(x)=0$ &nbsp; séparée par ;"
							]
						}
						{
							type: "input"
							rank: 6
							format: [
								{ text: "Racines :", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"racines"}
							]
						}
						{
							type: "text"
							rank: 7
							ps: [
								"Donnez les solutions de l'équation &nbsp; $f(x)=#{yA}$ &nbsp; séparée par ;"
							]
						}
						{
							type: "input"
							rank: 8
							format: [
								{ text: "$\\mathcal{S}$ :", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"sols"}
							]
						}
						{
							type: "validation"
							rank: 9
							clavier:["pow", "sqrt"]
						}
					]
					validations:{
						xS:"number"
						yS:"number"
						racines:"liste"
						sols:"liste"
					}
					verifications:[
						{
							name:"xS"
							tag:"$x_S$"
							good:xS
						}
						{
							name:"yS"
							tag:"$y_S$"
							good:yS
						}
						{
							name:"racines"
							type:"all"
							good:racines
							tag:"Racines"
						}
						{
							name:"sols"
							type:"all"
							good:solutionsA
							tag:"$\\mathcal{S}$"
						}

					]
				}

			]


		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[normalTex, canoniqueTex, factoTex, xS, yS, racines, yA, solutionsA] = that.init(inputs,options)
				return {
					type:"text",
					children:[
						"$f(x) = #{normalTex}"
						"$f(x) = #{canoniqueTex}"
						"$f(x) = #{factoTex}$"
						"$A=yA.tex()$."
					]
				}

			return {
				children: [
					{
						type: "text",
						children: [
							"On propose la fonction &nbsp; $f$ &nbsp; définie de trois façons différentes. :"
							"En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible."
							"À chaque fois :"
						]
					}
					{
						type: "enumerate",
						refresh:false
						enumi:"a",
						children: [
							"Les coordonnées du sommet &nbsp; $S$ &nbsp; de la courbe de &nbsp; $f$"
							"Les racines de &nbsp; $f(x)$"
							"Les solultions, si elles existent, de &nbsp; $f(x) = A$"
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
				[normalTex, canoniqueTex, factoTex, xS, yS, racines, yA, solutionsA] = @init(inputs_list[0],options)
				return {
					children: [
						"On propose la fonction $f$ définie de trois façons différentes. :"
						"$f(x) = #{normalTex}"
						"$f(x) = #{canoniqueTex}"
						"$f(x) = #{factoTex}$"
						"En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible."
						{
							type: "enumerate",
							enumi:"a)",
							children: [
								"Les coordonnées du sommet $S$ de la courbe de $f$"
								"Les racines de $f(x)$"
								"Les solultions, si elles existent, de $f(x) = #{yA.tex()}$"
							]
						}
					]
				}

			else
				that = @

				fct_item = (inputs, index) ->
					[normalTex, canoniqueTex, factoTex, xS, yS, racines, yA, solutionsA] = that.init(inputs,options)
					return {
						type:"enumerate",
						enumi: "a)"
						children:[
							"$f(x) = #{normalTex}"
							"$f(x) = #{canoniqueTex}"
							"$f(x) = #{factoTex}$"
							"$A=yA.tex()$."
						]
					}

				return {
					children: [
						"On propose la fonction $f$ définie de trois façons différentes. :"
						"En utilisant bien ces différentes formes, répondez aux questions avec le moins de calcul possible."
						"À chaque fois :"
						{
							type: "enumerate",
							enumi:"A)",
							children: [
								"Les coordonnées du sommet $S$ de la courbe de $f$"
								"Les racines de $f(x)$"
								"Les solultions, si elles existent, de $f(x) = A$"
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
