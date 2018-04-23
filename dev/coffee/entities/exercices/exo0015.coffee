define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:15
	# title:"Associer droites et équations réduites"
	# description:"On donne cinq équations réduites et cinq droites. Il faut associer chaque équation avec la droite qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
	# options: {
	#	n:{ tag:"Nombre de courbes" , options:["3", "4", "5", "6", "7"] , def:2 }
	# }

	return {
		max: 6
		init: (inputs,options, affine) ->
			N = Number options.n.value+2
			max = @max

			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..N])
				inputs.ranks = ranks.join(";")

			iteratee=(i)->
				A = mM.alea.vector({ name:"A#{i}", def:inputs, values:[{min:-max, max:max}] }).save(inputs)
				B = mM.alea.vector({ name:"B#{i}", def:inputs, values:[{min:-max, max:max}], forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
				droite = mM.droite.par2pts(A,B)
				if affine
					tex = "$"+ droite.affineTex("","x",true)+"$"
				else
					tex = "$#{droite.reduiteTex()}$"
				[
					tex
					[A, B]
					droite
					ranks[i]
				]
			_.unzip((iteratee(i) for i in [0..N]))

		getBriques: (inputs, options, fixedSettings) ->
			max = @max

			[items, pts, droites, ranks] = @init(inputs, options, fixedSettings.affine)

			if fixedSettings.affine
				sujet = [
					"On vous donne 5 courbes et 5 fonctions affines."
					"Vous devez dire à quelle fonction correspond chaque courbe."
					"Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"
				]
				exo_help = help.fonction.affine.courbe
			else
				sujet = [
					"On vous donne des droites et des équations de droites."
					"Vous devez dire à quelle équation correspond chaque droite."
					"Cliquez sur les rectangles pour choisir la couleur de la droite correspondant à chaque équation, puis validez"
				]
				exo_help = help.droite.associer_equation


			initGraph = (graph) ->
				graph.create('line',[AB[0].toJSXcoords(),AB[1].toJSXcoords()], {strokeColor:colors.html(ranks[i]),strokeWidth:4, fixed:true}) for AB, i in pts

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: sujet
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
							list: exo_help
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

		getExamBriques: (inputs_list,options, fixedSettings) ->
			max = @max
			that = @
			graphs = {}
			if fixedSettings.affine
				sujet = [
					"On vous donne 5 courbes et 5 fonctions affines."
					"Vous devez dire à quelle fonction correspond chaque courbe."
				]
			else
				sujet = [
					"On vous donne 5 droites et 5 équations de droites."
					"Vous devez dire à quelle équation correspond chaque droite."
				]
			fct_item = (inputs, index) ->
				[items, pts, droites, ranks] = that.init(inputs, options, fixedSettings.affine)
				id = "jsx"+Math.random()

				graphs[id] = {
					params: {
						axis:true
						grid:true
						boundingbox:[-max,max,max,-max]
						keepaspectratio: true
					}
					init: (graph) ->
						graph.create('line',[AB[0].toJSXcoords(),AB[1].toJSXcoords()], {strokeColor:colors.html(ranks[i]),strokeWidth:4, fixed:true}) for AB, i in pts
				}
				return {
					children: [
						{
							type: "text"
							children: sujet
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

		getTex: (inputs_list, options, fixedSettings) ->
			that = @
			max = @max
			fct_item = (inputs, index) ->
				[items, pts, droites, ranks] = that.init(inputs, options, fixedSettings.affine)

				fct_droite_to_tex= (d,index)->
					color = colors.tex(ranks[index])
					if d.verticale()
						x = d.float_x(0)
						"\\draw[line width=1pt, #{color}] (#{x},#{-max-1}) -- (#{x},#{max+1});"
					else
						y1 = d.float_y(-max-1)
						y2 = d.float_y(max+1)
						"\\draw[line width=1pt, #{color}] (#{-max-1},#{y1}) -- (#{max+1},#{y2});"
				tex = "\\begin{scope}\\clip(#{-max},#{-max}) rectangle(#{max},#{max});"+(fct_droite_to_tex(d,index) for d,index in droites).join(" ")+"\\end{scope};"


				if fixedSettings.affine
					sujet = [
						"On vous donne 5 courbes et 5 fonctions affines."
						"Vous devez dire à quelle fonction correspond chaque courbe."
					]
				else
					sujet = [
						"On vous donne 5 droites et 5 équations de droites."
						"Vous devez dire à quelle équation correspond chaque droite."
					]

				return sujet.concat [
					{
						type:"tikz"
						left: -max
						bottom: -max
						right: max
						top: max
						index: index+1
						axes:[1,1]
						misc: tex
					}
					{
						type: "enumerate",
						enumi: "a)"
						children: (it[i] for i in ranks)
					}
				]


			if inputs_list.length is 1
				return fct_item(inputs_list[0],0)
			else
				return {
					children: [
						{
							type: "enumerate"
							enumi: "A"
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
