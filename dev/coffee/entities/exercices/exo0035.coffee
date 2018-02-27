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
			ang1 = mM.trigo.degToRad ang1
			if inputs.ang2? then ang2 = mM.toNumber inputs.ang2
			else
				ang2 = mM.alea.number { min:1, max:6, sign:true, coeff:30 }
				inputs.ang2 = String ang2
			ang2 = mM.trigo.degToRad ang2
			if inputs.type? then type=inputs.type
			else inputs.type = type = mM.alea.real ["cos","sin"]

			membreGauche = mM.exec(["x", a, "*", ang1, "+", type], {simplify:true}).tex()
			membreDroite = mM.exec([ang2, type]).tex()

			modulo = mM.exec [2, "pi", "*", a, "/"], {simplify:true}
			ang = mM.exec [ang2, ang1, "-", a, "/"], {simplify:true}
			if type is "cos"
				solutions = [ang.toClone().setModulo(modulo), ang.opposite().setModulo(modulo)]
			else
				solutions = [ang.toClone().setModulo(modulo), mM.trigo.principale(["pi", ang, "-"]).setModulo(modulo)]

			[membreGauche, membreDroite, solutions]

		getBriques: (inputs, options) ->
			[membreGauche, membreDroite, solutions] = @init(inputs)

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

	}
