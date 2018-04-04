define ["utils/math","utils/help"], (mM, help) ->
#	id:55
#	title:"Calculer une intégrale"
#	description:"Calculer l'intégrale d'une fonction."
#	keyWords:["Analyse", "fonction", "Primitive", "Intégrale", "Terminale"]

	return {
		init: (inputs) ->
			if (typeof inputs.poly is "undefined")
				degre = mM.alea.real { min:1, max:3 }
				coeffs = [ 0 ]
				coeffs.push mM.alea.real({ min:-7, max:7 }) for i in [0..degre-1]
				poly = mM.polynome.make { coeffs:coeffs }
				inputs.poly = String poly
			else
				poly = mM.polynome.make inputs.poly
			if (typeof inputs.a is "undefined")
				a = mM.alea.real { min:-3, max:3 }
				inputs.a = String a
			else
				a = Number inputs.a
			if (typeof inputs.b is "undefined")
				b = mM.alea.real { min:a+1, max:8 }
				inputs.b = String b
			else
				b = Number inputs.b
			a = mM.toNumber a
			b = mM.toNumber b
			[
				poly.derivate()
				a
				b
				mM.exec([poly.calc(b), poly.calc(a), "-"], { simplify:true })
				mM.alea.in ["t", "x"]
			]

		getBriques: (inputs,options) ->
			[fct, a, b, integrale, variable] = @init(inputs, options)
			[
				{
					bareme: 100
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Calculez l'intégrale : &nbsp; $\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fct.tex({variable:variable})}\\right)\\:\\text{d}#{variable}$"
								"Remarque : Ces intégrales peuvent être négatives."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$\\mathcal{I}$"
							name:"I"
							description:"Intégrale"
							good:integrale
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
				[fct, a, b, integrale, variable] = that.init(inputs,options)
				return "$\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fct.tex({variable:variable})}\\right)\\:\\text{d}#{variable}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Calculez les intégrales suivantes."
							"Remarque : Ces intégrales peuvent être négatives."
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
				[fct, a, b, integrale, variable] = that.init(inputs,options)
				return "$\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fct.tex({variable:variable})}\\right)\\:\\text{d}#{variable}$"

			return {
				children: [
					"Calculez les intégrales suivantes."
					"\\textit{Ces intégrales peuvent être négatives.}"
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
