define ["utils/math", "utils/help"], (mM, help) ->
	# id:40
	# title:"Somme de fractions"
	# description:"Ajouter des fractions et simplifier le résultat."
	# keyWords:["Calcul","Collège","Fraction"]

	return {
		init: (inputs) ->
			if inputs.e? then expression = mM.parse inputs.e, {simplify:false}
			else
				values = []
				N=2
				while values.length<N
					values.push mM.alea.number({ values: {min:1, max:30}, denominator:{min:2, max:7}, sign:true })
					if values.length>1 then values.push "+"
				expression = mM.exec values
				inputs.e = String expression
			expression
		getBriques: (inputs, options) ->
			expression = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"Soit &nbsp; $x=#{expression.tex()}$."
								"Donnez &nbsp; $x$ &nbsp; sous forme d'une fraction réduite."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name: "x"
							tag:"$x$"
							description:"Fraction réduite"
							good:expression.toClone().simplify()
						}
						{
							type: "validation"
							rank: 4
							clavier: []
						}

					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				expression = that.init(inputs,options)
				return "$#{expression.tex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez les expressions sous forme d'une fraction réduite."
						]
					}
					{
						type: "enumerate"
						enumi: "1"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			that = @

			fct_item = (inputs, index) ->
				expression = that.init(inputs,options)
				return "$#{expression.tex()}$"

			return {
				children: [
					"Donnez les expressions sous forme d'une fraction réduite."
					{
						type: "enumerate"
						enumi: "1)"
						children: _.map(inputs_list, fct_item)
					}
				]
			}


	}
