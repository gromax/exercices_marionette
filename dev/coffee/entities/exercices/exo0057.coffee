define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
#	id:57
#	title:"Aire sous une courbe"
#	description:"La courbe d'une fonction est donnée. Il faut déterminer l'aire sous la courbe."
#	keyWords:["Intégrale","Analyse","Primitive", "TSTL"]

	# debug : tex à faire
	# debug : pas terminé

	return {
		max: 6
		init: (inputs, options) ->
			max = @max

			if (typeof inputs.p isnt "undefined") and (typeof inputs.f isnt "undefined")
				prim = mM.parse inputs.p
				fct = mM.parse inputs.f
			else
				# On choisit des points
				fct = mM.exec ["x", "*-", "exp", "x", "*"]
				prim = mM.exec ["x", 1, "+", "x", "*-", "exp",  "*", "*-"]
			if typeof inputs.a is "undefined"
				a = mM.alea.real({min:0, max:8})*max/20
				inputs.a = String a
			else
				a = Number inputs.a
			if typeof inputs.b is "undefined"
				b = mM.alea.real({min:12, max:20})*max/20
				inputs.b = String b
			else
				b = Number inputs.b

			integrale = mM.float(prim, {x:b}) - mM.float(prim, {x:a})
			[
				prim
				fct
				a
				b
				integrale
			]

		getBriques: (inputs, options) ->
			max= @max
			[prim, fct, a, b, integrale] = @init(inputs,options)

			initGraph = (graph) ->
				fctCalc = (x) -> mM.float(fct, {x:x})
				graph.create('functiongraph', [ fctCalc, 0, max ], { strokeWidth:3, strokeColor: colors.html(0), fixed:true })

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"On vous donne la courbe de &nbsp; $x\\mapsto #{fct.tex()}$."
								"On sait que la primitive de cette fonction est &nbsp; $x \\mapsto #{prim.tex()}$."
								"On cherche l'aire de la zone sous la courbe allant de &nbsp; $x=#{a}$ &nbsp; à &nbsp; $x=#{b}$."
								"Donnez cette aire à 0,01 près."
							]
						}
						{
							type:"jsxgraph"
							divId: "jsx#{Math.random()}"
							params: {
								axis:true
								grid:true
								boundingbox:[0,max,max,0]
								keepaspectratio: true
							}
							renderingFunctions:[
								initGraph
							]
						}
						{
							type:"input"
							tag:"Aire"
							name:"A"
							description:"Aire sous la courbe"
						}

						{
							type: "validation"
						}
					]
					validations:{
						A:"number"
					}
					verifications:[
						{
							name: "A"
							tag: "Aire"
							good: integrale
							parameters: {
								arrondi:-2
							}
						}
					]
				}
			]



	}
