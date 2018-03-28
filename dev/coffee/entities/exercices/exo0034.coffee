define ["utils/math", "utils/help"], (mM, help) ->
	# id:34
	# title:"Équation de type $\\cos x = \\cos \\alpha$"
	# description:"Résoudre une équation de la forme $\\cos x = \\cos \\alpha$ $\\sin x = \\sin \\alpha$."
	# keyWords:["Trigonométrie","Algèbre","Équation","Première"]

	return {
		init: (inputs) ->
			if inputs.ang? then ang= Number inputs.ang
			else inputs.ang = ang = 15*mM.alea.real { min:1, max:12, sign:true }
			if inputs.type? then type=inputs.type # sin ou cos
			else inputs.type = type = mM.alea.in ["cos","sin"]
			angRad = mM.trigo.degToRad [ ang ]
			if type is "cos"
				membreGauche = mM.exec([ "x", "cos"]).tex()
				membreDroite = mM.exec([angRad, "cos"]).tex()
				if (Math.abs(ang) % 180) is 0 then solutions = [ mM.exec([angRad, 2, "pi", "*", "modulo"]) ]
				else solutions = [
					mM.exec([ angRad, 2, "pi", "*", "modulo"])
					mM.exec([ angRad, "*-", 2, "pi", "*", "modulo"])
				]
			else
				membreGauche = mM.exec([ "x", "sin"]).tex()
				membreDroite = mM.exec([ angRad, "sin"]).tex()
				if ((Math.abs(ang)+90)%180) is 0 then solutions = [ mM.exec([angRad, 2, "pi", "*", "modulo"]) ]
				else solutions = [
					mM.exec([angRad, 2, "pi", "*", "modulo"])
					mM.exec(["pi", angRad, "-", 2, "#", "pi", "*", "*", "+"], {simplify:true, modulo:true})
				]
			[membreGauche, membreDroite, solutions]

		getBriques: (inputs, options) ->
			[membreGaucheTex, membreDroiteTex, solutions] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"Vous devez résoudre l'équation suivante :"
								"$#{membreGaucheTex} = #{membreDroiteTex}$"
								"S'il y a plusieurs solutions, séparez-les avec ;"
							]
						}
						{
							type: "input"
							rank: 2
							waited: "liste:number"
							name: "solutions"
							tag:"$\\mathcal{S}$"
							description:"Solutions"
							good: solutions
							moduloKey: "k"
						}
						{
							type: "validation"
							rank: 4
							clavier: ["empty", "pi"]
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
