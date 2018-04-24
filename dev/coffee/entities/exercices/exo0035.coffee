define ["utils/math", "utils/help"], (mM, help) ->
	# id:35
	# title:"Équation de type $\\cos (a\\cdot x+b) = \\cos \\alpha$"
	# description:"Résoudre une équation de la forme $\\cos x = \\cos \\alpha$ $\\sin x = \\sin \\alpha$."
	# keyWords:["Trigonométrie","Algèbre","Équation","Première"]

	return {
		init: (inputs, options) ->
			if inputs.a? then a= Number inputs.a
			else
				a = mM.alea.number { min:2, max:5 }
				inputs.a = String a
			if inputs.ang1? then ang1 = mM.toNumber inputs.ang1
			else
				ang1 = mM.alea.number { min:1, max:6, sign:true, coeff:30 }
				inputs.ang1 = String ang1

			if inputs.ang2? then ang2 = mM.toNumber inputs.ang2
			else
				ang2 = mM.alea.number { min:1, max:6, sign:true, coeff:30 }
				inputs.ang2 = String ang2
			if inputs.type? then type=inputs.type
			else inputs.type = type = mM.alea.real ["cos","sin"]

			ang1R = mM.trigo.degToRad ang1
			ang2R = mM.trigo.degToRad ang2

			membreGauche = mM.exec(["x", a, "*", ang1R, "+", type], {simplify:true}).tex()
			membreDroite = mM.exec([ang2R, type]).tex()

			angSol = mM.exec([ang2R, ang1R, "-", a, "/"], {simplify:true})
			modulo = mM.exec([2, "pi", "*", a, "/"], {simplify:true})

			if type is "cos"
				solutions = [angSol, mM.exec([angSol, "*-"])]
			else
				solutions = [angSol, mM.trigo.principale(["pi", angSol, "-"])]

			[membreGauche, membreDroite, solutions, modulo]

		getBriques: (inputs, options) ->
			[membreGaucheTex, membreDroiteTex, solutions, modu] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"Vous devez résoudre l'équation suivante :"
								"$#{membreGaucheTex} = #{membreDroiteTex}$"
								"Donnez une équation sous la forme les solutions appartenant à &nbsp; $]-\\pi;+\\pi]$."
								"Votre réponses doit être de la forme &nbsp; $\\cdots + k \\cdots, k\\in\\mathbb{Z}$"
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
							clavier: ["pi"]
						}
					]
					validations: {
						x:"number"
						m:"number"
					}
					verifications:[
						(data)->
							verX = mM.verification.areSome(data.x.processed, solutions, {})
							verM = mM.verification.areSome(data.m.processed, [modu, mM.exec([modu,"*-"])], {})
							# Il faut accepter un x qui serait avec le modulo
							if verX.note is 0
								ratio = mM.float(mM.exec([data.x.processed.object, solutions[0], "-", data.m.processed.object, "/"]))
								if ratio-Math.abs(ratio)<.000000001
									verX.note = 1
									verX.goodMessage = {
										type:"success"
										text: "$#{data.x.processed.tex}$ &nbsp; est une bonne réponse."
									}
								else
									# on essaie avec l'autre solution
									ratio = mM.float(mM.exec([data.x.processed.object, solutions[1], "-", data.m.processed.object, "/"]))
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
				[membreGaucheTex, membreDroiteTex, sols, modulo] = that.init(inputs,options)
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
				[membreGaucheTex, membreDroiteTex, sols, modulo] = that.init(inputs,options)
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
