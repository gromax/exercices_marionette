define ["utils/math"], (mM) ->
	# id:8
	# title:"Image et antécédent avec une courbe"
	# description:"La courbe d'une fonction étant donnée, il faut déterminer un antécédent et une image."
	# keyWords:["Fonctions","Antécédent","Image","Seconde"]

	Controller =

		init: (inputs,options) ->
			max = 10
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
			if typeof inputs.xi is "undefined" then xi = mM.alea.real { min: -max, max: max }
			else xi = inputs.xi = Number inputs.xi


			if typeof inputs.xa is "undefined" then xa = mM.alea.real { min: -max, max: max }
			else xa = Number inputs.xa
			while xa is xi
				xa = mM.alea.real { min: -max, max: max }
			inputs.xa = xa

			yi = mM.float poly, { x:xi, decimals:decimals }
			ya = mM.float poly, { x:xa, decimals:decimals }
			antecedents = mM.polynome.solve.numeric poly, { bornes:{min:-max, max:max}, decimals:decimals, y:ya }
			str_antecedents = ( mM.misc.numToStr(x,1) for x in antecedents)

			fctGraph = (x) -> mM.float(poly, {x:x})
			initGraph = (graph) ->
				curve = graph.create('functiongraph', [ fctGraph, -max, max ], { strokeWidth:3 })
				graph.create('point',[ -max, fctGraph(-max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
				graph.create('point',[ max, fctGraph(max) ],{fixed:true, fillColor:'blue', strokeColor:'blue', withlabel:false, size:4})
				graph.create('glider',[-max/2,2,curve],{name:'M'})


			{
				inputs: inputs
				briques:[
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
									keepaspectratio: true
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
								type: "text"
								rank: 4
								ps:[
									"Donnez l'image de #{mM.misc.numToStr(xi)} à 0,2 près."
								]
							}
							{
								type:"input"
								rank: 5
								name:"i"
								tag:"Image"
								good: yi
								tolerance: .2
							}
							{
								type: "text"
								rank: 6
								ps:[
									"Donnez un antécédent (un seul !) de #{mM.misc.numToStr(ya)} à 0,2 près."
								]
							}
							{
								type:"input"
								rank: 7
								name:"a"
								tag:"Antécédent"
								good: antecedents
								tolerance: .2
							}
							{
								type:"validation"
								rank: 8
								clavier:[]
							}
						]
					}
				]
			}

		tex: (data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			out = []
			for itemData,i in data
				courbe = { color:"blue", expr:itemData.values.poly.toClone().simplify().toString().replace(/,/g,'.').replace(/x/g,'(\\x)') }
				xi = itemData.values.xi
				ya = itemData.values.ya
				questions = Handlebars.templates["tex_enumerate"] { items:["Donnez l'image de #{xi}", "Donnez le(s) antécédent(s) de #{ya}"] }
				# Calcul de la taille
				graphique = Handlebars.templates["tex_courbes"] { index:i+1, max:@max, courbes:[ courbe ], scale:.4*@max/10 }
				out.push {
					title:@title
					contents: [graphique, questions]
				}
			out

	return Controller
