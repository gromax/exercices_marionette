define ["utils/math","utils/help"], (mM, help) ->
	# id:18
	# title:"Tracer la courbe d'une fonction $x\\mapsto |ax+b|$"
	# description:"On donne l'expression d'une fonction affine avec une valeur absolue. Il faut tracer sa courbe représentative."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]

	return {
		max:10
		init: (inputs) ->
			max = 10

			A = mM.alea.vector({ name:"A", def:inputs, values:[{min:-max, max:max}, {min:1, max:max}] }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, values:[{min:-max, max:max}, {min:-max, max:-1}], forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]

		getBriques: (inputs, options) ->
			max = @max
			[A, B, droite] = @init(inputs)

			initGraph = (graph) ->
				pts = [
					{name:"A", x:-max+1, y:max-1}
					{name:"B", x:0, y:-max+1}
					{name:"C", x:max-1, y:max-1}
				]
				graph.points = ( graph.create('point', [pt.x,pt.y], {name:pt.name, fixed:false, size:4, color:'blue', showInfoBox:false}) for pt in pts )
				graph.create('line',["A","B"], {strokeColor:'#00ff00',strokeWidth:2, straightLast:false })
				graph.create('line',["B","C"], {strokeColor:'#00ff00',strokeWidth:2, straightFirst:false})
				graph.on 'move', () ->
					if @points[0].X()>@points[1].X()-.1 then @points[0].moveTo([@points[1].X()-.1, @points[0].Y()])
					if @points[2].X()<@points[1].X()+.1 then @points[2].moveTo([@points[1].X()+.1, @points[2].Y()])

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"Dans le repère ci-contre, on vous demande de tracer la courbe de la fonction &nbsp; $f$ &nbsp;:"
								"$f:x\\mapsto\\left|#{droite.reduiteObject().tex()}\\right|$."
								"Pour cela, ajustez les positions des points &nbsp; $A$, &nbsp; $B$ et &nbsp; $C$."
							]
						}
						{
							type:"jsxgraph"
							divId: "jsx#{Math.random()}"
							params: {
								axis:true
								grid:true
								boundingbox:[-max, max, max, -max]
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
							postVerificationRender:(view, data)->
								graph = view.graph
								for pt in graph.points
									pt.setAttribute {fixed:true, x:u[pt.name].x, y:u[pt.name].y}
								y1 = Math.abs(droite.float_y(-max))
								y2 = Math.abs(droite.float_y(max))
								x0 = droite.float_x(0)
								graph.create('line',[[-max,y1],[x0,0]], {strokeColor:'blue',strokeWidth:2,fixed:true, straightLast:false})
								graph.create('line',[[x0,0],[max,y2]], {strokeColor:'blue',strokeWidth:2,fixed:true, straightFirst:false})
								graph.create('line',mM.float([[A.x,A.y],[B.x,B.y]]), {strokeColor:'blue',strokeWidth:1,fixed:true,dash:2})

						}
						{
							type: "validation"
						}
					]
					validations:{
						xA:"real"
						yA:"real"
						xB:"real"
						yB:"real"
						xC:"real"
						yC:"real"
					}
					verifications:[
						(data) ->
							dmax = .2
							messages = []
							note = 0
							u = {}
							for p in ["A", "B", "C"]
								x = Number answers_data["x"+p]
								y = Number answers_data["y"+p]
								u[p] = { x:x, y:y }
								if droite.float_y(x)>0 then d = droite.float_distance(x,y)
								else d = droite.float_distance(x,-y)
								if d<dmax
									messages.push {
										type: "success"
										text: "Le point #{p} est bien placé."
									}
									note += .34
								else
									messages.push {
										type: "error"
										text: "Le point #{p} est mal placé."
									}
							if note>1 then note=1

							{
								note: note
								add:{
									type:"ul"
									list: messages
								}
							}
					]

				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs,options)
				namef = "f_#{index}"
				return "$#{namef}:x\\mapsto\\left|#{droite.reduiteObject().tex()}\\right|$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Tracez les courbes des fonctions suivantes."
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
				[A, B, droite] = that.init(inputs,options)
				namef = "f_#{index}"
				return "$#{namef}:x\\mapsto\\left|#{droite.reduiteObject().tex()}\\right|$"

			return {
				children: [
					"Tracez les courbes des fonctions suivantes."
					{
						type: "enumerate",
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
