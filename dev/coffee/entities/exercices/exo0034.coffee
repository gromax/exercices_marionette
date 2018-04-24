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
			angPrinc = ang
			while ab = Math.abs(angPrinc)>180
				angPrinc -= angPrinc/ab*360
			if angPrinc is -180 then angPrinc = 180
			angPrincRad = mM.trigo.degToRad [ angPrinc ]
			if type is "cos"
				membreGauche = mM.exec([ "x", "cos"]).tex()
				membreDroite = mM.exec([angRad, "cos"]).tex()
				if (Math.abs(ang) % 180) is 0 then solutions = [ angPrincRad ]
				else solutions = [
					angPrincRad
					mM.exec([ angPrincRad, "*-"])
				]
			else
				membreGauche = mM.exec([ "x", "sin"]).tex()
				membreDroite = mM.exec([ angRad, "sin"]).tex()
				if ((Math.abs(ang)+90)%180) is 0 then solutions = [ angPrincRad ]
				else solutions = [
					angPrincRad
					mM.exec(["pi", angPrincRad, "-"], {simplify:true})
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
								"Donnez les solutions contenues dans l'intervalle &nbsp; $]-\\pi;\\pi]$"
								"S'il y a plusieurs solutions, séparez-les avec ;"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\mathcal{S} =$", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"solutions"}
							]
						}
						{
							type: "validation"
							clavier: ["empty", "pi"]
						}
					]
					validations:{
						solutions:"liste"
					}
					verifications:[
						{
							name:"solutions"
							type:"all"
							good: solutions
							tag:"$\\mathcal{S}$"
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
