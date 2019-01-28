define ["utils/math","utils/help"], (mM, help) ->
	return {
		init: (inputs) ->
			if (typeof inputs.l is "undefined") then inputs.l = l10 = mM.alea.real {min:1, max:50} # l10 est lambda*10
			else l10 = Number inputs.l
			if (typeof inputs.k is "undefined") then inputs.k = k = mM.alea.real {min:0, max:Math.round(1.5*l10/10)}
			else k = Number inputs.k
			[
				l10/10
				k
				mM.distribution.poisson(l10/10, k)
				mM.repartition.poisson(l10/10, k)
			]

		getBriques: (inputs,options) ->
			[l, k, pXegalK_good, pXinfK_good] = @init(inputs)

			[
				{
					bareme:100
					title:"Calculs de probabilités"
					items:[
						{
							type:"text"
							ps:[
								"La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi de poisson</b> de paramètre &nbsp; $\\lambda = #{mM.misc.numToStr(l)}$."
								"Calculez les probabilités suivantes à 0,001 près."
							]
						}
						{
							type:"input"
							format:[
								{ text:"p(X=#{k}) =", cols:3, class:"text-right"}
								{ name:"pXegalK", cols:3, latex:false }
								{ text:" à 0,001 près", cols:3}
							]
						}
						{
							type:"input"
							format:[
								{ text:"p(X≤#{k}) =", cols:3, class:"text-right"}
								{ name:"pXinfK", cols:3, latex:false }
								{ text:" à 0,001 près", cols:3}
							]
						}
						{
							type:"validation"
						}
					]
					validations:{
						pXegalK: "number"
						pXinfK: "number"
					}
					verifications: [
						{
							name:"pXegalK"
							tag: "p(X=#{k})"
							good: pXegalK_good
							parameters: {
								arrondi: -3
							}
						}
						{
							name:"pXinfK"
							tag: "p(X≤#{k})"
							good: pXinfK_good
							parameters: {
								arrondi: -3
							}
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[l, k, pXegalK_good, pXinfK_good] = that.init(inputs)
				return "$\\lambda = #{mM.misc.numToStr(l)}$ &nbsp; et &nbsp; $k=#{k}$."

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans tous les cas, &nbsp; $X$ est une variable aléatoire qui suit la loi de Poisson de paramètre &nbsp; $\\lambda$."
							"Calculez à chaque fois &nbsp; $p(X=k)$ &nbsp; et &nbsp; $p(X\\leqslant k)$ &nbsp; à 0,001 près."
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
				[l, k, pXegalK_good, pXinfK_good] = that.init(inputs)
				return "$\\lambda = #{mM.misc.numToStr(l)}$ et $k=#{k}$."

			return {
				children: [
					"Dans tous les cas, $X$ est une variable aléatoire qui suit la loi de Poisson de paramètre $\\lambda$."
					"Dans les cas suivants, calculez les probabilités à 0,01 près."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
