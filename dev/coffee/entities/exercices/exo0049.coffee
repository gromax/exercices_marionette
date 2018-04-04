define ["utils/math","utils/help"], (mM, help) ->
	# id:49
	# title:"Donnez la primitive d'une fonction"
	# description:"Une fonction polynome est donnée, il faut donner sa primitive."
	# keyWords:["Analyse", "fonction", "Primitive", "Terminale"]

	return {
		init: (inputs) ->
			if (typeof inputs.poly is "undefined")
				degre = mM.alea.real { min:1, max:4 }
				coeffs = [ 0 ]
				coeffs.push mM.alea.real({ min:-7, max:7 }) for i in [0..degre-1]
				poly = mM.polynome.make { coeffs:coeffs }
				inputs.poly = String poly
			else
				poly = mM.polynome.make inputs.poly
			[
				poly.derivate().tex()
				mM.exec [poly.toNumberObject(), "symbol:c", "+"]
			]

		getBriques: (inputs,options) ->
			[deriveeTex, poly] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Soit &nbsp; $f(x) = #{deriveeTex}$"
								"Donnez l'expression <b>générale</b> de &nbsp; $F$, fonction primitive de &nbsp; $f$ &nbsp; sur &nbsp; $\\mathbb{R}$."
								"<b>Attention :</b> Utilisez la lettre &nbsp; $c$ &nbsp; pour la constante faisant la généralité de &nbsp; $F$."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$F(x)$"
							name:"p"
							description:"Expression de F"
							good:poly
							developp: true
							alias: { c:["c", "C", "K"]}
							custom_verification_message: (answer_data)->
								p = answer_data["p"].processedAnswer.object
								if mM.exec([poly, "symbol:c", "-", p, "-"], {simplify:true}).isNul()
									return {
										type:"warning"
										text:"Vous avez oublié la constante $c$."
										note:.5
									}
								else return null
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
				[deriveeTex, poly] = that.init(inputs,options)
				return "$#{ deriveeTex }$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive."
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
				[deriveeTex, poly] = that.init(inputs,options)
				return "$#{ deriveeTex }$"

			return {
				children: [
					"Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
