define ["utils/math", "utils/help"], (mM, help) ->
	# id:32
	# title: "Mesure principale d'un angle"
	# description: "La mesure d'un angle est donnée en radians. Il faut donner sa mesure principale."
	# keyWords:["Géométrie", "Trigonométrie", "Seconde"]

	return {
		init: (inputs) ->
			if inputs.d? then d = mM.toNumber inputs.d
			else
				d = mM.alea.number { min:6, max:20, coeff:50 }
				inputs.d = String d
			ang = mM.trigo.degToRad d
			[
				ang
				mM.trigo.principale ang
			]

		getBriques: (inputs, options) ->
			[ang, p] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On donne l'angle &nbsp; $\\alpha = #{ang.tex()}$ &nbsp; en radians."
								"Vous devez donner la mesure principale de cet angle."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name: "a"
							tag:"$\\alpha$"
							description:"Mesure principale"
							good:p
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide", "pi"]
						}
						{
							type: "aide"
							rank: 5
							list: help.trigo.radian.concat(help.trigo.pi, help.trigo.mesure_principale)
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ang, p] = that.init(inputs,options)
				return "$\\alpha =#{ang.tex()}$ &nbsp; radians"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez la mesure principale de &nbsp; $\\alpha$."
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
				[ang, p] = that.init(inputs,options)
				return "$\\alpha =#{ang.tex()}$ radians"

			return {
				children: [
					"Donnez la mesure principale de $\\alpha$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}


	}
