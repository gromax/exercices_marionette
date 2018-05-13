define ["utils/math"], (mM) ->
	# id:36
	# title:"Placer des points sur le cercle trigonométrique"
	# description:"Placer sur le cercle trigonométrique le point correspondant à une mesure donnée en radians."
	# keyWords:["Trigonométrie", "Première", "Radians", "Seconde"]

	# debug : tex à améliorer

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
							ps: [
								"Vous devez placer sur le cercle le point &nbsp; $M$ &nbsp; correspondant à la mesure &nbsp; $#{ang.tex()}$ &nbsp; en radians."
							]
						}
						{
							type:"jsxgraph"
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
							postVerificationRender: (view, data)->
								graph = view.graph
								radU = data.a.processed*Math.PI/180
								radG = deg*Math.PI/180
								graph.removeObject graph.M
								graph.create("point", [Math.cos(radU), Math.sin(radU)],{name:"", fixed:true, size:4, color:'red'})
								graph.create("point", [Math.cos(radG), Math.sin(radG)],{name:"M", fixed:true, size:4, color:'green'})
						}
						{
							type: "validation"
						}
					]
					validations:{
						a: "real"
					}
					verifications:[
						(data) ->
							user = Number answers_data.a
							radU = user*Math.PI/180
							ecart = Math.abs(deg-user)
							ecart-=360 while ecart>180
							if Math.abs(ecart)<=5
								{
									note: 1
									add:{
										type:"ul"
										list:[{
											type:"success"
											text: "$M$ &nbsp; est bien placé."
										}]
									}
								}
							else
								{
									note: 0
									add: {
										type:"ul"
										list:[{
											type:"error"
											text: "$M$ &nbsp; est mal placé."
										}]
									}
								}

					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[deg, ang] = that.init(inputs,options)
				return "$#{ang.tex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Placez sur un cercle trigonométrique les points dont les mesures sont données en radians :"
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
			fct_item = (inputs, index) ->
				[deg, ang] = that.init(inputs,options)
				return "$#{ang.tex()}$"
			return {
				children: [
					"Placez sur le cercle trigonométrique les points dont les mesures sont données en radians :"
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
					{
						type:"tikz"
						left: -1.2
						bottom: -1.2
						right: 1.2
						top: 1.2
						axes:[1,1]
						misc: "\\draw[line width=1pt] (0,0) circle(1);"
						step:"step=0.1"
					}
				]
			}
	}
