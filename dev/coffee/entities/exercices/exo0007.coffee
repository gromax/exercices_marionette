define ["utils/math","utils/help"], (mM, help) ->
	# id:7
	# title:"Image et antécédent avec un tableau de valeurs"
	# description:"Un tableau de valeur d'une fonction est donné. Il faut déterminer une image et un antécédent."
	# keyWords:["Fonctions","Antécédent","Image","Seconde"]

	Controller =
		init: (inputs, options) ->

			borne_inf = -7
			borne_sup = 7
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

			yi = fct(xi)
			ya = fct(xa)

			# Calcul des valeurs du tableau de variation
			tabx = [borne_inf..borne_sup]
			taby = ( fct(x) for x in tabx)
			antecedents = ( x for x, i in tabx when taby[i] is ya )
			tabx.unshift("$x$")
			taby.unshift("$f(x)$")

			{
				inputs: inputs
				briques: [
					{
						bareme:100
						items: [
							{
								type:"text"
								rank:1
								ps:[
									"On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[#{borne_inf};#{borne_sup}]$."
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
			}

	return Controller
