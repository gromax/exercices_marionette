define ["utils/math", "utils/help", "utils/colors", "utils/tab"], (mM, help, colors, TabVarApi) ->
	# id:39
	# title:"Associer tableaux de variations et fonctions du second degré"
	# description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer le tableau qui lui correspond."
	# keyWords:["Analyse","Fonction","Tableau de variation", "Forme canonique", "Second degré","Seconde"]

	# debug : tex à faire

	return {
		init: (inputs) ->
			max = 15
			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..3])
				inputs.ranks = ranks.join(";")
			liste = [{cano:true, convexe:true}, {cano:true, convexe:false}, {cano:false, convexe:true}, {cano:false, convexe:false}]

			iteratee = (i)->
				cas = liste[i]

				if (typeof inputs["xA"+i] isnt "undefined") and (typeof inputs["yA"+i] isnt "undefined") and (typeof inputs["xB"+i] isnt "undefined") and (typeof inputs["yB"+i] isnt "undefined") and (typeof inputs["c"+i] isnt "undefined")
					xA = Number inputs["xA"+i]
					yA = Number inputs["yA"+i]
					xB = Number inputs["xB"+i]
					yB = Number inputs["yB"+i]
					cano = Boolean inputs["c"+i]
				else
					# On tire au hasard 4 pts et on calcule la fonction correspondante
					# En tenant compte du cas présent
					xA = inputs["xA"+i] = xB = mM.alea.real { min:-max, max:max }
					xB = inputs["xB"+i] = mM.alea.real({ min:-max, max:max }) while (xA is xB)
					if cas.convexe
						yA = inputs["yA"+i] = mM.alea.real { min:1, max:max-1 }
						yB = inputs["yB"+i] = mM.alea.real { min:-max, max:yA-1 }
					else
						yA = inputs["yA"+i] = mM.alea.real { min:-max+1, max:-1 }
						yB = inputs["yB"+i] = mM.alea.real { min:yA+1, max:max }
					cano = inputs["c"+i] = cas.cano
				poly = mM.exec [ yB, yA, "-", xB, xA, "-", 2, "^", "/", "x", xA, "-", 2, "^", "*", yA, "+" ], { simplify:true, developp:not cano }
				polyTex = "$x \\mapsto "+poly.tex({canonique:cano})+"$"
				tabX = ["$-\\infty$", "$#{xA}$", "$+\\infty$"]
				if yB>yA then variations = "+/$+\\infty$,-/$#{yA}$,+/$+\\infty$"
				else variations = "-/$-\\infty$,+/$#{yA}$,-/$-\\infty$"
				tab = ( TabVarApi.make(tabX, {hauteur_ligne:25, color:colors.html(ranks[i])} )).addVarLine(variations)
				[polyTex, tab, ranks[i]]

			_.unzip((iteratee(i) for i in [0..3]))

		getBriques: (inputs,options) ->
			[items, tabs, ranks] = @init(inputs)
			tabs = _.shuffle(tabs)

			initTabs = ($container)->
				initOneTab = (tab) ->
					$el = $("<div></div>")
					$container.append($el)
					tab.render $el[0]
				_.each(tabs, initOneTab)

			[
				{
					bareme:100
					items:[
						{
							type: "text"
							ps:[
								"On vous donne 4 tableaux de variations et 4 fonctions du second degré."
								"Vous devez dire à quelle fonction correspond chaque tableau."
								"Pour cela appuyez sur les carrés pour sélectionner la bonne couleur."
							]
						}
						{
							type: "def"
							renderingFunctions:[
								initTabs
							]

						}
						{
							type:"color-choice"
							name:"it"
							list: items
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.trinome.canonique_et_parabole.concat(help.trinome.a_et_concavite_parabole)
						}
					]
					validations:{
						it:"color:4"
					}
					verifications:[
						{
							name:"it"
							colors:ranks
							items: items
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @

			fct_item = (inputs, index) ->
				[items, tabs, ranks] = that.init(inputs,options)
				tabs = _.shuffle(tabs)
				initTabs = ($container)->
					initOneTab = (tab) ->
						$el = $("<div></div>")
						$container.append($el)
						tab.render $el[0]
					_.each(tabs, initOneTab)

				return {
					children: [
						{
							type: "def"
							renderingFunctions:[
								initTabs
							]
						}
						{
							type: "enumerate"
							enumi: "a"
							children: items
						}
					]
				}

			return {
				children: [
					{
						type:"text"
						children:[
							"Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré."
							"À chaque fois, vous devez dire à quelle fonction correspond chaque tableau."
						]
					}
					{
						type: "subtitles"
						enumi: "A"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[items, tabs, ranks] = that.init(inputs,options)
				tabs = _.shuffle(tabs)

				return (tab.toTexTpl() for tab in tabs).concat [
					{
						type: "enumerate"
						enumi: "a)"
						children: items
					}
				]

			if inputs_list.length is 1
				return {
					children: [
						"On vous donne 4 tableaux de variations et 4 fonctions du second degré."
						"Vous devez dire à quelle fonction correspond chaque tableau."
					].concat fct_item(inputs_list[0],0)
				}
			else
				return {
					children: [
						"Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré."
						"À chaque fois, vous devez dire à quelle fonction correspond chaque tableau."
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
