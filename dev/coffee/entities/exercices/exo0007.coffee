define ["utils/math","utils/help"], (mM, help) ->
	# id:7
	# title:"Image et antécédent avec un tableau de valeurs"
	# description:"Un tableau de valeur d'une fonction est donné. Il faut déterminer une image et un antécédent."
	# keyWords:["Fonctions","Antécédent","Image","Seconde"]

	return {
		m: -7
		M: 7
		init: (inputs) ->
			borne_inf = @m
			borne_sup = @M
			if typeof inputs.a is "undefined" then a = inputs.a = mM.alea.real { min:0, max:1 }
			else a = Number inputs.a

			if typeof inputs.b is "undefined" then b = inputs.b = mM.alea.real { min:-5, max:5 }
			else b = Number inputs.b

			if typeof inputs.c is "undefined" then c = inputs.c = mM.alea.real { min:1, max:9 }
			else c = Number inputs.c

			if typeof inputs.d is "undefined" then d = inputs.d = mM.alea.real { min:-20, max:20 }
			else d = Number inputs.d

			if typeof inputs.xi is "undefined" then xi = inputs.xi = mM.alea.real { min:borne_inf, max:borne_sup }
			else xi = Number inputs.xi

			if typeof inputs.xa is "undefined" then xa = inputs.xa = mM.alea.real { min:borne_inf, max:borne_sup }
			else xa = Number inputs.xa

			fct = (x) -> ((((a*x)+b)*x)+c)*x+d

			yi =
			ya =
			# Calcul des valeurs du tableau de variation
			tabx = [borne_inf..borne_sup]
			taby = ( fct(x) for x in tabx)
			antecedents = ( x for x, i in tabx when taby[i] is ya )

			[
				xi
				fct(xi)
				xa
				fct(xa)
				tabx
				taby
				antecedents
			]

		getBriques: (inputs, options) ->
			[xi, yi, xa, ya, tabx, taby, antecedents] = @init(inputs)
			tabx.unshift("$x$")
			taby.unshift("$f(x)$")

			[
				{
					bareme:100
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[#{@m};#{@M}]$."
								"On donne le tableau de valeur suivant :"
							]
						}
						{
							type:"tableau"
							rank:2
							entetes: false
							lignes:[
								tabx
								taby
							]
						}
						{
							type:"text"
							rank:3
							ps:[
								"Donnez l'image de #{xi} par &nbsp; $f$."
							]
						}
						{
							type:"input"
							rank:4
							waited: "number"
							tag:"Image"
							description:"Image de #{xi}"
							name: "i"
							good: yi
						}
						{
							type:"text"
							rank:5
							ps:[
								"Donnez un antécédent (un seul !) de #{ya} par &nbsp; $f$."
							]
						}
						{
							type:"input"
							rank:6
							waited: "number"
							tag:"Antécédent"
							description:"Antécédent de #{ya}"
							name: "a"
							good: antecedents
						}
						{
							type:"validation"
							rank:7
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank:8
							list: help.fonction.image_antecedent
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			xlow = @m
			xhigh = @M
			that = @
			fct_item = (inputs, index) ->
				[xi, yi, xa, ya, tabx, taby, antecedents] = that.init(inputs)
				tabx.unshift("$x$")
				taby.unshift("$f(x)$")
				return {
					children: [
						{
							type: "text"
							children:[
								"On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[#{xlow};#{xhigh}]$."
								"On donne le tableau de valeur suivant :"
							]
						}
						{
							type:"tableau"
							lignes: [
								tabx
								taby
							]
						}
						{
							type: "enumerate"
							enumi:"1"
							children: [
								"Donnez l'image de #{xi} par &nbsp; $f$"
								"Donnez un antécédent de #{ya} par &nbsp; $f$"
							]
						}
					]
				}

			return {
				children: [
					{
						type: "subtitles"
						enumi: "A"
						refresh:true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			xlow = @m
			xhigh = @M
			that = @
			fct_item = (inputs, index) ->
				[xi, yi, xa, ya, tabx, taby, antecedents] = that.init(inputs)
				tabx.unshift("$x$")
				taby.unshift("$f(x)$")
				return [
					"On considère la fonction $f$ défnie sur l'intervalle $[#{xlow};#{xhigh}]$."
					"On donne le tableau de valeur suivant :"
					{
						type:"tableau"
						setup: "|*{ #{tabx.length} }{c|}"
						lignes: [
							tabx
							taby
						]
					}
					{
						type: "enumerate",
						children: [
							"Donnez l'image de #{xi} par $f$"
							"Donnez un antécédent de #{ya} par $f$"
						]
					}
				]


			if inputs_list.length is 1
				return fct_item(inputs_list[0],0)
			else
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
