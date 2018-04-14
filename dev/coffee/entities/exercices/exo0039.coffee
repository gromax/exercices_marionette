define ["utils/math", "utils/help", "utils/colors", "utils/tab"], (mM, help, colors, TabVarApi) ->
	# id:39
	# title:"Associer tableaux de variations et fonctions du second degré"
	# description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer le tableau qui lui correspond."
	# keyWords:["Analyse","Fonction","Tableau de variation", "Forme canonique", "Second degré","Seconde"]

	# debug : tex à faire

	return {
		init: (inputs) ->
			max = 6
			items = []
			# Les paraboles sont définies par sommet et point
			liste = _.shuffle [{cano:true, convexe:true}, {cano:true, convexe:false}, {cano:false, convexe:true}, {cano:false, convexe:false}]
			tabs = []
			for cas, i in liste
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
				item = { rank:i, text: "$x \\mapsto "+poly.tex({canonique:cano})+"$" }
				tabX = ["$-\\infty$", "$#{xA}$", "$+\\infty$"]
				if yB>yA then variations = "+/$+\\infty$,-/$#{yA}$,+/$+\\infty$"
				else variations = "-/$-\\infty$,+/$#{yA}$,-/$-\\infty$"
				tab = ( TabVarApi.make(tabX, {hauteur_ligne:25, color:colors.html(i), texColor:colors.tex(i)})).addVarLine(variations)
				tabs.push tab
				items.push item
			[tabs, items]

		getBriques: (inputs,options) ->
			[tabs, items] = @init(inputs)

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
							rank: 1
							ps:[
								"On vous donne 4 tableaux de variations et 4 fonctions du second degré."
								"Vous devez dire à quelle fonction correspond chaque tableau."
								"Pour cela appuyez sur les carrés pour sélectionner la bonne couleur."
							]
						}
						{
							type: "def"
							rank: 2
							renderingFunctions:[
								initTabs
							]

						}
						{
							type:"color-choice"
							rank: 3
							name:"it"
							list: _.shuffle(items)
						}
						{
							type: "validation"
							rank: 5
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 6
							list: help.trinome.canonique_et_parabole.concat(help.trinome.a_et_concavite_parabole)
						}
					]
				}
			]


		tex: (data) ->
			if not isArray(data) then data = [ data ]
			out = []
			for itemData in data
				out.push {
					title:"Associer tableaux et fonctions"
					contents: (tab.tex( { color:false } ) for tab in itemData.tabs).concat(Handlebars.templates["tex_enumerate"] { items:(item.title for item in itemData.items)})
				}
			out
	}
