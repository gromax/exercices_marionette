define ["utils/math","utils/help"], (mM, help) ->
#	id:24
#	title:"Loi binomiale"
#	description:"Calculer des probabilités avec la loi binomiale."
#	keyWords:["probabilités","binomiale","Première"]

	return {
		init: (inputs) ->
			if (typeof inputs.n is "undefined") then inputs.n = n = mM.alea.real {min:10, max:40}
			else n = Number inputs.n
			if (typeof inputs.p is "undefined") then inputs.p = p = mM.alea.real({min:1, max:99})
			else p = Number inputs.p
			if p<1 then p = Math.round(p*100) # problème de compatibilité avec ancienne version
			if (typeof inputs.k is "undefined") then inputs.k = k = Math.round(inputs.n*inputs.p/100)
			else k = Math.min(Number inputs.k, n-1)
			[
				n
				p
				k
				mM.distribution.binomial(n, p, k)
				mM.repartition.binomial(n, p, k)
			]

		getBriques: (inputs,options) ->
			[n, p, k, pXegalK_good, pXinfK_good] = @init(inputs)

			[
				{
					bareme:100
					title:"Calculs de probabilités"
					items:[
						{
							type:"text"
							ps:[
								"La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi binomiale</b> de paramètres &nbsp; $n = #{n}$ &nbsp; et &nbsp; $p = #{p}\\,\\%$."
								"<b>Remarque :</b> on note &nbsp; $\\mathcal{B}(#{n}\\,;#{p}\\,\\%)$ &nbsp; cette loi."
								"Calculez les probabilités suivantes à 0,001 près."
							]
						}
						{
							type:"input"
							tag:"$p(X=#{inp.k})$"
							name:"pXegalK"
							description:"Valeur à 0,001 près"
						}
						{
							type:"input"
							tag:"$p(X\\leqslant #{inp.k})$"
							name:"pXinfK"
							description:"Valeur à 0,001 près"
						}
						{
							type:"validation"
							clavier:["aide"]
						}
						{
							type:"aide"
							list: help.proba.binomiale.calculette
						}
					]
					validations:{
						pXegalK: "number"
						pXinfK: "number"
					}
					verifications: [
						{
							name:"pXegalK"
							tag: "$p(X=#{inp.k})$"
							good: pXegalK_good
							parameters: {
								arrondi: -3
							}
						}
						{
							name:"pXinfK"
							tag: "$p(X=#{inp.k})$"
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
				[n, p, k, pXegalK_good, pXinfK_good] = that.init(inputs)
				return "$n = #{n}$ &nbsp; ; &nbsp; $p = #{p}\\,\\%$ &nbsp; et &nbsp; $k=#{k}$."

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans tous les cas, &nbsp; $X$ est une variable aléatoire qui suit la loi &nbsp; $\\mathcal{B}(n\\,; p)$."
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
				[n, p, k, pXegalK_good, pXinfK_good] = that.init(inputs)
				return "$n = #{n}$ ; $p = #{p}\\,\\%$ et $k=#{k}$."

			return {
				children: [
					"Dans tous les cas, $X$ est une variable aléatoire qui suit la loi $\\mathcal{B}(n\\,; p)$."
					"Dans les cas suivants, calculez les probabilités à 0,01 près."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
