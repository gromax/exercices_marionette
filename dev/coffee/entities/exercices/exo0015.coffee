define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:15
	# title:"Associer droites et équations réduites"
	# description:"On donne cinq équations réduites et cinq droites. Il faut associer chaque équation avec la droite qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
	# options: {
	#	n:{ tag:"Nombre de courbes" , options:["3", "4", "5", "6", "7"] , def:2 }
	# }

	return {
		max: 6
		init: (inputs,options) ->
			N = Number options.n.value+2
			max = @max
			items = []
			pts = []
			for i in [0..N]
				A = mM.alea.vector({ name:"A#{i}", def:inputs, values:[{min:-max, max:max}] }).save(inputs)
				B = mM.alea.vector({ name:"B#{i}", def:inputs, values:[{min:-max, max:max}], forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
				color = colors.html(i)
				items.push { rank:i, text:"$#{mM.droite.par2pts(A,B).reduiteTex()}$" }
				pts.push [A, B, color]
			[items, pts]

		getBriques: (inputs, options) ->
			max = @max

			[items, pts] = @init(inputs, options)

			initGraph = (graph) ->
				graph.create('line',[AB[0].toJSXcoords(),AB[1].toJSXcoords()], {strokeColor:AB[2],strokeWidth:4, fixed:true}) for AB in pts

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On vous donne des droites et des équations de droites."
								"Vous devez dire à quelle équation correspond chaque droite."
								"Cliquez sur les rectangles pour choisir la couleur de la droite correspondant à chaque équation, puis validez"
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
							list: help.droite.associer_equation
						}
					]
				}
			]
	}
