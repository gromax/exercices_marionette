define ["utils/math"], (mM) ->
	# id:13
	# title:"Tracer une droite dont on connaît l'équation réduite"
	# description:"On donne l'équation réduite d'une droite. Il faut tracer cette droite."
	# keyWords:["Géométrie","Droite","Équation","Seconde"]
	Controller =
		init: (inputs, options) ->
			max = 10
			dmax = .3
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			droite =  mM.droite.par2pts A,B

			initGraph = (graph)->
				pA = graph.create("point", [-max+1,1], {name:'A', fixed:false, size:4, snapToGrid:false, color:'blue', showInfoBox:true})
				pB = graph.create("point", [max-1,1], {name:'B', fixed:false, size:4, snapToGrid:false, color:'blue', showInfoBox:true})
				graph.droite = graph.create('line',["A","B"], {strokeColor:'#00ff00',strokeWidth:2})
				graph.points = [pA,pB]

			{
				inputs: inputs
				briques: [
					{
						bareme: 100
						items:[
							{
								type:"text"
								rank: 1
								ps:[
									"On considère la droite &nbsp; $\\mathcal{D}$ &nbsp; d'équation réduite &nbsp; $#{droite.reduiteTex()}$."
									"Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB) = \\mathcal{D}$."
								]
							}
							{
								type:"jsxgraph"
								rank: 2
								divId: "jsx#{Math.random()}"
								name: ["xA", "yA", "xB", "yB"]
								params: {
									axis:true
									grid:true
									boundingbox:[-max,max,max,-max]
									keepaspectratio: true
								}
								renderingFunctions:[
									initGraph
								]
								getData: (graph) ->
									out = {}
									out["x"+p.name] = p.X() for p in graph.points
									out["y"+p.name] = p.Y() for p in graph.points
									out
								verification: (answers_data) ->
									note = 0
									xA = Number answers_data["xA"]
									yA = Number answers_data["yA"]
									xB = Number answers_data["xB"]
									yB = Number answers_data["yB"]

									dA = droite.float_distance(xA,yA)
									dB = droite.float_distance(xB,yB)
									dAB = Math.sqrt((xA-xB)*(xA-xB)+(yA-yB)*(yA-yB))

									messages = []
									if (dA<dmax)
										# point assez près
										messages.push { type:"success", text:"Le point A est bien placé." }
										note+=.5
									else
										# trop loin
										messages.push { type:"error", text:"Le point A est mal placé." }

									if (dB<dmax) and (dAB<dmax) and (dA<dmax)
										# point assez près mais trop proches de A déjà bien placé
										messages.push { type:"success", text:"Le point B est bien placé, mais est trop proche de A." }
										note+=.25
									else if (dB<dmax)
										# point assez près
										messages.push { type:"success", text:"Le point B est bien placé." }
										note+=.5
									else
										# trop loin
										messages.push { type:"error", text:"Le point B est mal placé." }
									{
										note: note
										add:[
											{
												type:"ul"
												rank: 3
												list: messages
											}
										]
										post: (graph)->
											for pt in graph.points
												pt.setAttribute {fixed:true}
											graph.create('line',droite.float_2_points(max), {strokeColor:'blue',strokeWidth:2,fixed:true})
									}
							}
							{
								type:"validation"
								rank: 3
								clavier: []
							}
						]
					}
				]
			}

	return Controller
