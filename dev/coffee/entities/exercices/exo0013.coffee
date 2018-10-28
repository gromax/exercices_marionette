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

		getBriques: (inputs, options, fixedSettings) ->
			max = @max
			dmax = .3
			[A, B, droite] = @init(inputs, fixedSettings)
			M = A.toClone("")
			m = droite.m().simplify()


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
							ps: if fixedSettings.affine
								[
									"On considère la fonction affine &nbsp; $#{droite.affineTex("f","x")}$."
									"Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB)$ &nbsp; soit la courbe représentative de la fonction."
								]
							else
								if fixedSettings.point
									[
										"On considère la droite &nbsp; $\\mathcal{D}$ &nbsp; de coefficient directeur &nbsp; $m=#{m.tex()}$ &nbsp; et passant par le point de coordonnées &nbsp; $#{M.texLine()}$."
										"Placez les points &nbsp; $A$ &nbsp; et &nbsp; $B$ &nbsp; de sorte que &nbsp; $(AB) = \\mathcal{D}$."
									]
								else
									[
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
							postVerificationRender: (view, data)->
								for pt in view.graph.points
									pt.setAttribute {fixed:true, x:data["x"+pt.name].processed, y: data["y"+pt.name].processed}
								view.graph.create('line',droite.float_2_points(max), {strokeColor:'blue',strokeWidth:2,fixed:true})
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

		getExamBriques: (inputs_list,options, fixedSettings) ->
			max = @max
			that = @

			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs)
				if fixedSettings.affine
					return "$#{droite.affineTex("f_{"+index+"}","x")}$"
				else
					if fixedSettings.point
						m = droite.m().simplify()
						return "$m=#{m.tex()}$ &nbsp; et &nbsp; $#{A.texLine()}$"
					else
						return "$#{droite.reduiteTex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							if fixedSettings.affine
								"Tracez dans un repère les courbes des fonctions affines suivantes :"
							else
								if fixedSettings.point
									"Dans chaque cas, tracez dans un repère les droites dont le coefficient directeur est &nbsp; $m$ &nbsp; et passant par le point &nbsp; $A$."
								else
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

		getTex: (inputs_list, options, fixedSettings) ->
			that = @
			max = @max
			if fixedSettings.affine
				fct_item = (inputs, index) ->
					[A, B, droite] = that.init(inputs)
					name = "f_{#{index}}"
					return "$#{droite.affineTex(name)}$"
			else
				if fixedSettings.point
					fct_item = (inputs, index) ->
						[A, B, droite] = that.init(inputs)
						m = droite.m().simplify()
						return "$m=#{m.tex()}$ et $#{A.texLine()}$"
				else
					fct_item = (inputs, index) ->
						[A, B, droite] = that.init(inputs)
						return "$#{droite.reduiteTex()}$"

			if inputs_list.length is 1
				return {
					children: [
						if fixedSettings.affine
							"Tracez dans le repère la courbe de la fonction définie par : #{fct_item(inputs_list[0],0)}"
						else
							if fixedSettings.point
								[A, B, droite] = that.init(inputs_list[0])
								m = droite.m().simplify()
								"Tracez dans le repère la droite de coefficient directeur $m=#{m.tex()}$ et passant par $#{A.texLine()}$."
							else
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
						if fixedSettings.affine
							"Tracez dans le repère les courbes des fonctions affines suivantes :"
						else
							if fixedSettings.point
								"Tracez les droites dont on vous donne le coefficient directeur et un point :"
							else
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
