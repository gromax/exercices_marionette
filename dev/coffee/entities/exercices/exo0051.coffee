define ["utils/math","utils/help"], (mM, help) ->
	# id:51
	# title:"Loi uniforme"
	# description:"Calculer des probabilités avec la loi uniforme."
	# keyWords:["probabilités","uniforme","TSTL"]
	# options: {
	# 	a:{ tag:"Calcul $E(X)$" , options:["Oui", "Non"] }
	#	b:{ tag:"Calcul $\\sigma(X)$" , options:["Oui", "Non"] }
	#}

	return {
		init: (inputs) ->
			if (typeof inputs.Xmin is "undefined") then inputs.Xmin = mM.alea.real({min:-5, max:20})
			Xmin = Number inputs.Xmin
			if (typeof inputs.Xmax is "undefined") then inputs.Xmax = mM.alea.real({min:Xmin+10, max:100})
			Xmax = Number inputs.Xmax
			# Symbole d'inégalité à gauche
			symbs = ["","<","\\leqslant"]
			if (typeof inputs.sa is "undefined") then inputs.sa = mM.alea.real [0,1,2]
			sa = Number inputs.sa
			if sa is 0
				a = Xmin
				ens = "X"
			else
				if (typeof inputs.a is "undefined") then inputs.a = mM.alea.real({min:Xmin, max:Xmax-1})
				a = Number inputs.a
				ens = "#{a} #{symbs[sa]} X"
			if (typeof inputs.sb is "undefined")
				if sa is 0 then inputs.sb = mM.alea.real([1,2])
				else inputs.sb = mM.alea.real([0,1,2])
			sb = Number inputs.sb
			if sb is 0 then b = Xmax
			else
				if (typeof inputs.b is "undefined") then inputs.b = mM.alea.real({min:a+1, max:Xmax})
				b = Number inputs.b
				ens = "#{ens} #{symbs[sb]} #{b}"
			[Xmin, Xmax, a, b, ens]

		getBriques: (inputs,options) ->
			calcE = Number(options.a.value ? 0) is 0
			calcStd = Number(options.b.value ? 0) is 0

			[Xmin, Xmax, a, b, ens] = @init(inputs)

			items = [
				{
					type: "text"
					ps:[
						"La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi uniforme</b> sur &nbsp; $[#{Xmin};#{Xmax}]$."
						"<b>Remarque :</b> on note parfois &nbsp; $\\mathcal{U}([#{Xmin};#{Xmax}])$ &nbsp; cette loi."
					]
				}
				{
					type: "input"
					tag: "$p(#{ens})$"
					name: "pX"
					description: "Valeur à 0,01 près"
				}
				{
					type: "validation"
					clavier: ["aide"]
				}
				{
					type:"aide"
					list: [
						"Prenons un exemple : &nbsp; $\\mathcal{U}([11;25])$. On cherche &nbsp; $p(X<17)$."
						"D'abord, rappelons que si on remplace &nbsp; $<$ &nbsp; par &nbsp; $\\leqslant$, ça ne change rien."
						"Supposons que l'on ait un rectangle d'aire 100 %, allant de l'abscisse 11 à l'abscisse 25."
						"Quelle est l'aire du rectangle allant de 11 à 17 ? C'est la réponse à la question."
					]
				}
			]

			validations = {
				pX: "number"
			}

			verifications = [
				{
					name:"pX"
					tag: "$p(#{ens})$"
					good:(b-a)/(Xmax-Xmin)
					parameters: {
						arrondi: -2
					}
				}
			]

			if calcE
				items.push {
					type: "input"
					tag: "$E(X)$"
					name: "E"
					description: "Espérance à 0,01 près"
				}
				validations.E = "number"
				verifications.push {
					name:"E"
					tag: "$E(X)$"
					good: (Xmin+Xmax)/2
					parameters: {
						arrondi: -2
					}
				}

			if calcStd
				items.push {
					type: "input"
					tag: "$\\sigma(X)$"
					name: "sig"
					description: "Ecart-type à 0,01 près"
				}
				validations.E = "number"
				verifications.push {
					name:"sig"
					tag: "$\\sigma(X)$"
					good: (Xmax-Xmin)/Math.sqrt(12)
					parameters: {
						arrondi: -2
					}
				}


			[
				{
					bareme:100
					items: items
					validations: validations
					verifications: verifications
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			calcE = Number(options.a.value ? 0) is 0
			calcStd = Number(options.b.value ? 0) is 0

			fct_item = (inputs, index) ->
				[Xmin, Xmax, a, b, ens] = that.init(inputs)
				return "$X\\in [#{Xmin};#{Xmax}]$, calculer &nbsp; $p(#{ens})$."

			enonce = [
				"La variable aléatoire &nbsp; $X$ &nbsp; suit la <b>loi uniforme</b> sur &nbsp; $[X_{Min};X_{Max}]$."
				"Faites les calculs de probabilités à 0,01 près."
			]
			if calcE or calcStd
				sup = []
				if calcE then sup.push("l'espérance &nbsp; $E(X)$")
				if calcStd then sup.push("l'écart-type &nbsp; $\\sigma(X)$")
				enonce.push("Dans chaque cas, calculez aussi #{sup.join("&nbsp; et ")} &nbsp; à 0,01 près.")

			return {
				children: [
					{
						type: "text",
						children: enonce
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
			calcE = Number(options.a.value ? 0) is 0
			calcStd = Number(options.b.value ? 0) is 0

			fct_item = (inputs, index) ->
				[Xmin, Xmax, a, b, ens] = that.init(inputs)
				return "$X\\in [#{Xmin};#{Xmax}]$, calculer $p(#{ens})$."

			children = [
				"La variable aléatoire $X$ suit la \\textbf{loi uniforme} sur $[X_{Min};X_{Max}]$."
				"Faites les calculs de probabilités à 0,01 près."
			]

			if calcE or calcStd
				sup = []
				if calcE then sup.push("l'espérance $E(X)$")
				if calcStd then sup.push("l'écart-type $\\sigma(X)$")
				children.push("Dans chaque cas, calculez aussi #{sup.join(" et ")} à 0,01 près.")

			children.push({
				type: "enumerate",
				children: _.map(inputs_list, fct_item)
			})

			return {
				children:  children
			}
	}
