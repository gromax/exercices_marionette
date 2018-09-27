define ["utils/math","utils/help"], (mM, help) ->
	# id:49
	# title:"Donnez la primitive d'une fonction"
	# description:"Une fonction polynome est donnée, il faut donner sa primitive."
	# keyWords:["Analyse", "fonction", "Primitive", "Terminale"]

	return {
		init: (inputs) ->
			if (typeof inputs.poly is "undefined")
				degre = mM.alea.real { min:2, max:4 }
				coeffs = [ 0 ]
				coeffs.push mM.alea.real({ min:-7, max:7 }) for i in [0..degre-2]
				coeffs.push mM.alea.real({ min:1, max:7 })
				poly = mM.polynome.make { coeffs:coeffs }
				inputs.poly = String poly
			else
				poly = mM.polynome.make inputs.poly
			[
				poly.derivate().tex()
				mM.exec [poly.toNumberObject(), "symbol:c", "+"]
				poly.toNumberObject()
			]

		getBriques: (inputs,options) ->
			[deriveeTex, poly, polySansC] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type:"text"
							ps:[
								"Soit &nbsp; $f(x) = #{deriveeTex}$"
								"Donnez l'expression <b>générale</b> de &nbsp; $F$, fonction primitive de &nbsp; $f$ &nbsp; sur &nbsp; $\\mathbb{R}$."
								"<b>Attention :</b> Utilisez la lettre &nbsp; $c$ &nbsp; pour la constante faisant la généralité de &nbsp; $F$."
							]
						}
						{
							type: "input"
							format: [
								{ text: "$F(x) =$", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"p"}
							]
						}
						{
							type: "validation"
							clavier: ["pow"]
						}
					]
					validations: {
						p:{
							alias: { c:["c", "C", "K"]}
							developp: true
						}
					}
					verifications:[
						(data)->
							ver = mM.verification.isSame(data.p.processed, poly, { developp: true })
							if ver.note is 0
								ver2 = mM.verification.isSame(data.p.processed, polySansC, { developp: true })
								if ver2.note >0
									ver = ver2
									ver.errors.push { type:"warning", text:"Vous avez oublié la constante &nbsp; $c$" }
									ver.note = ver.note * .75
							{
								note: ver.note
								add: {
									type:"ul"
									list: [
										{ type:"normal", text:"Vous avez répondu &nbsp; $#{data.p.processed.tex}$" }
										ver.goodMessage
									].concat(ver.errors)
								}
							}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[deriveeTex, poly, polySansC] = that.init(inputs,options)
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
				[deriveeTex, poly, polySansC] = that.init(inputs,options)
				return "$f(x) = #{ deriveeTex }$"

			if inputs_list.length >0
				return {
					children: [
						"Pour chacune des fonctions suivantes, donnez l'expression générale d'une primitive."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
			else
				return {
					children: [
						"Donnez l'expression générale d'une primitive de #{fct_item(inputs_list[0],0)}."
					]
				}

	}
