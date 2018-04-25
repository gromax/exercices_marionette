define ["utils/math", "utils/help"], (mM, help) ->

	# id:23
	# title:"Équation de la tangente à une courbe"
	# description:"Pour $x$ donné, on donne $f(x)$ et $f'(x)$. Il faut en déduire l'équation de la tangente à la courbe à l'abscisse $x$."
	# keyWords:["Dérivation","Tangente","Équation","Première"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]

		getBriques: (inputs, options) ->
			[A, B, droite] = @init(inputs)
			xAtex = A.x.tex()
			yAtex = A.y.tex()
			eqReduite = droite.reduiteObject()
			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur &nbsp; $\\mathbb{R}$."
								"$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère."
								"On sait que &nbsp; $f\\left(#{xAtex}\\right) = #{yAtex}$ &nbsp; et &nbsp; $f'\\left(#{xAtex}\\right) = #{droite.m().tex()}$."
								"Donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $#{xAtex}$."
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\mathcal{T} :$", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"e"}
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.derivee.tangente
						}
					]
					validations:{
						e:(user)->
							pattern =/y\s*=([^=]+)/
							result = pattern.exec(userValue)
							if result
								out =  mM.verification.numberValidation(result, {})
								out.user = user
							else
								out = { processed:false, user:user, error:"L'équation doit être de la forme y=..." }
							out
					}
					verifications:[
						(data) ->
							ver = mM.verification.isSame(data.e.processed, eqReduite, { developp:true, formes:"FRACTION"} )
							if ver.note is 0 then ver.goodMessage = { type:"error", text:"La bonne réponse était &nbsp; $y = #{eqReduite.tex()}$."}
							list = [
								{ type:"normal", text:"<b>#{tag}</b> &nbsp; :</b>&emsp; Vous avez répondu &nbsp; $y = #{data.e.processed.tex}$" }
								ver.goodMessage
							]
							out = {
								note: ver.note
								add: {
									type:"ul"
									list: list.concat(ver.errors)
								}
							}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs)
				xAtex = A.x.tex()
				yAtex = A.y.tex()
				return "$a=#{xAtex}$ &nbsp; : &nbsp; $f(a) = #{yAtex}$ &nbsp; et &nbsp; $f'(a) = #{droite.m().tex()}$."

			return {
				children: [
					{
						type: "text",
						children: [
							"On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur &nbsp; $\\mathbb{R}$."
							"$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère."
							"Dans les cas suivants, donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $a$."
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
				[A, B, droite] = that.init(inputs)
				xAtex = A.x.tex()
				yAtex = A.y.tex()
				return "$a=#{xAtex}$ &nbsp; : &nbsp; $f(a) = #{yAtex}$ &nbsp; et &nbsp; $f'(a) = #{droite.m().tex()}$."

			return {
				children: [
					"On considère une fonction une fonction $f$ dérivable sur $\\mathbb{R}$."
					"$\\mathcal{C}$ est sa courbe représentative dans un repère."
					"Dans les cas suivants, donnez l'équation de la tangente $\\mathcal{T}$ à la courbe $\\mathcal{C}$ en l'abscisse $a$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
