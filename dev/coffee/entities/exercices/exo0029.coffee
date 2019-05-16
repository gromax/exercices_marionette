define ["utils/math","utils/help"], (mM, help) ->
	return {
		init: (inputs, complexe) ->
			if complexe
				A = mM.alea.vector({ name:"A", def:inputs, values:[ { values:{min:-30, max:30}, denominator:{min:1, max:5} } ] }).save(inputs)
				B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
				C = mM.alea.vector({ name:"C", def:inputs, values:[ { values:{min:-30, max:30}, denominator:{min:1, max:5} } ] }).save(inputs)
				D = mM.alea.vector({ name:"D", def:inputs }).save(inputs)
				mg = mM.exec(["symbol:z", A.affixe(), "*", C.affixe(), "+"], {simplify:true, developp:true}).tex()
				md = mM.exec(["symbol:z", B.affixe(), "*", D.affixe(), "+"], {simplify:true, developp:true}).tex()
				solutions = [ mM.exec([D.affixe(), C.affixe(), "-", A.affixe(), B.affixe(), "-", "/"], {simplify:true}) ]
			else
				A = mM.alea.vector({ name:"A", def:inputs, values:[ { values:{min:-30, max:30}, denominator:{min:1, max:5} } ] }).save(inputs)
				B = mM.alea.vector({ name:"B", def:inputs, forbidden:[{coords:A, axe:"x"}] }).save(inputs)
				mg = mM.exec(["x", A.x, "*", A.y, "+"], {simplify:true}).tex()
				md = mM.exec(["x", B.x, "*", B.y, "+"], {simplify:true}).tex()
				solutions = [ mM.exec([B.y, A.y, "-", A.x, B.x, "-", "/"], {simplify:true}) ]
			[
				"#{mg} = #{md}"
				solutions
			]

		getBriques: (inputs, options, fixedSettings) ->
			complexe = fixedSettings.c
			[eqTex, solutions] = @init(inputs, complexe)
			[
				{
					bareme:100
					items:[
						{
							type:"text"
							ps:[
								"On considère l'équation : &nbsp; $#{ eqTex }$."
								"Vous devez donner la ou les solutions de cette équations, si elles existent."
								"S'il n'y a pas de solution, écrivez &nbsp; $\\varnothing$. s'il y a plusieurs solutions, séparez-les avec ;</i>"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\mathcal{S} =$", cols:3, class:"text-right" }
								{ latex: true, cols:9, name:"solutions"}
							]
						}
						{
							type: "validation"
							clavier: ["empty"]
						}
					]
					validations:{
						solutions:"liste"
					}
					verifications:[
						{
							name:"solutions"
							type:"all"
							good:solutions
							tag:"$\\mathcal{S}$"
						}
					]
				}
			]

		getExamBriques: (inputs_list,options, fixedSettings) ->
			complexe = fixedSettings.c
			that = @
			fct_item = (inputs, index) ->
				[eqTex, solutions] = that.init(inputs,complexe)
				return "$#{ eqTex }$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On considère les équations suivantes."
							"Vous devez donner la ou les solutions de ces équations, si elles existent."
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

		getTex: (inputs_list, options, fixedSettings) ->
			complexe = fixedSettings.c
			that = @
			fct_item = (inputs, index) ->
				[eqTex, solutions] = that.init(inputs,complexe)
				return "$#{ eqTex }$"

			return {
				children: [
					"On considère les équations suivantes."
					"Vous devez donner la ou les solutions de ces équations, si elles existent."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
