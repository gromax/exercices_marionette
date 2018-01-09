define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:14
	# title:"Associer droites et fonctions affines"
	# description:"On donne cinq fonctions affines et cinq droites. Il faut associer chaque fonction affine avec la droite qui la représente."
	# keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]

	Controller =
		init: (inputs,options) ->
			max=6
			items = []
			pts = []
			for i in [0..4]
				A = mM.alea.vector({ name:"A#{i}", def:inputs, values:[{min:-max, max:max}] }).save(inputs)
				B = mM.alea.vector({ name:"B#{i}", def:inputs, values:[{min:-max, max:max}], forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
				color = colors.html(i)
				items.push { rank:i, text:"$"+ mM.droite.par2pts(A,B).affineTex("","x",true)+"$" }
				pts.push [A, B, color]

			initGraph = (graph) ->
				graph.create('line',[AB[0].toJSXcoords(),AB[1].toJSXcoords()], {strokeColor:AB[2],strokeWidth:4, fixed:true}) for AB in pts

			{
				inputs: inputs
				briques: [
					{
						bareme: 100
						items: [
							{
								type: "text"
								rank: 1
								ps: [
									"On vous donne 5 courbes et 5 fonctions affines."
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
								list: help.fonction.affine.courbe
							}
						]
					}
				]
			}

	return Controller
