define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:17
	# title:"Associer courbes et fonctions du second degré"
	# description:"Cinq paraboles sont données. On propose cinq fonctions du second degré dont on ne connait que le discriminant et le coefficient du terme de second degré. À chaque fonction, il faut attribuer la parabole qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]

	# debug: tex à faire


	return {
		max: 6
		init: (inputs) ->
			max = @max
			items = []
			polys = []

			# Les paraboles sont définies par sommet et point
			liste = [{ap:false, d:-1}, {ap:false, d:0}, {ap:false, d:1}, {ap:true, d:-1}, {ap:true, d:0}, {ap:true, d:1}]
			liste = _.shuffle(liste)

			for i in [0..4]
				if (typeof inputs["xA"+i] isnt "undefined")
					xA = Number inputs["xA"+i]
					yA = Number inputs["yA"+i]
					xB = Number inputs["xB"+i]
					yB = Number inputs["yB"+i]
				else
					cas = liste.shift()
					# On tire au hasard 4 pts et on calcule la fonction correspondante
					xA = inputs["xA"+i] = xB = mM.alea.real { min:-max+1, max:max-1 }
					xB = mM.alea.real { min:-max+1, max:max-1 } while (xA is xB)
					inputs["xB"+i] = xB
					switch
						when cas.ap and (cas.d is -1)
							yA = mM.alea.real { min:1, max:max-1 }
							yB = mM.alea.real { min:yA+1, max:max }
						when not cas.ap and (cas.d is 1)
							yA = mM.alea.real { min:1, max:max-1 }
							yB = mM.alea.real { min:-max, max:yA-1 }
						when not cas.ap and (cas.d is -1)
							yA = mM.alea.real { min:-max+1, max:-1 }
							yB = mM.alea.real { min:-max, max:yA-1 }
						when cas.ap and (cas.d is 1)
							yA = mM.alea.real { min:-max+1, max:-1 }
							yB = mM.alea.real { min:yA+1, max:max }
						when cas.ap
							yA = 0
							yB = mM.alea.real { min:1, max:max }
						else
							yA = 0
							yB = mM.alea.real { min:-max, max:-1 }
					inputs["yA"+i] = yA
					inputs["yB"+i] = yB
				a = mM.exec [ yB, yA, "-", xB, xA, "-", 2, "^", "/" ], { simplify:true }
				poly = mM.exec [ a, "x", xA, "-", 2, "^", "*", yA, "+" ], { simplify:true }
				delta = mM.exec [ -4, a, yA, "*", "*"], { simplify:true }
				color = colors.html(i)

				items.push { rank:i, text:"$\\Delta = #{delta.tex()}$ &nbsp; et &nbsp; $a = #{a.tex()}$"}
				polys.push [poly, color]
			[ items, polys ]
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
					items:[
						{
							type: "text"
							rank:1
							ps: [
								"On vous donne 5 cas de fonctions du second degré, donc de la forme &nbsp;& $f:x\\mapsto ax^2+bx+c$."
								"On ne connaît que les valeurs de &nbsp; $\\Delta$ &nbsp; et de &nbsp; $a$."
								"Vous devez les associer aux courbes en cliquant sur les rectangles pour sélectionner la bonne couleur."
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
							list: help.trinome.a_et_concavite_parabole.concat(help.trinome.delta_et_parabole)
						}
					]
				}
			]

		tex: (data) ->
			if not isArray(data) then data = [ data ]
			out = []
			for itemData,i in data
				courbes = ( { color:item.color.tex, expr:item.obj.toClone().simplify().toString().replace(/,/g,'.').replace(/x/g,'(\\x)') } for item in itemData.polys )
				arrayShuffle itemData.items
				questions = Handlebars.templates["tex_enumerate"] { items:( item.title for item in itemData.items ) }
				graphique = Handlebars.templates["tex_courbes"] { index:i+1, max:@max, courbes:courbes, scale:.5 }
				out.push {
					title:@title
					contents:[graphique, questions]
				}
			out
	}
