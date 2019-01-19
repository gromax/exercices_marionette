define ["utils/math"], (mM) ->
	# id:8
	# title:"Image et antécédent avec une courbe"
	# description:"La courbe d'une fonction étant donnée, il faut déterminer un antécédent et une image."
	# keyWords:["Fonctions","Antécédent","Image","Seconde"]

	return {
		max: 10
		init: (inputs) ->
			max = @max
			decimals = 2
			# Initialisation du polynome
			poly = null
			if typeof inputs.p isnt "undefined"
				poly = mM.polynome.make inputs.p
				if not poly.isValid() then poly = null
			if poly is null
				# On crée un nouveau polynome
				points = ( {x:x*max, y:mM.alea.real({min:-60, max:60})*max/100 } for x in [-1, -.5, 0, .5, 1] )
				poly = mM.polynome.make { points:points, variable:"x"}
				inputs.p = String(poly)
			# initialisation des images et antécédents à trouver

			if typeof inputs.xi is "undefined" then xi = inputs.xi = mM.alea.real { min: -max, max: max }
			else xi = Number inputs.xi

			if typeof inputs.xa is "undefined" then xa = mM.alea.real { min: -max, max: max }
			else xa = Number inputs.xa
			while xa is xi
				xa = mM.alea.real { min: -max, max: max }
			inputs.xa = xa

			yi = mM.float poly, { x:xi, decimals:decimals }
			ya = mM.float poly, { x:xa, decimals:decimals }
			antecedents = mM.polynome.solve.numeric poly, { bornes:{min:-max, max:max}, decimals:decimals, y:ya }
			[ poly, xi, yi, xa, ya, antecedents ]

		getBriques: (inputs, options) ->
			max= @max
			[ poly, xi, yi, xa, ya, antecedents ] = @init(inputs)
			str_antecedents = ( mM.misc.numToStr(x,1) for x in antecedents)

			fctGraph = (x) -> mM.float(poly, {x:x})
			initGraph = (graph) ->
				curve = graph.create('functiongraph', [ fctGraph, -max, max ], { strokeWidth:3 })
				graph.create('point',[ -max, fctGraph(-max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
				graph.create('point',[ max, fctGraph(max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
				graph.create('glider',[-max/2,2,curve],{name:'M'})

			[
				{
					bareme:100
					items: [
						{
							type: "text"
							rank:1
							ps:[
								"On considère la fonction &nbsp; $f$ &nbsp; définie sur &nbsp; $[#{-max};#{max}]$ &nbsp; dont la courbe est donnée ci-dessous."
								"Vous pouvez déplacer le point M sur la courbe afin d'obtenir une meilleure lecture des coordonnées."
							]
						}
						{
							type: "jsxgraph"
							rank: 2
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
							verification: () ->
								{
									add: {
										type:"ul"
										rank: 3
										list:[{
											type:"warning"
											text:"La construction pour l'image est en orange. La construction pour les antécédents est en vert."
										}]
									}
									post: (graph)->
										graph.create('line',[[0,ya],[1,ya]], {color:'green',strokeWidth:2, fixed:true})
										if (ya>0) then anchorY = 'top'
										else anchorY = 'bottom'
										for x,i in antecedents
											graph.create('line',[[x,ya],[x,0]], {color:'green', straightFirst:false, straightLast:false, strokeWidth:2, dash:2, fixed:true})
											graph.create('text',[x,0,str_antecedents[i]], {color:'green', anchorX:'middle', anchorY:anchorY})
										graph.create('line',[[xi,0],[xi,yi]], {color:'orange', straightFirst:false, straightLast:false, strokeWidth:2, dash:2, fixed:true})
										graph.create('line',[[xi,yi],[0,yi]], {color:'orange', straightFirst:false, straightLast:false, strokeWidth:2, dash:2, fixed:true})
										if (xi>0) then anchorX = 'right'
										else anchorX = 'left'
										graph.create('text',[0,yi,mM.misc.numToStr(yi)], {color:'orange', anchorX:anchorX, anchorY:'middle'})
								}
						}
						{
							type:"input"
							rank: 5
							format:[
								{ text:"Image de #{mM.misc.numToStr(xi)} à 0,2 près : ", cols:4, class:"text-right"}
								{ name:"i", cols:3, latex:false }
							]
						}
						{
							type:"input"
							rank: 7
							format:[
								{ text:"Antécédent de #{mM.misc.numToStr(ya)} à 0,2 près : ", cols:4, class:"text-right"}
								{ name:"a", cols:3, latex:false }
							]
						}
						{
							type:"validation"
							rank: 8
						}
					]
					validations:{
						i:"number"
						a:"liste"
					}
					verifications:[
						{
							name:"i"
							rank:5
							tag:"Image"
							good:yi
							parameters: { tolerance:.2 }
						}
						{
							name:"a"
							rank:7
							tag:"Antécédent"
							type:"some"
							good:antecedents
							parameters:{ tolerance: .2 }
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			max = @max
			that = @
			graphs = {}
			fct_item = (inputs, index) ->
				[ poly, xi, yi, xa, ya, antecedents ] = that.init(inputs)
				id = "jsx"+Math.random()
				fctGraph = (x) -> mM.float(poly, {x:x})

				graphs[id] = {
					params: {
						axis:true
						grid:true
						boundingbox:[-max,max,max,-max]
						keepaspectratio: true
					}
					init: (graph) ->
						curve = graph.create('functiongraph', [ fctGraph, -max, max ], { strokeWidth:3 })
						graph.create('point',[ -max, fctGraph(-max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
						graph.create('point',[ max, fctGraph(max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
				}
				return {
					children: [
						{
							type: "text"
							children:[
								"On considère la fonction &nbsp; $f$ &nbsp; défnie sur l'intervalle &nbsp; $[#{-max};#{max}]$ par la courbe :"
							]
						}
						{
							type:"graphique"
							divId: id
						}
						{
							type: "enumerate"
							enumi:"1"
							children: [
								"Donnez l'image de #{xi} par &nbsp; $f$"
								"Donnez un antécédent de #{mM.misc.numToStr(ya)} par &nbsp; $f$"
							]
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
				[ poly, xi, yi, xa, ya, antecedents ] = that.init(inputs,options)
				return [
					"On considère la fonction $f$ défnie sur l'intervalle $[#{-max};#{max}]$ par la courbe :"
					{
						type:"tikz"
						left: -max
						bottom: -max
						right: max
						top: max
						index: index+1
						axes:[1,1]
						courbes:[
							{
								color:'blue'
								expression:String(poly).replace /x/g, '(/x)'
							}
						]
					}
					{
						type: "enumerate",
						children: [
							"Donnez l'image de #{xi} par $f$"
							"Donnez un antécédent de #{mM.misc.numToStr(ya)} par $f$"
						]
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
