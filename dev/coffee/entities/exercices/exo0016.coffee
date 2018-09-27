define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:16
	# title:"Associer courbes et fonctions du second degré"
	# description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer la parabole qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Second degré","Seconde"]

	return {
		max: 6
		init: (inputs) ->
			max = @max
			# Les paraboles sont définies par sommet et point

			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..4])
				inputs.ranks = ranks.join(";")

			iteratee=(i)->
				A = mM.alea.vector({ name:"A#{i}", def:inputs, values:[{min:-max, max:max}] }).save(inputs)
				B = mM.alea.vector({ name:"B#{i}", def:inputs, values:[{min:-max, max:max}], forbidden:[ {axe:"x", coords:A}, {axe:"y", coords:A} ] }).save(inputs)
				# f est un flag 1 : forme canonique, 0 sinon

				if inputs["f"+i]? then f = Number inputs["f"+i]
				else
					if cano = mM.alea.dice(1,3) then f = 1 else f = 0
					inputs["f"+i] = String f
				poly = mM.exec [ B.y, A.y, "-", B.x, A.x, "-", 2, "^", "/", "x", A.x, "-", 2, "^", "*", A.y, "+" ], { simplify:true, developp:f isnt 1 }
				[
					"$x \\mapsto #{poly.tex()}$"
					poly
					ranks[i]
				]
			_.unzip((iteratee(i) for i in [0..4]))

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
					items: [
						{
							type: "text"
							ps: [
								"On vous donne 5 courbes et 5 fonctions du second degré."
								"Vous devez dire à quelle fonction correspond chaque courbe."
								"Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"
							]
						}
						{
							type:"jsxgraph"
							divId: "jsx#{Math.random()}"
							params: {
								axis:true
								grid:true
								boundingbox:[-max,max,max,-max]
								keepaspectratio: false
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
							list: help.trinome.a_et_concavite_parabole.concat(help.trinome.canonique_et_parabole,help.trinome.c_et_parabole)
						}
					]
					validations:{
						it:"color:5"
					}
					verifications:[
						{
							name:"it"
							items: items
							colors: ranks
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
								"On vous donne 5 courbes et 5 fonctions du second degré."
								"Vous devez dire à quelle fonction correspond chaque courbe."
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
						"On vous donne 5 courbes et 5 fonctions du second degré."
						"Vous devez dire à quelle fonction correspond chaque courbe."
					].concat fct_item(inputs_list[0],0)
				}
			else
				return {
					children: [
						"Dans chaque cas, on vous donne 5 courbes et 5 fonctions du second degré."
						"Vous devez dire à chaque fois quelle fonction correspond chaque courbe."
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}
	}
