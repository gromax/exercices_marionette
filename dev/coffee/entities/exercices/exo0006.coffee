define ["utils/math"], (mM) ->
	# id:6
	# title:"Placer des points dans un repère"
	# description:"Connaissant leurs coordonnées, placer des points dans un repère. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
	# keyWords:["Géométrie", "Repère", "Complexes", "Seconde", "1STL"]
	# options: {
	#	a:{ tag:"complexes", options:["non", "oui"], def:0}
	#}

	return {
		max: 11

		init: (inputs) ->
			max=@max
			return ( mM.alea.vector({ name:name, def:inputs, values:[{min:-max+1, max:max-1}]}).save(inputs) for name in ["A", "B", "C", "D", "E"] )

		getBriques: (inputs, options, fixedSettings) ->
			max = @max
			iPts = @init(inputs)
			displayedPts = ( mM.alea.vector({ name:name, values:[{min:-max+1, max:max-1}]}) for name in ["A", "B", "C", "D", "E"] )

			complexes = fixedSettings.complexe
			if complexes
				strPts = ("$z_#{pt.name} = #{pt.affixe().tex()}$" for pt in iPts).join(", &nbsp;")
				strNames = ("$#{pt.name}$" for pt in iPts).join(", &nbsp;")
				briqueEnnonce = {
					type: "text"
					ps: [
						"On se place dans le plan complexe."
						"Vous devez placer les point  : &nbsp; #{strNames} &nbsp; dont les affixes sont :"
						"#{ strPts }."
					]
				}
			else
				strPts = ("$#{pt.texLine()}$" for pt in iPts).join(", &nbsp;")
				briqueEnnonce = {
					type: "text"
					ps: [
						"On se place dans le repère &nbsp; $(O;I,J)$."
						"Vous devez placer les point suivants :"
						"#{ strPts }."
					]
				}

			initGraph = (graph)->
				graph.points = ( graph.create('point',mM.float([pt.x,pt.y]), {name:pt.name, fixed:false, size:4, snapToGrid:true, color:'blue', showInfoBox:false}) for pt in displayedPts )

			[
				{
					bareme: 100
					items: [
						briqueEnnonce
						{
							type:"jsxgraph"
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
							postVerificationRender: (view, data)->
								graph = view.graph
								for pt in view.graph.points
									graph.removeObject pt
									# pt.setAttribute {fixed:true}
								for pt in iPts
									name=pt.name
									g_x = mM.float(pt.x)
									g_y = mM.float(pt.y)
									ux = data["x#{name}"].processed
									uy = data["y#{name}"].processed

									if ux isnt g_x or uy isnt g_y
										graph.create 'point',[ux,uy], {name:name, face:"cross", fixed:true, size:4, color:'red'}
										graph.create 'point',[g_x,g_y], {name:name, fixed:true, size:6, color:'green'}
									else
										graph.create 'point',[g_x,g_y], {name:name, fixed:true, size:4, color:'green'}
						}
						{
							type: "validation"
						}
					]
					validations: {
						xA: "real"
						yA: "real"
						xB: "real"
						yB: "real"
						xC: "real"
						yC: "real"
						xD: "real"
						yD: "real"
						xE: "real"
						yE: "real"
					}
					verifications:[
						(data)->
							note = 0
							messages = []
							for pt in iPts
								g_x = mM.float(pt.x)
								g_y = mM.float(pt.y)
								a_x = data["x"+pt.name].processed
								a_y = data["y"+pt.name].processed
								d2 = (a_x-g_x)*(a_x-g_x)+(a_y-g_y)*(a_y-g_y)
								if d2<0.2
									# Le point est assez près
									messages.push {
										type: "success"
										text: "Le point #{pt.name} est bien placé."
									}
									note += .2
								else
									# Le point est trop loin
									messages.push {
										type: "error"
										text: "Le point #{pt.name} est mal placé."
									}
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
			complexes = fixedSettings.complexe
			fct_item = (inputs, index) ->
				iPts = that.init(inputs)
				if complexes
					return ("$z_#{pt.name} = #{pt.affixe().tex()}$" for pt in iPts).join(", &nbsp;")
				else
					return ("$#{pt.texLine()}$" for pt in iPts).join(", &nbsp;")

			return {
				children: [
					{
						type: "text",
						children: if complexes
							[
								"Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
								"Placez ces points dans un plan complexe."
							]
						else
							[
								"Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
								"Placez ces points dans un repère."
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
			complexes = fixedSettings.complexe
			fct_item = (inputs, index) ->
				iPts = that.init(inputs)
				if complexes
					return [
						("$z_#{pt.name} = #{pt.affixe().tex()}$" for pt in iPts).join(", ")
						{
							type:"tikz"
							left: -max
							bottom: -max
							right: max
							top: max
							Ouv: true
						}
					]
				else
					return [
						("$#{pt.texLine()}$" for pt in iPts).join(", ")
						{
							type:"tikz"
							left: -max
							bottom: -max
							right: max
							top: max
							axes:[1,1]
						}
					]

			if inputs_list.length is 1
				if complexes
					sujet = [
						"On donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
						"Placez ces points dans un plan complexe."
					]
				else
					sujet = [
						"On donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
						"Placez ces points dans un repère."
					]
				return {
					children: sujet.concat fct_item(inputs_list[0],0)
				}
			else
				if complexes
					sujet = [
						"Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
						"Placez ces points dans un plan complexe."
					]
				else
					sujet = [
						"Dans chaque cas, on donne l'affixe des points &nbsp; $A$ &nbsp; à &nbsp;$E$."
						"Places ces points dans un repère."
					]
				return {
					children: sujet.concat [
						{
							type: "enumerate"
							enumi: "1)"
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
