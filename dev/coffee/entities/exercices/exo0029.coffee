define ["utils/math","utils/help"], (mM, help) ->
#	id:29
#	title:"Équation du premier degré"
#	description:"Résoudre une équation du premier degré."
#	keyWords:["Affine","Algèbre","Équation","Seconde"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs, values:[ { values:{min:-30, max:30}, denominator:{min:1, max:5} } ] }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			mg = mM.exec(["x", A.x, "*", A.y, "+"], {simplify:true}).tex()
			md = mM.exec(["x", B.x, "*", B.y, "+"], {simplify:true}).tex()
			solutions = [ mM.exec([B.y, A.y, "-", A.x, B.x, "-", "/"], {simplify:true}) ]
			[
				"$#{mg} = #{md}$"
				solutions
			]

		getBriques: (inputs, options) ->
			[eqTex, solutions] = @init(inputs)

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"On considère l'équation : $#{ eqTex }$."
								"Vous devez donner la ou les solutions de cette équations, si elles existent."
								"<i>S'il n'y a pas de solution, écrivez $\\varnothing$. s'il y a plusieurs solutions, séparez-les avec ;</i>"
							]
						}
						{
							type: "input"
							rank: 3
							waited: "liste:number"
							name:"solutions"
							tag:"$\\mathcal{S}$"
							good: goods
						}
						{
							type: "validation"
							rank: 4
							clavier: ["empty"]
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[eqTex, solutions] = that.init(inputs,options)
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

		getTex: (inputs_list, options) ->
			that = @
			fct_item = (inputs, index) ->
				[eqTex, solutions] = that.init(inputs,options)
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
