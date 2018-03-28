define ["utils/math","utils/help"], (mM, help) ->
	# id:44
	# title: "De la forme algébrique à la forme trigonométrique"
	# description: "On vous donne un nombre complexe sous sa forme algébrique. vous devez trouver sa forme trigonométrique, c'est à dire son module et son argument."
	# keyWords:["Géométrie", "Complexe", "Première"]

	return {
		init: (inputs) ->
			# On choisit un argument parmi ceux dont les cos et sin sont connus
			if inputs.a? then a = mM.toNumber inputs.a
			else
				a = mM.alea.number mM.trigo.angles()
				inputs.a = String a
			if inputs.m? then m = mM.toNumber inputs.m
			else
				m = mM.alea.number { min:1, max:10 }
				inputs.m = String m
			[
				mM.trigo.complexe(m,a)
				m
				mM.trigo.degToRad a
			]

		getBriques: (inputs, options) ->
			[z, m, angleRad] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Donnez le module et l'argument de &nbsp; $z=#{z.tex()}$."
								"<i>Donnez l'argument &nbsp; $\\theta$ &nbsp; en radians et en valeur principale, c'est à dire &nbsp; $-\\pi<\\theta\\leqslant \\pi$</i>."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$|z|"
							name:"m"
							description:"Module de z"
							good:m
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$\\theta"
							name:"a"
							description:"Argument de z"
							good:angleRad
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide", "pi"]
						}
						{
							type:"aide"
							rank: 5
							list: help.complexes.argument.concat help.complexes.module
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[z, m, angleRad] = that.init(inputs,options)
				return "$z = #{ z.tex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez le module et l'argument de &nbsp; $z$."
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
				[z, m, angleRad] = that.init(inputs,options)
				return "$z = #{ z.tex()}$"
			return {
				children: [
					"Donnez le module et l'argument de $z$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
