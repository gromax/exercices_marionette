define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:17
	# title:"Associer courbes et fonctions du second degré"
	# description:"Cinq paraboles sont données. On propose cinq fonctions du second degré dont on ne connait que le discriminant et le coefficient du terme de second degré. À chaque fonction, il faut attribuer la parabole qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]

	return {
		max: 6
		init: (inputs) ->
			max = @max

			# Les paraboles sont définies par sommet et point
			liste = [{ap:false, d:-1}, {ap:false, d:0}, {ap:false, d:1}, {ap:true, d:-1}, {ap:true, d:0}, {ap:true, d:1}]

			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..5])
				inputs.ranks = ranks.join(";")

			iteratee = (i)->
				if (typeof inputs["xA"+i] isnt "undefined")
					xA = Number inputs["xA"+i]
					yA = Number inputs["yA"+i]
					xB = Number inputs["xB"+i]
					yB = Number inputs["yB"+i]
				else
					cas = liste[i]
					# On tire au hasard 4 pts et on calcule la fonction correspondante
					xA = inputs["xA"+i] = xB = mM.alea.real { min:-max+1, max:max-1 }
					xB = mM.alea.real { min:-max+1, max:max-1 } while (xA is xB)
					inputs["xB"+i] = xB
					switch
						when cas.ap and (cas.d is -1)
							yA = mM.alea.real { min:1, max:max-1 }
							yB = mM.alea.real { min:yA+1, max:max }
						when not cas.ap and (cas.d is 1)
							yA = mM.alea.real { min:1, max:max-1 }
							yB = mM.alea.real { min:-max, max:yA-1 }
						when not cas.ap and (cas.d is -1)
							yA = mM.alea.real { min:-max+1, max:-1 }
							yB = mM.alea.real { min:-max, max:yA-1 }
						when cas.ap and (cas.d is 1)
							yA = mM.alea.real { min:-max+1, max:-1 }
							yB = mM.alea.real { min:yA+1, max:max }
						when cas.ap
							yA = 0
							yB = mM.alea.real { min:1, max:max }
						else
							yA = 0
							yB = mM.alea.real { min:-max, max:-1 }
					inputs["yA"+i] = yA
					inputs["yB"+i] = yB
				a = mM.exec [ yB, yA, "-", xB, xA, "-", 2, "^", "/" ], { simplify:true }
				poly = mM.exec [ a, "x", xA, "-", 2, "^", "*", yA, "+" ], { simplify:true }
				delta = mM.exec [ -4, a, yA, "*", "*"], { simplify:true }
				[
					"$\\Delta = #{delta.tex()}$ &nbsp; et &nbsp; $a = #{a.tex()}$"
					poly
					ranks[i]
				]
			_.unzip((iteratee(i) for i in [0..5] when ranks[i]<5))
		getBriques: (inputs, options) ->
			max = @max
			[items, polys, ranks] = @init(inputs)

			initGraph = (graph) ->
				for p, i in polys
					fct = (x) -> mM.float(p, {x:x})
					graph.create('functiongraph', [ fct, -max, max ], { strokeWidth:3, strokeColor: colors.html(ranks[i]), fixed:true })

			[
				{
					bareme: 100
					items:[
						{
							type: "text"
							ps: [
								"On vous donne 5 cas de fonctions du second degré, donc de la forme &nbsp;& $f:x\\mapsto ax^2+bx+c$."
								"On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$."
								"Vous devez les associer aux courbes en cliquant sur les rectangles pour sélectionner la bonne couleur."
							]
						}
						{
							type:"jsxgraph"
							divId: "jsx#{Math.random()}"
							params: {
								axis:true
								grid:true
								boundingbox:[-max,max,max,-max]
								keepaspectratio: true
							}
							renderingFunctions:[
								initGraph
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
							list: help.trinome.a_et_concavite_parabole.concat(help.trinome.delta_et_parabole)
						}
					]
					validations:{
						it:"color:5"
					}
					verifications:[
						{
							name:"it"
							colors: ranks
							items: items
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			max = @max
			that = @
			graphs = {}
			fct_item = (inputs, index) ->
				[items, polys, ranks] = that.init(inputs)
				id = "jsx"+Math.random()

				graphs[id] = {
					params: {
						axis:true
						grid:true
						boundingbox:[-max,max,max,-max]
						keepaspectratio: true
					}
					init: (graph) ->
						for p, i in polys
							fct = (x) -> mM.float(p, {x:x})
							graph.create('functiongraph', [ fct, -max, max ], { strokeWidth:3, strokeColor: colors.html(ranks[i]), fixed:true })
				}
				return {
					children: [
						{
							type: "text"
							children:[
								"On vous donne 5 fonctions du second degré, donc de la forme &nbsp; $f:x\\mapsto ax^2+bx+c$."
								"On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$."
								"Vous devez associer ces fonctions avec les courbes."
							]
						}
						{
							type:"graphique"
							divId: id
						}
						{
							type: "enumerate"
							enumi:"a"
							children: items
						}
					]
				}

			return {
				children: [
					{
						type: "subtitles"
						enumi: "A"
						refresh:true
						children: _.map(inputs_list, fct_item)
					}
				]
				graphs: graphs
			}

		getTex: (inputs_list, options) ->
			that = @
			max = @max
			fct_item = (inputs, index) ->
				[items, polys, ranks] = that.init(inputs,options)
				return [
					{
						type:"tikz"
						left: -max
						bottom: -max
						right: max
						top: max
						index: index+1
						axes:[1,1]
						courbes: ( { color:colors.tex(ranks[i]), expression:String(p).replace /x/g, '(/x)' } for p,i in polys)
					}
					{
						type: "enumerate",
						enumi: "a)"
						children: items
					}
				]

			if inputs_list.length is 1
				return {
					children: [
						"On vous donne 5 fonctions du second degré, donc de la forme $f:x\\mapsto ax^2+bx+c$."
						"On ne connaît que les valeurs de $\\Delta$ et de $a$."
						"Vous devez associer ces fonctions avec les courbes."
					].concat fct_item(inputs_list[0],0)
				}
			else
				return {
					children: [
						"Dans chaque cas, on vous donne 5 fonctions du second degré, donc de la forme $f:x\\mapsto ax^2+bx+c$."
						"On ne connaît que les valeurs de $\\Delta$ et de $a$."
						"Vous devez associer ces fonctions avec les courbes."
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}
	}
