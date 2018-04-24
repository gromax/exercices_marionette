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
							rank: 1
							ps: [
								"On vous donne la courbe de &nbsp; $x\\mapsto #{fct.tex()}$."
								"On sait que la primitive de cette fonction est &nbsp; $x \\mapsto #{prim.tex()}$."
								"On cherche l'aire de la zone sous la courbe allant de &nbsp; $x=#{a}$ &nbsp; à &nbsp; $x=#{b}$."
								"Donnez cette aire à 0,01 près."
							]
						}
						{
							type:"jsxgraph"
							rank: 2
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
							rank: 3
							tag:"Aire"
							name:"A"
							description:"Aire sous la courbe"
							good:integrale
							approx:-2
							waited:"number"
						}

						{
							type: "validation"
							rank: 4
							clavier: []
						}
					]
				}
			]


		tex: (data) ->
			if not isArray(data) then data = [ data ]
			out = []
			for itemData,i in data
				if itemData.options.a.value is 0
					title = "Identifier la courbe de $f$ et celle de sa dérivée $f'$"
				else
					title = "Identifier la courbe de $f$ et celle de sa primitive $F$"
				courbes = ( { color:item.color.tex, expr:item.obj.toClone().simplify().toString().replace(/,/g,'.').replace(/x/g,'(\\x)') } for item in itemData.polys )
				graphique = Handlebars.templates["tex_courbes"] { index:i+1, max:@max, courbes:courbes, scale:.6*@max/6, center:true }
				out.push {
					title:title
					content:graphique
				}
			out
	}
