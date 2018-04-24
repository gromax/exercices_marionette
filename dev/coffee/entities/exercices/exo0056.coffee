define ["utils/math","utils/help"], (mM, help) ->
#	id:56
#	title:"Intervalle de fluctuation asymptotique"
#	description:"Dans le cadre de l'approximation d'une loi Binomiale par une loi Normale, calculer un intervalle de fluctuation asymptotique et prendre une décision."
#	keyWords:["probabilités","binomiale","normale", "Intervalle de fluctuation","TSTL"]

	return {
		init: (inputs,options) ->
			if (typeof inputs.n is "undefined") then n = inputs.n = mM.alea.real {min:40, max:400}
			else n = Number inputs.n
			if (typeof inputs.p is "undefined") then p = inputs.p = mM.alea.real({min:Math.ceil(5/n*100), max:19})
			else p = Number inputs.p
			esp = n*p/100
			std = Math.sqrt(esp*(100-p)/100)
			Xlow = esp - 1.96 * std
			Xhigh = esp + 1.96 * std

			if (typeof inputs.nf is "undefined") then nf = inputs.nf = Math.min(Math.round(Xhigh)+mM.alea.real({min:-2, max:2}), n)
			else nf = Number inputs.nf
			IF = {
				low: mM.misc.toPrecision(Xlow/n,2)
				high: mM.misc.toPrecision(Xhigh/n,2)
			}

			[
				p
				n
				esp
				std
				Xlow
				Xhigh
				nf
				IF
			]

		getBriques: (inputs, options) ->
			[p, n, esp, std, Xlow, Xhigh, nf,IF] = @init(inputs,options)

			[
				{
					bareme:40
					title: "Loi binomiale"
					items:[
						{
							type:"text"
							ps:[
								"Une usine fabrique des pièces de laboratoire."
								"Le fabriquant affirme que #{p} % des pièces sont non conformes."
								"On prélève au hasard #{n} pièces dans la production."
								"$X$ &nbsp; représente le nombre de pièces non conformes dans un échantillon."
								"On sait que &nbsp; $X$ &nbsp; suit une loi &nbsp; $\\mathcal{B}(#{n}\\,; #{p}\\,\\%)$."
								"Donnez les résultats des calculs suivants :"
							]
						}
						{
							type:"input"
							tag:"$E(X) =$"
							name:"esp"
							description:"Espérance à 0,01 près"
						}
						{
							type:"input"
							tag:"$\\sigma(X) =$"
							name:"std"
							description:"Écart-type à 0,01 près"
						}
						{
							type:"validation"
						}
					]

					validations:{
						esp:"number"
						std:"number"
					}

					verifications:[
						{
							name: "esp"
							tag:"$E(X)$"
							good:esp
							parameters: {
								arrondi: -2
							}
						}
						{
							name: "std"
							good: std
							tag:"$\\sigma(X)$"
							parameters: {
								arrondi: -2
							}
						}
					]
				}
				{
					bareme:30
					title: "Intervalle de fluctuation"
					items: [
						{
							type:"text"
							ps:[
								"On choisit d'approximer la loi de &nbsp; $X$ &nbsp; par une loi normale."
								"Déduisez-en l'intervalle de fluctuation asymptotique, au seuil de 95 %, de la fréquence de pièces non conformes dans un échantillon."
							]
						}
						{
							type:"input"
							format:[
								{ text: "$I_F =$", cols:2, class:"text-right" }
								{ text:"[", cols:1, class:"text-right h3"}
								{ name:"low", cols:2 }
								{ text:";", cols:1, class:"text-center h3"}
								{ name:"high", cols:2 }
								{ text:"]", cols:1, class:"h3"}
							]
						}
						{
							type:"validation"
						}
					]
					validations:{
						low:"number"
						high:"number"
					}
					verifications: [
						(pData)->
							verLow = mM.verification.isSame(pData.low.processed, IF.low, { arrondi:-3 })
							verHigh = mM.verification.isSame(pData.high.processed, IF.high, { arrondi:-3 })
							verLow.goodMessage.text = "Borne gauche : "+verLow.goodMessage.text
							verHigh.goodMessage.text = "Borne droite : "+verHigh.goodMessage.text
							{
								note: (verLow.note+verHigh.note)/2
								add: {
									type: "ul"
									list: [{
										type:"normal"
										text: "Vous avez répondu &nbsp; $I_F=\\left[#{pData.low.processed.tex} ; #{pData.high.processed.tex}\\right]$"
									}].concat(verLow.errors, [verLow.goodMessage], verHigh.errors, [verHigh.goodMessage])
								}
							}
					]
				}
				{
					bareme: 30
					title: "Décision"
					items:[
						{
							type:"text"
							ps:[
								"On a obtenu #{nf} pièces non conformes."
								"Faut-il accepter ou rejeter l'affirmation du fabriquant ?"
							]
						}
						{
							type:"radio"
							tag:"Décision"
							name:"d"
							radio:[
								"Accepter"
								"Refuser"
							]
						}
						{
							type:"validation"
						}
					]
					validations: {
						d: "radio:2"
					}
					verifications: [
						{
							name:"d"
							radio: [ "Accepter", "Refuser" ]
							good: if (nf>=Xlow) and (nf<=Xhigh) then 0 else 1
						}
					]


				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[p, n, esp, std, Xlow, Xhigh, nf,IF] = that.init(inputs, options)
				return {
					children: [
						{
							type: "text"
							children:[
								"$p=#{p}\\,\\%$ &nbsp; (en %), &nbsp; $n=#{n}$ &nbsp; et &nbsp; $k=#{nf}$."
							]
						}
					]
				}

			return {
				children: [
					{
						type:"text"
						ps: [
							"Une usine fabrique des pièces de laboratoire."
							"Le fabriquant affirme qu'une proportion &nbsp; $p$ &nbsp; des pièces sont non conformes."
							"On prélève au hasard &nbsp; $n$ &nbsp; pièces dans la production."
							"Soit &nbsp; $X$ &nbsp; le nombre de pièces non conformes dans un tel échantillon."
							"On sait que &nbsp; $X$ &nbsp; suit une loi binomiale."
							"Faites les calculs suivants pour les différents cas."
						]
					}
					{
						type: "enumerate"
						enumi: "a"
						children: [
							"L'espérance &nbsp; $E(X)$ &nbsp; et l'écart-type &nbsp; $\\sigma(X)$"
							"L'intervalle de fluctuation asymptotique au seuil de 95 \\%"
							"On a réalisé l'échantillon et obtenu &nbsp; $k$ &nbsp; pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"
						]
					}

					{
						type: "enumerate"
						enumi: "1"
						refresh:true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list,options) ->
			if inputs_list.length is 1
				[p, n, nf, Xlow, Xhigh, k_values, p_values, IF] = @init(inputs_list[0], options)
				return {
					children: [
						"Une usine fabrique des pièces de laboratoire."
						"Le fabriquant affirme qu'une proportion $p$ des pièces sont non conformes."
						"On prélève au hasard $n$ pièces dans la production."
						"Soit $X$ le nombre de pièces non conformes dans un tel échantillon."
						"On sait que $X$ suit une loi binomiale."
						{
							type: "enumerate"
							enumi: "1"
							children: [
								"L'espérance $E(X)$ et l'écart-type $\\sigma(X)$"
								"L'intervalle de fluctuation asymptotique au seuil de 95 \\%"
								"On a réalisé l'échantillon et obtenu #{nf} pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"
							]
						}
					]
				}

			else
				that = @
				fct_item = (inputs, index) ->
					[p, n, nf, Xlow, Xhigh, k_values, p_values, IF] = that.init(inputs, options)
					return "$p=#{p}$ (en \\%), $n=#{n}$ et $k=#{nf}$."

				return {
					children: [
						"Une usine fabrique des pièces de laboratoire."
						"Le fabriquant affirme qu'une proportion $p$ des pièces sont non conformes."
						"On prélève au hasard $n$ pièces dans la production."
						"Soit $X$ le nombre de pièces non conformes dans un tel échantillon."
						"On sait que $X$ suit une loi binomiale."
						"Faites les calculs suivants pour les différents cas."
						{
							type: "enumerate"
							enumi: "a"
							children: [
								"L'espérance $E(X)$ et l'écart-type $\\sigma(X)$"
								"L'intervalle de fluctuation asymptotique au seuil de 95 \\%"
								"On a réalisé l'échantillon et obtenu $k$ pièces non conformes. L'affirmation doit-elle être acceptée/rejetée ?"
							]
						}
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
