define ["utils/math", "utils/help"], (mM, help) ->

	# id:31
	# title: "Conversion entre degré et radians"
	# description: "Transformer une mesure en degrés en une mesure en radians et réciproquement."
	# keyWords:["Géométrie", "Trigonométrie", "Seconde"]

	return {
		init: (inputs) ->
			if inputs.r? then r = mM.toNumber inputs.r
			else
				r = mM.alea.number { values:{min:1, max:12, sign:true}, denominator:{min:2, max:6} }
				inputs.r = String r
			r = mM.exec [r, "pi", "*"], {simplify:true}

			if inputs.d? then d = mM.toNumber inputs.d
			else
				d = mM.alea.number { min:1, max:25, coeff:15 }
				inputs.d = String d

			[
				r
				mM.trigo.radToDeg r
				d
				mM.trigo.degToRad d
			]

		getBriques: (inputs, options) ->
			[r,gRtD,d,gDtR] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On donne &nbsp; $\\alpha = #{r.tex()}$ &nbsp; en radians."
								"Il faut donner la mesure de &nbsp; $\\alpha$ &nbsp; en degrés."
								"On donne &nbsp; $\\beta = #{d.tex()}$ &nbsp; en degrés."
								"Il faut donner la mesure de &nbsp; $\\beta$ &nbsp; en radians."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name: "rtd"
							tag:"$\\alpha$"
							description:"Mesure en degrés"
							good:gRtD
						}
						{
							type: "input"
							rank: 3
							waited: "number"
							name:"dtr"
							tag:"$\\beta$"
							description:"Mesure en radians"
							good:gDtR
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide", "pi"]
						}
						{
							type: "aide"
							rank: 5
							list: help.trigo.rad_deg.concat help.trigo.pi
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[r,gRtD,d,gDtR] = that.init(inputs,options)
				return "$\\alpha =#{r.tex()}$ &nbsp; radians et &nbsp; $\\beta = #{d.tex()}$ degrés"

			return {
				children: [
					{
						type: "text",
						children: [
							"Convertissez &nbsp; $\\alpha$ &nbsp; en degrés et &nbsp; $\\beta$ &nbsp; en radians."
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
				[r,gRtD,d,gDtR] = that.init(inputs,options)
				return "$\\alpha =#{r.tex()}$ radians et $\\beta = #{d.tex()}$ degrés"

			return {
				children: [
					"Convertissez $\\alpha$ en degrés et $\\beta$ en radians."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}



	}
