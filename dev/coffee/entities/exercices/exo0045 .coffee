define ["utils/math","utils/help"], (mM, help) ->
	# id:45
	# title: "De la forme trigonométrique à la forme algébrique"
	# description: "On vous donne un nombre complexe sous sa forme trigonométrique. vous devez trouver sa forme algébrique."
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
				m = mM.alea.number {min:1, max:10}
				inputs.m = String m
			[
				mM.trigo.complexe(m,a)
				m
				mM.trigo.degToRad(a)
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
								"Donnez &nbsp; $z$ &nbsp; sous sa <b>forme algébrique</b> &nbsp; $z = x+iy$ &nbsp; sachant que &nbsp; $|z|=#{m.tex()}$ &nbsp; et &nbsp; $Arg(z) = #{angleRad.tex()}$ &nbsp; <i>en radians</i>"
							]
						}
						{
							type: "ul"
							rank: 2
							list:[{
								type:"warning"
								text: "Attention, si vous écrivez &nbsp; $i\\sqrt{\\cdots}$, mettez une espace : i sqrt(...) ou le signe de multiplication : i*sqrt(...)"
							}]
						}

						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$z$"
							name:"z"
							description:"Forme x+iy"
							good:z
						}
						{
							type: "validation"
							rank: 6
							clavier: ["aide", "sqrt"]
						}
						{
							type: "aide"
							rank: 7
							list: help.complexes.trigo_alg
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[z, m, angleRad] = that.init(inputs,options)
				return "$|z| = #{ m.tex()}$ &nbsp; et &nbsp; $arg(z)=#{angleRad}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez &nbsp; $z$ &nbsp; sous sa forme algébrique."
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
				return "$|z| = #{ m.tex()}$ et $arg(z)=#{angleRad}$"

			return {
				children: [
					"Donnez $z$ sous sa forme algébrique."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
