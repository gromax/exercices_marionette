define ["utils/math","utils/help"], (mM, help) ->
#	id:22
#	title:"Développer une expression"
#	description:"Une expression est donnée, il faut la développer."
#	keyWords:["Algèbre", "fonction"]
#	options: {
#		a:{ tag:"Difficulté" , options:["Alea", "Facile", "Facile avec fraction", "Moyen", "Moyen avec fraction"] , def:0 }
#	}

# à améliorer, pas de gestion d'une liste de réponses progressives

	return {
		init: (inputs, options) ->
			if inputs.p? then poly = mM.toNumber inputs.p
			else
				optA = Number(options.a.value ? 0)
				if optA is 0 then optA = mM.alea.in [1,2,3]
				switch optA
					when 2 then poly = mM.exec [@aleaMult(0,false), @aleaMult(2,true), "+"]
					when 3 then poly = mM.exec [@aleaMult(2,false), @aleaMult(2,false), "+"]
					when 4 then poly = mM.exec [@aleaMult(2,false), @aleaMult(2,true), "+"]
					else poly = mM.exec [@aleaMult(0,false), @aleaMult(2,false), "+"]
				inputs.p = String poly
			[
				poly
				polyTex = polyTex = poly.tex()
				polyDev = mM.exec [ poly ], { simplify:true, developp:true }
				polyDevTex = "P(x)="+polyDev.tex()
			]

		aleaMult:(degreTotal,fraction)->
			# On cherche à obtenir un produit d'expressions dont le produit dont le degre est degreTotal
			expr_array = []
			if degreTotal is 0 then expr_array.push mM.alea.number({min:1, max:50})
			else
				total = 0
				n = 0
				while total<degreTotal
					# On génère un polynome de degré aléatoire
					new_degre = mM.alea.real { min:1, max:degreTotal-Math.max(total,1) }
					new_poly = mM.alea.poly { degre:new_degre, coeffDom:{min:1, max:10, sign:true}, values:{min:-10, max:10} }
					# On envisage de mettre ce polynome au carré si cela passe :
					if (total+2*new_degre<=degreTotal) and mM.alea.dice(1,3)
						total += new_degre*2
						expr_array.push(new_poly, 2, "^")
					else
						total+=new_degre
						expr_array.push new_poly
					n += 1
					if n>1 then expr_array.push("*")
			if fraction then expr_array.push(mM.alea.number({min:2, max:9}), "/")
			if mM.alea.dice(1,3) then expr_array.push "*-"
			mM.exec expr_array


		getBriques: (inputs, options) ->
			[poly, polyTex, polyDev, polyDevTex] = @init(inputs, options)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"Développez l'expression suivante :"
								"$P(x) = #{polyTex}$"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$P(x) =$", cols:3, class:"text-right" }
								{ latex: true, cols:9, name:"p"}
							]
						}
						{
							type: "validation"
							clavier: ["pow"]
						}
					]
					validations: {
						p:"number"
					}
					verifications: [
						(data) ->
							parameters = {
								developp: true
								p_forme: 2
								formes: "FRACTION"
							}
							ver = mM.verification.isSame(data.p.processed, polyDev, parameters )

							list = [
								{ type:"normal", text:"Vous avez répondu &nbsp; $P(x) = #{data.p.processed.tex}$" }
							]

							unfinished = false
							switch ver.note
								when 0 then list.push { type:"error", text:"La bonne réponse était &nbsp; $P(x) = #{polyDevTex}$."}
								when 2
									# cela veut dire qu'il faut améliorer l'affichage
									ver.note = 0
									unfinished = true
								when 1 then list.push { type:"success", text:"Bonne réponse." }
								else
									list.push { type:"error", text:"La bonne réponse était &nbsp; $P(x) = #{polyDevTex}$."}

							out = {
								note: ver.note
								add: {
									type:"ul"
									list: list.concat(ver.errors)
								}
								unfinished: unfinished
							}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[poly, polyTex, polyDev, polyDevTex] = that.init(inputs, options)
				return "$P_{#{index}}(x) = #{polyTex}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Développez les expressions suivantes."
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
				[poly, polyTex, polyDev, polyDevTex] = that.init(inputs, options)
				return "$P_{#{index}}(x) = #{polyTex}$"

			return {
				children: [
					"Développez les expressions suivantes."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}
	}
