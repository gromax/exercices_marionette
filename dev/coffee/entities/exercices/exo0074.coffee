define ["utils/math","utils/help"], (mM) ->
	return {
		generateExp: (X,ops,onRight, it) ->
			pile = ["x"]
			for i in [1..it]
				[pile, ops, X, onRight] = @generateExprElem(pile, ops, X, onRight)
			return [pile,X, onRight]

		generateExprElem: (pile, ops, X, onRight) ->
			# pile est la pile des opérations à faire pour obtenir l'expression voulue
			# ops est la liste des opérations disponibles
			# X est la valeur courante du résultat de la pile, nombre ou inf
			# onRight est vrai pour +inf ou pour nombre+, false sinon

			op = mM.alea.in ops
			switch op
				when "sq"
					pile.push(2, "^")
					if X is "inf"
						X = "inf"
						onRight = true
					else
						if X<0 then onRight = not onRight
						X = X*X
					ops = ops.filter (o)-> o isnt "sq"
				when "ln"
					if X is "inf"
						if onRight then a = mM.alea.real({min:1, max:10})
						else a = mM.alea.real({min:-10, max:-1})
						pile.push(
							a,
							"*",
							mM.alea.real({min:1, max:10}),
							"+",
							"ln"
						)
						onRight = true
					else
						if onRight
							pile.push(
								X,
								"-",
								"ln"
							)
						else
							pile.unshift X
							pile.push("-", "ln")
						X = "inf"
						onRight = false
					# je ne veux pas de mélange ln et exp
					ops = ops.filter (o)-> o isnt "ln" and o isnt "exp"
				when "exp"
					if X is "inf"
						pile.push(
							mM.alea.real({min:1, max:100})/10,
							"*",
							mM.alea.real({min:1, max:10}),
							"+",
							"exp"
						)
						if onRight
							X = "inf"
						else
							X = 0
							onRight = false
						ops = ops.filter (o)-> o isnt "ln" and o isnt "exp"
						# je ne veux pas de mélange ln et exp
					# sinon on ne fait rien
				when "inv"
					if X is "inf"
						pile.unshift 1
						pile.push "/"
						X = 0
					else
						pile.unshift 1
						pile.push(X, "-", "/")
						X = "inf"
					ops = ops.filter (o)-> o isnt op
				when "add"
					a = mM.alea.real({min:-10, max:10})
					pile.push(
						a,
						"+"
					)
					if X isnt "inf" then X = X+a
					ops = ops.filter (o)-> o isnt op
			# si on ne tombe sur aucun de ces cas, alors les valeurs ne sont pas changées
			# du carré n'est possible qu'au premier coup, pas de carré de formule compliquée
			ops = ops.filter (o)-> o isnt "sq"

			return [pile, ops, X, onRight]

		init: (inputs, options) ->
			optA = Number(options.a.value ? 0) is 0
			if typeof inputs.par isnt "undefined"
				[xl,gd,expr] = inputs.par.split(";")
				good = mM.parse(gd)
				if xl is "+\\infty" or xl is "-\\infty"
					if gd is "∞" or gd is "-∞"
						asym = { type: "∅", good: "∅" }
					else
						asym = { type: "y", value: good, good: "$y = #{good.tex()}$" }
				else
					if gd is "∞" or gd is "-∞"
						asym = { type: "x", value: good, good: "$x = #{good.tex()}$" }
					else
						asym = { type: "∅", good: "∅" }

			else
				if mM.alea.dice(3,4)
					X = "inf"
					onRight = true
				else
					X = mM.alea.real({min:0, max:10})
					onRight = true
				ops = ["add", "sq", "inv", "sq"]
				if optA then ops.push("exp", "ln")

				if mM.alea.dice(1,2)
					# On envisage 2 termes qui s'ajoutent
					[pile1,X1,o1] = @generateExp(X,ops,onRight,3)
					[pile2,X2,o2] = @generateExp(X,ops,onRight,3)
					if X1 is "inf"
						gX = "inf"
						gO = o1
						pile = pile1.concat pile2
						if X2 is "inf" and o1 isnt o2
							pile.push "-"
						else
							pile.push "+"
					else
						pile = pile1.concat pile2
						pile.push "+"
						if X2 is "inf"
							gX = "inf"
							gO = o2
						else
							gX = X1 + X2
				else
					[pile, gX, gO] = @generateExp(X,ops,onRight,5)
				expr = mM.exec(pile, { simplify:true, developp:true }).tex()
				if X is "inf"
					if onRight then xl = "+\\infty"
					else "-\\infty"
				else
					if onRight then xl = X+"^+"
					else xl = X+"^-"
				if gX is "inf"
					if X is "inf"
						asym = { type:"∅", good: "∅"}
					else
						asym = { type:"x", value: X, good: "$x = #{X}$"}
					if gO then good = mM.exec ["infini"]
					else good = mM.exec ["infini", "*-"]
				else
					if X is "inf"
						asym = { type:"y", value: gX, good:"$y = #{gX}$" }
					else
						asym = { type:"∅", good: "∅"}
					good = mM.exec [gX]
				inputs.par = [xl, good, expr].join(";")
			texLim = "\\displaystyle \\lim_{x \\to #{xl}}"
			[texLim, expr, good, asym]

		getBriques: (inputs, options) ->
			[texLim, expr, good, asym] = @init(inputs,options)

			[
				{
					title: "Limite"
					bareme: 70
					items: [
						{
							type: "text"
							ps: [
								"Soit $f(x) = #{expr}$"
								"Donnez la limite $#{texLim} f(x)$."
								"<i><b>Remarque :</b> on pourra écrire, pour l'infini positif, ∞ au lieu de +∞, mais dans vos copies, pensez à écrire +∞ !</i>"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$#{texLim} f(x) =$", cols:4, class:"text-right" }
								{ latex: true, cols:8, name:"l"}
							]
						}
						{
							type: "validation"
							clavier: [ "infini"]
						}
					]
					validations:{
						l:"number"
					}
					verifications:[
						{
							name: "l"
							good: good
							tag: "Limite"
						}
					]
				}
				{
					title: "Asymptote"
					bareme: 30
					items: [
						{
							type: "text"
							ps: [
								"On trace la courbe de $f$ dans un repère."
								"La limite ci-dessus correspond-elle à une asymptote ?"
								"Si non, répondez ∅ ; si oui, donnez l'équation de cette asymptote."
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\mathcal{D} :$", cols:3, class:"text-right" }
								{ latex: true, cols:9, name:"e"}
							]
						}
						{
							type: "validation"
							clavier: ["empty"]
						}
					]
					validations: {
						e: (user)->
							if user is "∅" or user is "\\varnothing"
								out = { processed: [], user:"∅", userType: "∅" }
							else
								pattern =/(y|x)\s*=\s*([-0-9.,]+)/
								result = pattern.exec(user)
								if result
									# result est un tableau ["x,y=expr", "x,y", "expr"]
									out = mM.verification.numberValidation(result[2], {})
									out.user = user
									out.userType = result[1]
								else
									out = { processed:false, user:user, error:"L'équation doit être de la forme y = nombre ou x = nombre" }
							out
					}
					verifications:[
						(data) ->
							if data.e.userType isnt asym.type
								return {
									note: 0
									add: {
										type:"ul"
										list: [
											{ type:"normal", text:"Vous avez répondu #{data.e.user}" }
											{ type:"error", text:"La bonne réponse était #{asym.good}" }
										]
									}
								}
							else
								if data.e.userType is "∅"
									return {
										note: 100
										add: {
											type:"ul"
											list: [
												{ type:"normal", text:"Vous avez répondu #{data.e.user}" }
												{ type:"success", text:"C'est une bonne réponse." }
											]
										}
									}
								else
									ver = mM.verification.isSame(data.e.processed, asym.value, { } )
									if ver.note is 0
										return {
											note: 50
											add: {
												type:"ul"
												list: [
													{ type:"normal", text:"Vous avez répondu #{data.e.user}" }
													{ type:"error", text:"La bonne réponse était #{asym.good}" }
												]
											}
										}
									else
										return {
											note: 100
											add: {
												type:"ul"
												list: [
													{ type:"normal", text:"Vous avez répondu #{data.e.user}" }
													{ type:"success", text:"C'est une bonne réponse." }
												]
											}
										}
					]
				}
			]


		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[texLim, expr, good, asym] = that.init(inputs,options)
				return "$#{texLim} f(x)$ avec $f(x) = #{expr}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans tous les cas, déterminer la limite et indiquer si cette limite correspond à une asymptote pour $\\mathcal{C}_f$. Si oui, donner l'équation de cette asymptote."
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
			optE = Number(options.e.value ? 0)
			that = @
			fct_item = (inputs, index) ->
				[texLim, expr, good, asym] = that.init(inputs,options)
				return "$#{texLim} f(x)$ avec $f(x) = #{expr}$"

			return {
				children: [
					"Dans tous les cas, déterminer la limite et indiquer si cette limite correspond à une asymptote pour $\\mathcal{C}_f$. Si oui, donner l'équation de cette asymptote."
					{
						type: "enumerate",
						refresh:true
						enumi:"1",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
