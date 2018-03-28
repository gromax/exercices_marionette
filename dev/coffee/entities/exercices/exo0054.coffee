define ["utils/math"], (mM) ->
	# id:54
	# title:"Équations différentielles du premier ordre"
	# description:"Résoudre des équations différentielles du premier ordre, avec coefficients constant et second membre."
	# keyWords:["exponentielle","équation","TSTL","BTS"]
	# options: {
	#	a:{ tag:"second membre" , options:["u' exp(-b/a.t)+Y", "u' exp(-b/a.t)", "Y", "u' exp(-b/a.t) OU Y"]}
	#}

	return {
		init: (inputs, options) ->
			# On a une équation de type a.y'+b.y = c avec
			# a <>0
			# c est de la forme u' exp(-b/a.t) + Y
			# a priori, u est un simple polynome de degré 0 ou 1
			optA = Number options.a.value

			if typeof inputs.a isnt "undefined" then a = Number inputs.a
			else
				a = mM.alea.real { min:1, max:10, sign:true }
				inputs.a = String a

			if typeof inputs.b isnt "undefined" then b = Number inputs.b
			else
				b = mM.alea.real { min:1, max:10, sign:true }
				inputs.b = String b

			# On envisage pour u' une écriture u1.t+u0
			switch
				when typeof inputs.u0 isnt "undefined" then u0 = Number inputs.u0
				when (optA is 2) or ((optA is 3) and mM.alea.dice(1,2)) then u0 = 0
				else u0 = mM.alea.real { min:1, max:5 }
			inputs.u0 = String u0
			# Une fois sur 10, si u0 exite déjà, on ajoute un u1 non nul
			switch
				when typeof inputs.u1 isnt "undefined" then u1 = Number inputs.u1
				when (u0 isnt 0) and mM.alea.dice(1,10) then u1 = mM.alea.real { min:1, max:5 }
				else u1 = 0
			inputs.u1 = String u1
			u_nul = (u0 is 0) and (u1 is 0)

			# On envisage l'ajout d'une constante Y à c(t)
			switch
				when typeof inputs.Y isnt "undefined" then Y = Number inputs.Y
				when (optA is 1) or (optA is 3) and not u_nul then Y = 0
				when optA is 0 then Y = mM.alea.real { min:0, max:10 }
				else Y = mM.alea.real { min:1, max:10 }
			inputs.Y = String Y

			# Valeur de y(0)
			if typeof inputs.y0 isnt "undefined" then y0 = Number inputs.y0
			else
				y0 = mM.alea.real { min:0, max:10 }
				inputs.y0 = String y0

			# le exp(-b/a t) revient tout le temps, je le calcul
			expo = mM.exec [b, "*-", a, "/", "t", "*", "exp"], {simplify:true}

			# C'est la même chose mais avec le a/b calculé en flotant parce que sinon
			# lors de la comparaison, 7/2 et 3,5 sont pris comme différents
			expoF = mM.exec [b/a, "*-", "t", "*", "exp"], {simplify:true}
			if (u1 isnt 0) or (u0 isnt 0) then operands = [ u1, "t", "*", u0, "+", expo, "*"]
			else operands = [ 0 ]
			if Y isnt 0 then operands.push(Y,"+")
			c = mM.exec operands, { simplify:true }
			premier_membre_tex = mM.exec([a,"symbol:y'","*",b,"symbol:y","*","+"],{simplify:true}).tex()
			second_membre_tex = c.tex(altFunctionTex:["exp"])
			good_y0 = mM.exec ["symbol:K", expo, "*"], {simplify:true}
			good_y0F = mM.exec ["symbol:K", expoF, "*"], {simplify:true}
			# On précise la forme de la solution générale
			good_y1 = mM.exec [u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a , "/", expo, "*", Y, b, "/", "+"], { simplify:true }
			good_y1F = mM.exec [u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", expoF, "*", Y, b, "/", "+"], { simplify:true }
			K_good = mM.exec [ y0, Y, b, "/", "-"], { simplify:true }
			good_y = mM.exec [u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", K_good, "+", expo, "*", Y, b, "/", "+"], { simplify:true }
			good_yF = mM.exec [u1, "t", "t", 2, "/", "*", "*", u0, "t", "*", "+", a, "/", K_good, "+", expoF, "*", Y, b, "/", "+"], { simplify:true }
			switch
				when u_nul
					# On est sûr que Y<>0
					forme_y1_tex = "C"
					symboles_a_trouver = ["$C$"]
				when (Y is 0) and (u1 is 0)
					# On est sûr que u0<>0
					forme_y1_tex = mM.exec([ "symbol:a", "t", "*", expo, "*" ]).tex(altFunctionTex:["exp"])
					symboles_a_trouver = ["$a$"]
				when u1 is 0
					# On est sûr que u0<>0 et Y<>0
					forme_y1_tex = mM.exec([ "symbol:a", "t", "*", expo, "*", "symbol:C", "+" ]).tex(altFunctionTex:["exp"])
					symboles_a_trouver = ["$a$", "$C$"]
				when (Y is 0)
					# On est sûr que u1<>0 puisque le cas u1 = 0 et Y = 0 a déjà été traité. On ne sait pas pour u0
					forme_y1_tex = mM.exec([ "symbol:a", "t", 2, "^", "*", "symbol:b", "t", "*", "+", expo, "*"]).tex(altFunctionTex:["exp"])
					symboles_a_trouver = ["$a$", "$b$"]
				else
					# On est sûr que u1<>0 puisque le cas u1 = 0 a déjà été envisagé
					forme_y1_tex = mM.exec([ "symbol:a", "t", 2, "^", "*", "symbol:b", "t", "*", "+", expo, "*", "symbol:C", "+"]).tex(altFunctionTex:["exp"])
					symboles_a_trouver = ["$a$", "$b$", "$C$"]

			[premier_membre_tex, second_membre_tex, good_y0, good_y0F, forme_y1_tex, symboles_a_trouver, good_y1, good_y1F, y0, good_y, good_yF]

		getBriques: (inputs,options)->
			[premier_membre_tex, second_membre_tex, good_y0, good_y0F, forme_y1_tex, symboles_a_trouver, good_y1, good_y1F, y0, good_y, good_yF] = @init(inputs, options)

			[
				{
					items:[
						{
							type:"text"
							rank:0
							ps:[
								"Soit l'équation différentielle $(E):#{premier_membre_tex} = #{second_membre_tex}$"
							]
						}
						{
							type:"ul"
							rank:1
							list: [
								{type:"warning", text:"Écrivez exp(...) et pas e^..."}
								{type:"warning", text:"Utilisez &nbsp; $K$ &nbsp; comme constante et quand vous écrivez &nbsp; $K \\exp(\\cdots)$, faites attention de séparer &nbsp; $K$ &nbsp; et &nbsp; $\\exp$ &nbsp; au minimum d'une espace."}
							]
						}
					]
				}
				{
					title: "Équation sans second membre"
					bareme: 34
					items: [
						{
							type:"text"
							rank:0
							ps:[
								"Donnez l'expression de &nbsp; $y_0$, solution générale de l'équation : &nbsp; $\\left(E_0\\right) : #{premier_membre_tex} = 0$."
								"Vous noterez &nbsp; $K$ &nbsp; la constante utile."
							]
						}
						{
							type:"input"
							rank:1
							waited:"number"
							tag:"$y_0(t)$"
							name:"y0"
							description:"Solution générale de E0"
							alias:{K:["K","k","A","C"]}
							good:[good_y0, good_y0F]
							goodTex:good_y0.tex(altFunctionTex:["exp"])
						}
						{
							type: "validation"
							rank: 2
							clavier: []
						}
					]
				}
				{
					title: "Solution particulière"
					bareme: 33
					items: [
						{
							type: "text"
							rank: 0
							ps: [
								"Il existe une solution particulière de &nbsp; $(E)$ &nbsp; dont l'expression est de la forme &nbsp; $y_1(t) = #{forme_y1_tex} $."
								"Donnez cette solution en précisant le(s) valeur(s) de &nbsp; #{symboles_a_trouver.join(", &nbsp; ")}."
							]
						}
						{
							type: "input"
							rank: 1
							waited: "number"
							tag:"$y_1(t)$"
							name:"y1"
							description:"Solution particulière de E"
							good:[good_y1, good_y1F]
							goodTex:good_y1.tex(altFunctionTex:["exp"])
						}
						{
							type: "validation"
							rank: 2
							clavier: []
						}
					]
				}
				{
					title: "Solution avec contrainte"
					bareme: 33
					items: [
						{
							type:"text"
							rank:0
							ps: [
								"Soit &nbsp; $y$ &nbsp; une solution de &nbsp; $(E)$ &nbsp; qui vérifie &nbsp; $y(0) = #{y0}$."
								"Donnez l'expression de &nbsp; $y$."
							]
						}
						{
							type: "input"
							rank: 1
							waited: "number"
							tag:"$y(t)$"
							name:"y"
							description:"Solution telle que y(0) = #{y0}"
							good:[good_y, good_yF]
							goodTex:good_y.tex(altFunctionTex:["exp"])
						}
						{
							type: "validation"
							rank: 2
							clavier: []
						}
					]
				}

			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[premier_membre_tex, second_membre_tex, good_y0, good_y0F, forme_y1_tex, symboles_a_trouver, good_y1, good_y1F, y0, good_y, good_yF] = that.init(inputs,options)
				return {
					children:[
						{
							type: "text"
							children: [
								"Soit l'équation différentielle &nbsp; $(E):#{premier_membre} = #{second_membre}$"
							]
						}
						{
							type:"enumerate"
							enumi: "1"
							children:[
								"Donnez &nbsp; $y_0(t)$, expression de la solution générale de &nbsp; $\\left(E_0\\right):#{premier_membre} = 0$"
								"Une solution générale de &nbsp; $(E)$ &nbsp; est de la forme &nbsp; $y_1(t) = #{forme_y1_tex}$. Donnez cette solution en précisant le(s) valeur(s) de &nbsp; #{itData.tex.symboles_a_trouver.join(", &nbsp; ")}."
								"Soit &nbsp; $y$ &nbsp; une solution de &nbsp; $(E)$ &nbsp; qui vérifie &nbsp; $y(0) = #{y0}$. Donnez l'expression de &nbsp; $y$."
							]
						}
					]
				}

			return {
				children: [
					{
						type: "subtitles"
						enumi: "A"
						refresh : true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			that = @
			fct_item = (inputs, index) ->
				[premier_membre_tex, second_membre_tex, good_y0, good_y0F, forme_y1_tex, symboles_a_trouver, good_y1, good_y1F, y0, good_y, good_yF] = that.init(inputs,options)
				return {
					children:[
						"Soit l'équation différentielle &nbsp; $(E):#{premier_membre} = #{second_membre}$"
						{
							type:"enumerate"
							enumi: "1)"
							children:[
								"Donnez $y_0(t)$, expression de la solution générale de $\\left(E_0\\right):#{premier_membre} = 0$"
								"Une solution générale de $(E)$ est de la forme $y_1(t) = #{forme_y1_tex}$. Donnez cette solution en précisant le(s) valeur(s) de #{itData.tex.symboles_a_trouver.join(", ")}."
								"Soit $y$ une solution de $(E)$ qui vérifie $y(0) = #{y0}$. Donnez l'expression de $y$."
							]
						}
					]
				}

			return {
				children: [
					{
						type: "enumerate"
						enumi: "A)"
						refresh : true
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
