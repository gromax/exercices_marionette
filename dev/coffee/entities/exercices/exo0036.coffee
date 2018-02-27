define ["utils/math"], (mM) ->
	# id:36
	# title:"Placer des points sur le cercle trigonométrique"
	# description:"Placer sur le cercle trigonométrique le point correspondant à une mesure donnée en radians."
	# keyWords:["Trigonométrie", "Première", "Radians", "Seconde"]

	return {
		init: (inputs) ->
			if inputs.deg? then deg = mM.toNumber inputs.deg
			else
				deg = mM.alea.number { min:3, max:8, sign:true, coeff:[30,45] }
				inputs.deg = String deg
			[
				deg
				mM.trigo.degToRad deg
			]

		getBriques: (inputs, options) ->
			[deg, ang] = @init(inputs)

			initGraph = (graph)->
				circle = graph.create("circle", [[0,0],1],{fixed:true, strokeColor:'red'})
				graph.M = graph.create("glider", [circle],{name:"M", fixed:false, size:4, color:'blue', showInfoBox:true})

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"Vous devez placer sur le cercle le point &nbsp; $M$ &nbsp; correspondant à la mesure &nbsp; $#{ang.tex()}$ &nbsp; en radians."
							]
						}
						{
							type:"jsxgraph"
							rank: 2
							divId: "jsx#{Math.random()}"
							name: ["a"]
							params: {
								axis:true
								grid:true
								boundingbox:[-1.5, 1.5, 1.5, -1.5]
								keepaspectratio: true
							}
							renderingFunctions:[
								initGraph
							]
							getData: (graph) ->
								dU = Math.round (Math.acos graph.M.X())*180/Math.PI
								if graph.M.Y()<0 then dU *= -1
								{ a:dU }
							verification: (answers_data) ->
								user = Number answers_data.a
								radU = user*Math.PI/180
								radG = deg*Math.PI/180
								ecart = Math.abs(deg-user)
								ecart-=360 while ecart>=355
								ok = (Math.abs(ecart)<=5)
								if ok
									{
										note: 100
										add:[
											{
												type:"ul"
												rank: 3
												list:[{
													type:"success"
													text: "$M$ &nbsp; est bien placé."
												}]
											}
										]
										post: (graph) ->
											graph.removeObject graph.M
											graph.create("point", [Math.cos(radU), Math.sin(radU)],{name:"M", fixed:true, size:4, color:'green'})
									}
								else
									{
										note: 0
										add:[
											{
												type:"ul"
												rank: 3
												list:[{
													type:"error"
													text: "$M$ &nbsp; est mal placé."
												}]
											}
										]
										post: (graph) ->
											graph.removeObject graph.M
											graph.create("point", [Math.cos(radU), Math.sin(radU)],{name:"", fixed:true, size:4, color:'red'})
											graph.create("point", [Math.cos(radG), Math.sin(radG)],{name:"M", fixed:true, size:4, color:'green'})
									}
						}
						{
							type: "validation"
							rank: 3
							clavier: []
						}
					]
				}
			]

	}
