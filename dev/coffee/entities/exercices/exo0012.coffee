define ["utils/math","utils/help"], (mM, help) ->
#	id:12
#	title:"Tracer la courbe d'une fonction affine"
#	description:"L'expression d'une fonction affine étant donnée, il faut tracer sa courbe dans un repère."
#	keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]

# debug: tex à faire

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]

		getBriques: (inputs, options) ->
			max = 10
			dmax = .3
			[A, B, droite] = @init(inputs)

			initGraph = (graph)->
				pA = graph.create("point", [-max+1,1], {name:'A', fixed:false, size:4, snapToGrid:false, color:'blue', showInfoBox:true})
				pB = graph.create("point", [max-1,1], {name:'B', fixed:false, size:4, snapToGrid:false, color:'blue', showInfoBox:true})
				graph.droite = graph.create('line',["A","B"], {strokeColor:'#00ff00',strokeWidth:2})
				graph.points = [pA,pB]

			[
				{
					bareme: 100
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"On considère la fonction affine &nbsp; $#{droite.affineTex("f","x")}$."
								"Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB)$ &nbsp; soit la courbe représentative de la fonction."
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
								u = {
									A:{
										x: Number answers_data["xA"]
										y: Number answers_data["yA"]
									}
									B:{
										x: Number answers_data["xB"]
										y: Number answers_data["yB"]
									}
								}

								dA = droite.float_distance(u.A.x,u.A.y)
								dB = droite.float_distance(u.B.x,u.B.y)
								dAB = Math.sqrt((u.A.x-u.B.x)^2+(u.A.y-u.B.y)^2)

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
											pt.setAttribute {fixed:true, x:u[pt.name].x, y: u[pt.name].y}
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
