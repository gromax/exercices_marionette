define ["utils/math", "utils/help"], (mM, help) ->
	# id:33
	# title:"Équation modulo $2\\pi$"
	# description:"Résoudre une équation portant sur des mesures angulaires en radians, avec un terme $2k\\pi$."
	# keyWords:["Trigonométrie","Algèbre","Équation","Première"]

	return {
		init: (inputs) ->
			if inputs.a? then a = Number inputs.a
			else a = inputs.a = mM.alea.real { min:1, max:5 }
			if inputs.b? then b= Number inputs.b
			else b = inputs.b = mM.alea.real { min:1, max:5, no:[a] }
			a = mM.toNumber a
			b = mM.toNumber b
			if inputs.ang1? then ang1= mM.toNumber inputs.ang1
			else
				ang1 = mM.alea.number { min:1, max:6, sign:true, coeff:30}
				inputs.ang1 = String ang1
			ang1 = mM.trigo.degToRad ang1
			if inputs.ang2? then ang2= mM.toNumber inputs.ang2
			else
				ang2 = mM.alea.number { min:1, max:6, sign:true, coeff:30 }
				inputs.ang2 = String ang2
			ang2 = mM.trigo.degToRad ang2

			[
				mM.exec([ "x", a, "*", ang1, "+"], {simplify:true}).tex()
				mM.exec([ "x", b, "*", ang2, "+", 2, "Symbol:k", "pi", "*", "*", "+"], {simplify:true}).tex()
				mM.exec([ang2, ang1, "-", a, b, "-", "/"], { simplify:true, developp:true })
				mM.exec([2, "pi", "*", a, b, "-", "/"], { simplify:true, developp:true})
			]
		getBriques: (inputs, options) ->
			[membreGaucheTex, membreDroiteTex, sol, modu] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"Vous devez résoudre l'équation suivante :"
								"$#{membreGaucheTex} = #{membreDroiteTex}, k\\in\\mathbb{Z}$"
								"Votre réponses doit être de la forme &nbsp; $\\cdots + k \\cdots$"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$x =$", cols:2, class:"text-right" }
								{ latex: true, cols:3, name:"x"}
								{ text: "$ + k \\quad\\cdot$", cols:1, class:"text-center" }
								{ latex: true, cols:3, name:"m"}
								{ text: "$, k \\in\\mathbb{Z}$", cols:2 }
							]
						}
						{
							type: "validation"
							clavier: ["pi", "aide"]
						}
						{
							type: "aide"
							list:[
								"$k$ &nbsp; est un entier quelconque. Vous pouvez le manipuler comme si sa valeur était connue, comme on le fait avec le symbole &nbsp; $\\pi$."
							]
						}
					]
					validations: {
						x: "number"
						m: "number"
					}
					verifications: [
						(data)->
							verX = mM.verification.isSame(data.x.processed, sol, {})
							verM = mM.verification.areSome(data.m.processed, [modu, mM.exec([modu,"*-"])], {})
							# Il faut accepter un x qui serait avec le modulo
							if verX.note is 0
								ratio = mM.float(mM.exec([data.x.processed.object, sol, "-", data.m.processed.object, "/"]))
								if ratio-Math.abs(ratio)<.000000001
									verX.note = 1
									verX.goodMessage = {
										type:"success"
										text: "$#{data.x.processed.tex}$ &nbsp; est une bonne réponse."
									}
							{
								note: (verX.note+verM.note)/2
								add: {
									type: "ul"
									list: [{
										type:"normal"
										text: "Vous avez répondu &nbsp; $x= #{data.x.processed.tex} + k \\cdot #{data.m.processed.tex}$"
									}].concat(verX.errors, [verX.goodMessage], verM.errors, [verM.goodMessage])
								}
							}
					]

				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[membreGaucheTex, membreDroiteTex, sols] = that.init(inputs,options)
				return "$#{membreGaucheTex} = #{membreDroiteTex}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez les solutions des équations suivantes :"
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
				[membreGaucheTex, membreDroiteTex, sols] = that.init(inputs,options)
				return "$#{membreGaucheTex} = #{membreDroiteTex}$"

			return {
				children: [
					"Donnez les solutions des équations suivantes :"
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}



	}
