define ["utils/math","utils/help"], (mM, help) ->
	return {
		init: (inputs) ->
			# ou u0 et u(n+1) = q.u(n) => 2 params
			u0 = false
			if typeof inputs.v isnt "undefined"
				values = inputs.v.split(";")
				q = (900 + Number values[0])/1000
				u0 = Number values[1]
				n0 = Number values[2]
				nf = Number values[3]
			else
				values = []
				values[0] = mM.alea.real { min:0, max:200, no:[100] }
				q = 900 + values[0]
				u0 = values[1] = mM.alea.real { min:1, max:20 }
				n0 = values[2] = mM.alea.real { min:0, max:5 }
				nf = values[3] = mM.alea.real { min:n0+10, max:n0+30 }
				inputs.v = values.join(";")
				expr = "u_{n+1} = #{mM.exec([q/1000, "symbol:u_n", "*"]).tex()}"
				qq = q/1000
				s = u0*Math.pow(qq,n0)*(1-Math.pow(qq,nf-n0+1))/(1-qq)

			[
				expr # expression
				s # valeur limite
				u0
				n0
				nf
			]

		getBriques: (inputs,options) ->
			[expr, s, u0, n0, nf] = @init(inputs)

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							ps:[
								"On considère la suite &nbsp; $\\left(u_n\\right)$."
								"Son premier terme est &nbsp; $u_0 = #{u0}$ &nbsp; et &nbsp; $#{expr}$."
								"Donnez &nbsp; $S = \\displaystyle \\sum_{n=#{n0}}^{#{nf}} u_n$ &nbsp; à 0,1 près."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$S=$", cols:2, class:"text-right" }
								{ cols:10, name:"s" }
							]
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list:[
								"La formule est &nbsp; $\\displaystyle \\sum_{n=a}^b = u_a \\cdot \\frac{1-q^N}{1-q}$ &nbsp; avec &nbsp; $N=b-a+1$."
							]
						}
					]
					validations:{
						s: "number"
					}
					verifications:[
						{
							name:"s"
							tag:"$S$"
							good: s
							parameters: {
								arrondi: -1
							}
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[expr, s, u0, n0, nf] = that.init(inputs)
				return "$u_0 = #{u0}$ et $#{expr}$. Calculer $S = \\displaystyle \\sum_{n=#{n0}}^{#{nf}} u_n$."

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans chaque cas suivants, donnez la somme à 0,1 près."
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

			if inputs_list.length is 1
				[expr, s, u0, n0, nf] = that.init(inputs_list[0])
				return {
					children: [
						"On considère la suite de premier terme $u_0)#{u0}$ et telle que $#{expr}$."
						"Calculer $S = \\displaystyle \\sum_{n=#{n0}}^{#{nf}} u_n$ à 0,1 près."
					]
				}
			else
				fct_item = (inputs, index) ->
					[expr, s, u0, n0, nf] = that.init(inputs)
					return"$u_0 = #{u0}$ et $#{expr}$. Calculer $S = \\displaystyle \\sum_{n=#{n0}}^{#{nf}} u_n$."

				return {
					children: [
							"Dans chaque cas suivants, donnez la somme à 0,1 près."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
