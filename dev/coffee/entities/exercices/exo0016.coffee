define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:16
	# title:"Associer courbes et fonctions du second degré"
	# description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer la parabole qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Second degré","Seconde"]

	# debug: tex à faire


	return {
		max: 6
		init: (inputs) ->
			max = @max
			items = []
			polys = []
			# Les paraboles sont définies par sommet et point
			for i in [0..4]
				A = mM.alea.vector({ name:"A#{i}", def:inputs, values:[{min:-max, max:max}] }).save(inputs)
				B = mM.alea.vector({ name:"B#{i}", def:inputs, values:[{min:-max, max:max}], forbidden:[ {axe:"x", coords:A}, {axe:"y", coords:A} ] }).save(inputs)
				# f est un flag 1 : forme canonique, 0 sinon
				if inputs["f"+i]? then f = Number inputs["f"+i]
				else
					if cano = mM.alea.dice(1,3) then f = 1 else f = 0
					inputs["f"+i] = String f
				poly = mM.exec [ B.y, A.y, "-", B.x, A.x, "-", 2, "^", "/", "x", A.x, "-", 2, "^", "*", A.y, "+" ], { simplify:true, developp:f isnt 1 }
				color = colors.html(i)
				items.push { rank:i, text:"$x \\mapsto #{poly.tex()}$" }
				polys.push [poly, color]

		getBriques: (inputs, options) ->
			max = @max
			[items, polys] = @init(inputs)

			initGraph = (graph) ->
				for p in polys
					fct = (x) -> mM.float(p[0], {x:x})
					graph.create('functiongraph', [ fct, -max, max ], { strokeWidth:3, strokeColor: p[1], fixed:true })

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On vous donne 5 courbes et 5 fonctions du second degré."
								"Vous devez dire à quelle fonction correspond chaque courbe."
								"Cliquez sur les rectangles pour choisir la couleur de la courbe correspondant à chaque fonction, puis validez"
							]
						}
						{
							type:"jsxgraph"
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
						}
						{
							type:"color-choice"
							rank: 3
							name:"it"
							list: _.shuffle(items)
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 5
							list: help.trinome.a_et_concavite_parabole.concat(help.trinome.canonique_et_parabole,help.trinome.c_et_parabole)
						}
					]
				}
			]

		tex: (data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			out = []
			for itemData,i in data
				courbes = ( { color:item.color.tex, expr:item.obj.toClone().simplify().toString().replace(/,/g,'.').replace(/x/g,'(\\x)') } for item in itemData.polys )
				arrayShuffle itemData.items
				questions = Handlebars.templates["tex_enumerate"] { items:( item.title for item in itemData.items ) }
				graphique = Handlebars.templates["tex_courbes"] { index:i+1, max:@max, courbes:courbes, scale:.6*@max/6 }
				out.push {
					title:@title
					contents:[graphique, questions]
				}
			out
	}
