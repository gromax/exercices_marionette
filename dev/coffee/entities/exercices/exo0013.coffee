define ["utils/math"], (mM) ->
	# id:13
	# title:"Tracer une droite dont on connaît l'équation réduite"
	# description:"On donne l'équation réduite d'une droite. Il faut tracer cette droite."
	# keyWords:["Géométrie","Droite","Équation","Seconde"]

	return {
		max: 10
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]

		getBriques: (inputs, options) ->
			max = @max
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
							ps:[
								"On considère la droite &nbsp; $\\mathcal{D}$ &nbsp; d'équation réduite &nbsp; $#{droite.reduiteTex()}$."
								"Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB) = \\mathcal{D}$."
							]
						}
						{
							type:"jsxgraph"
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
							postVerification: (graph, data)->
								for pt in graph.points
									pt.setAttribute {fixed:true, x:data["x"+pt.name].processed, y: data["y"+pt.name].processed}
								graph.create('line',droite.float_2_points(max), {strokeColor:'blue',strokeWidth:2,fixed:true})
						}
						{
							type:"validation"
						}
					]
					validations:{
						xA: "real"
						yA: "real"
						xB: "real"
						yB: "real"
					}
					verifications:[
						(data) ->
							note = 0
							u = {
								A:{
									x: data.xA.processed
									y: data.yA.processed
								}
								B:{
									x: data.xB.processed
									y: data.yB.processed
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
										list: messages
									}
								]

							}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			max = @max
			that = @

			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs)
				return "$#{droite.reduiteTex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Tracez dans un repère les droites dont les équations sont :"
						]
					}
					{
						type: "enumerate",
						refresh:true
						enumi:"1",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list, options) ->
			that = @
			max = @max
			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs)
				return "$#{droite.reduiteTex()}$"

			if inputs_list.length is 1
				return {
					children: [
						"Tracez dans le repère la droite d'équation : #{fct_item(inputs_list[0],0)}"
						{
							type:"tikz"
							left: -max
							bottom: -max
							right: max
							top: max
							axes:[1,1]
						}
					]
				}
			else
				return {
					children: [
						"Tracez dans le repère les droites d'équations :"
						{
							type: "enumerate"
							enumi: "A"
							children: _.map(inputs_list, fct_item)
						}
						{
							type:"tikz"
							left: -max
							bottom: -max
							right: max
							top: max
							axes:[1,1]
						}
					]
				}


	}
