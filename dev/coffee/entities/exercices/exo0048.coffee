define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:48
	# title: "Reconnaître les courbes d'une fonction et de sa dérivée (ou d'une fonction et et de sa primitive)"
	# description: "On donne la courbe d'une fonction $f$ et la courbe de sa dérivée $f'$ (ou de sa primitive $F$), il faut reconnaître quelle courbe correspond à $f$ et quelle courbe correspond à $f'$ (ou $F$)."
	# keyWords:["Analyse", "Déerivation", "Première", "Primitive", "Terminale"]
	# options: {
	#	a:{ tag:"Dérivée ou Primitive" , options:["Dérivée", "Primitive"] }
	#}

	# debug : tex à faire

	return {
		max: 6
		init: (inputs, options, der) ->
			max = @max

			# Initialisation du polynome
			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..1])
				inputs.ranks = ranks.join(";")

			poly = null
			if typeof inputs.p isnt "undefined"
				poly = mM.polynome.make inputs.p
				if not poly.isValid() then poly = null
			if poly is null
				# On crée un nouveau polynome
				points = [
					{x:-max, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:-max/2, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:0, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:max/2, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:max, y:mM.alea.real({min:-40, max:40})/100*max}
				]
				poly = mM.polynome.make { points:points, variable:"x" }
				inputs.p = String(poly)

			# Calcul de la dérivée
			polyDer = poly.derivate()

			[
				[
					poly
					polyDer
				]
				[
					"$#{if der then "f" else "F"}$"
					"$#{if der then "f'" else "f"}$"
				]
				ranks
			]

		getBriques: (inputs, options, fixedSettings) ->
			max= @max
			[polys, items, ranks] = @init(inputs,options, fixedSettings.derivee)

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
							ps: if fixedSettings.derivee then [
								"On vous donne 2 courbes."
								"L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à sa dérivée $f'$."
								"Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $f'$."
							] else [
								"On vous donne 2 courbes."
								"L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à une de ses primitive &nbsp; $F$."
								"Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $F$."
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
							list: if fixedSettings.derivee then help.derivee.variation else help.primitive.variation
						}
					]
					validations:{
						it:"color:2"
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

		getExamBriques: (inputs_list,options, fixedSettings) ->
			max = @max
			that = @
			graphs = {}
			if fixedSettings.derivee
				sujet = [
					"Dans chaque cas, on vous donne 2 courbes."
					"L'une représente une fonction &nbsp; $f$ &nbsp; et la seconde représente sa dérivée &nbsp; $f'$."
					"Indiquez à chaque fois quelle courbe correspond à &nbsp; $f$ &nbsp; et quelle courbe correspond à &nbsp; $f'$."
				]
			else
				sujet = [
					"Dans chaque cas, on vous donne 2 courbes."
					"L'une représente une fonction &nbsp; $f$ &nbsp; et la seconde représente une primitive &nbsp; $F$."
					"Indiquez à chaque fois quelle courbe correspond à &nbsp; $f$ &nbsp; et quelle courbe correspond à &nbsp; $F$."
				]
			fct_item = (inputs, index) ->
				[polys, items, ranks] = that.init(inputs, options, fixedSettings.derivee)
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
							type:"graphique"
							divId: id
						}
					]
				}

			return {
				children: [
					{
							type: "text"
							children: sujet
					}
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
				[polys, items, ranks] = that.init(inputs, options, fixedSettings.derivee)

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
				]


			if inputs_list.length is 1
				if fixedSettings.derivee
					sujet = [
						"On vous donne 2 courbes."
						"L'une représente une fonction $f$ et la seconde représente sa dérivée $f'$."
						"Indiquez quelle courbe correspond à $f$ et quelle courbe correspond à $f'$."
					]
				else
					sujet = [
						"On vous donne 2 courbes."
						"L'une représente une fonction $f$ et la seconde représente une primitive $F$."
						"Indiquez quelle courbe correspond à $f$ et quelle courbe correspond à $F$."
					]

				return {
					children: sujet.concat fct_item(inputs_list[0],0)
				}
			else
				if fixedSettings.derivee
					sujet = [
						"Dans chaque cas, on vous donne 2 courbes."
						"L'une représente une fonction $f$ et la seconde représente sa dérivée $f'$."
						"Indiquez à chaque fois quelle courbe correspond à $f$ et quelle courbe correspond à $f'$."
					]
				else
					sujet = [
						"Dans chaque cas, on vous donne 2 courbes."
						"L'une représente une fonction $f$ et la seconde représente une primitive $F$."
						"Indiquez à chaque fois quelle courbe correspond à $f$ et quelle courbe correspond à $F$."
					]


				return {
					children: [
						{
							type: "enumerate"
							enumi: "1)"
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
