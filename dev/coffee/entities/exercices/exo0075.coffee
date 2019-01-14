define ["utils/math","utils/help", "utils/tab"], (mM, help, tab) ->

	return {
		init: (inputs) ->
			if typeof inputs.fct is "undefined"
				racines = (mM.alea.real({min:-5, max:15, no:[0,10]}) for i in [1..2]).sort()
				a = mM.alea.real({min:-2, max:5, no:[0]})
				# Les coeffs sont les racines
				b = (-racines[0] - racines[1])*a
				c = racines[0]*racines[1]*a
				d = mM.alea.real({min:-20, max:50})
				fct = mM.exec [a, 3, "/", "x", 3, "^", "*", b, 2, "/", "x", 2, "^", "*", c, "x", "*", d, "+", "+", "+"], { simplify:true }
				inputs.fct = String fct
				fder = fct.derivate("x").simplify()
				# Il pourrait arriver que les deux racines soient égales, il faut éviter le doublon
				if racines[0] == racines[1] then racines.pop()
			else
				fct = mM.parse(inputs.fct)
				fder = fct.derivate("x").simplify()
				poly = mM.polynome.make(fder)
				racines = (mM.polynome.solve.numeric poly, { bornes:{min:-6, max:11}, decimals: 0 }).sort()
			racinesInDef = _.filter racines, (item)->
				item >= 0 and item <= 10
			xs = [0].concat(racinesInDef).concat([10])
			texXs = _.map xs, (x) ->
				"$#{x}$"
			centres = ((xs[i]+xs[i+1])/2 for i in [0..xs.length-2])

			centresSignes = _.map centres, (x)->
				value = mM.float(fder, {x})
				if value>0 then "+"
				else "-"
			zs = [""].concat("z" for it in racinesInDef).concat([""])
			l = 2*xs.length-2
			tabSignLine = _.map [0..l], (i)->
				switch
					when i is 0 then ""
					when i is l then ""
					when i%2 is 0 then "z"
					else centresSignes[(i-1)/2]
			l = xs.length
			tabVarPos = _.map [0..l-1], (i) ->
				if i is 0
					if centresSignes[0] is "+" then "-"
					else "+"
				else
					pos = centresSignes[i-1]
					nex = centresSignes[i]
					if pos isnt nex then pos
					else "R"

			[
				fct,
				fder,
				racinesInDef,
				xs,
				texXs,
				centresSignes,
				tabSignLine,
				tabVarPos
			]



		getBriques: (inputs, options, fixedSettings) ->
			[ fct, fder, racinesInDef, xs, texXs, centresSignes, tabSignLine, tabVarPos] = @init(inputs)
			signButtons = _.map tabSignLine, (it) ->
				if it is "+" or it is "-" then "+|button"
				else it
			varButtons = _.map tabVarPos, (it) ->
				if it is "+" or it is "-" then "+/$\\bullet$|button"
				else it
			goodVar = _.map tabVarPos, (it) ->
				if it is "+" or it is "-" then "#{it}/$\\bullet$"
				else it

			tabSign = tab.make(texXs, { hauteur_ligne:30 })
			tabSign.addSignLine(signButtons, { tag: "$f'(x)$"})

			tabVar = tab.make(texXs, { hauteur_ligne:30 })
			tabVar.addSignLine(tabSignLine, { tag: "$f'(x)$"})
			tabVar.addVarLine(varButtons)

			goodTabVar = tab.make(texXs, { hauteur_ligne:30 })
			goodTabVar.addSignLine(tabSignLine)
			goodTabVar.addVarLine(goodVar)

			[
				{
					title: "Expression de $f'$"
					bareme: 20
					items: [
						{
							type: "text"
							ps: [
								"Soit $f(x) = #{fct.tex()}$ définie sur $[0;10]$"
								"Donnez l'expression de $f'$, fonction dérivée de $f$."
							]
						}
						{
							type: "input"
							format: [
								{ text: "$f'(x) =$", cols:3, class:"text-right" }
								{ latex: true, cols:9, name:"d"}
							]
						}
						{
							type: "validation"
							clavier: ["aide", "pow"]
						}
						{
							type: "aide"
							list: help.derivee.basics
						}
					]
					validations:{
						d:"number"
					}
					verifications:[
						{
							name:"d"
							good: fder
							tag:"$f'(x)$"
						}
					]
				}
				{
					bareme:20
					title: "Racines de $f'(x)$"
					items: [
						{
							type: "text"
							ps:[
								"Donnez les racines de &nbsp; $f'(x)$ &nbsp; comprises dans $[0;10]$."
								"Séparez les solutions par ;"
								"Si aucune solution, entrez ∅"
							]
						}
						{
							type: "input"
							format: [
								{ text:"$\\mathcal{S} = $", cols:3, class:"text-right" }
								{ name:"s", cols:8, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["empty", "sqrt", "aide"]
						}
						{
							type: "aide"
							list: help.trinome.racines
						}
					]
					validations:{
						s:"liste"
					}
					verifications:[
						{
							name:"s"
							type:"all"
							tag:"$\\mathcal{S}$"
							good: racinesInDef
						}
					]
				}
				{
					title: "Tableau de signe de $f'$"
					bareme: 30
					items: [
						{
							type: "text"
							ps: [
								"Complétez le tableau de signe ci-dessous en ajustant les signes."
								"Vous devez cliquer sur les cases grises pour changer les signes correspondant."
								"Validez quand vous avez terminé"
							]
						}
						{
							type:"svg"
							renderingFunctions:[
								(view) -> tabSign.render(view.draw, view.$el.width())
							]
							getData: (view) ->
								{ signs: tabSign.lines[1].toString() }
							postVerificationRender: (view, data)->
								line = tabSign.lines[1]
								line.toggleLock()
								line.setPos(data.signs.processed)
								line.renderRight()
						}
						{
							type: "validation"
						}
					]
					validations:{
						signs: "none"
					}
					verifications: [
						(data) ->
							user = _.filter data.signs.processed.split(","), (it)->
								it is "+" or it is "-"
							good = 0
							for it, i in centresSignes
								if it is user[i] then good++
							note = good/centresSignes.length
							if note is 1
								messages = [{
									type: "success"
									text: "Bonne réponse."
								}]
							else
								messages = [{
									type: "error"
									text: "Il y a des erreurs dans votre tableau. Vous pouvez voir la bonne réponse dans la question suivante."
								}]
							{
								note: note
								add:[
									{
										type:"ul"
										list: messages
									}
								]
							}
					]

				}
				{
					title: "Variations de $f$"
					bareme: 30
					items: [
						{
							type: "text"
							ps: [
								"Complétez le tableau de variations ci-dessous en ajustant les flèches."
								"Vous devez cliquer sur les cases grises pour changer les position des symboles correspondants."
								"Validez quand vous avez terminé"
							]
						}
						{
							type:"svg"
							renderingFunctions:[
								(view) -> tabVar.render(view.draw, view.$el.width())
							]
							getData: (view) ->
								{ vars: tabVar.lines[2].getPos() }
							postVerificationRender: (view, data)->
								line = tabVar.lines[2]
								line.toggleLock()
								line.setPos(data.vars.processed)
								line.renderRight()
						}
						{
							type: "validation"
						}
					]
					validations:{
						vars: "none"
					}
					verifications: [
						(data) ->
							user = data.vars.processed.split("")
							good = 0
							for it, i in tabVarPos
								if it is user[i] then good++
							note = good/tabVarPos.length
							if note is 1
								{
									note: 1
									add: [
										{
											type: "ul"
											list: [{
												type: "success"
												text: "Bonne réponse."
											}]
										}
									]
								}
							else
								{
									note: note
									add:[
										{
											type:"ul"
											list: [{
												type: "error"
												text: "Il y a des erreurs dans votre tableau. Correction ci-dessous."
											}]
										}
										{
											type:"svg"
											renderingFunctions:[
												(view) -> goodTabVar.render(view.draw, view.$el.width())
											]
										}
									]
								}
					]

				}

			]

		getExamBriques: (inputs_list,options, fixedSettings) ->
			that = @
			complexes = fixedSettings.complexe
			fct_item = (inputs, index) ->
				[ fct, fder, racinesInDef, xs, texXs, centresSignes, tabSignLine, tabVarPos] = @init(inputs)
				return "$f(x) = #{fct.tex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Dans chaque cas, on donne l'expression d'une fonction &nbsp;$f$ &nbsp; définie sur &nbsp; $[0;10]$."
							"Vous devez donner la dérivée de cette fonction, étudiez son signe et en déduire ses variations."
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

		getTex: (inputs_list, options, fixedSettings) ->
			that = @

			fct_item = (inputs, index) ->
				[ fct, fder, racinesInDef, xs, texXs, centresSignes, tabSignLine, tabVarPos] = @init(inputs)
				return "$f(x) = #{fct.tex()}$"

			if inputs_list.length is 1
				sujet = [
					"On vous donne l'expression d'une fonction $f$ définie sur $[0;10]$."
					"Vous devez donner la dérivée de cette fonction, étudiez son signe et en déduire ses variations."
				]
				return {
					children: sujet.concat fct_item(inputs_list[0],0)
				}
			else
				sujet = [
					"Dans chaque cas, on donne l'expression d'une fonction $f$ définie sur $[0;10]$."
					"Vous devez donner la dérivée de cette fonction, étudiez son signe et en déduire ses variations."
				]

				return {
					children: sujet.concat [
						{
							type: "enumerate"
							enumi: "1)"
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
