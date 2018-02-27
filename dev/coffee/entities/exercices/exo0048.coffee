define ["utils/math","utils/help", "utils/colors"], (mM, help, colors) ->
	# id:48
	# title: "Reconnaître les courbes d'une fonction et de sa dérivée (ou d'une fonction et et de sa primitive)"
	# description: "On donne la courbe d'une fonction $f$ et la courbe de sa dérivée $f'$ (ou de sa primitive $F$), il faut reconnaître quelle courbe correspond à $f$ et quelle courbe correspond à $f'$ (ou $F$)."
	# keyWords:["Analyse", "Déerivation", "Première", "Primitive", "Terminale"]
	# options: {
	#	a:{ tag:"Dérivée ou Primitive" , options:["Dérivée", "Primitive"] }
	#}

	return {
		max: 6
		init: (inputs, options) ->
			max = @max
			optA = Number(options.a.value ? 0) is 0

			# Initialisation du polynome
			poly = null
			if typeof inputs.p isnt "undefined"
				poly = mM.polynome.make inputs.p
				if not poly.isValid() then poly = null
			if poly is null
				# On crée un nouveau polynome
				points = [
					{x:-max, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:-max/2, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:0, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:max/2, y:mM.alea.real({min:-40, max:40})/100*max},
					{x:max, y:mM.alea.real({min:-40, max:40})/100*max}
				]
				poly = mM.polynome.make { points:points, variable:"x" }
				inputs.p = String(poly)

			# Calcul de la dérivée
			polyDer = poly.derivate()
			col = Math.floor(Math.random() * 2)

			[
				[
					[poly, colors.html(col) ]
					[polyDer, colors.html(1-col)]
				]
				[
					{ rank:col, text: "$#{if optA then "f" else "F"}$" }
					{ rank:1-col, text: "$#{if optA then "f'" else "f"}$" }
				]
			]

		getBriques: (inputs, options) ->
			optA = Number(options.a.value ? 0) is 0
			max= @max
			[polys, items] = @init(inputs,options)

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
							ps: if optA then [
								"On vous donne 2 courbes."
								"L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à sa dérivée $f'$."
								"Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $f'$."
							] else [
								"On vous donne 2 courbes."
								"L'une d'elle correspond à la fonction &nbsp; $f$, l'autre à une de ses primitive &nbsp; $F$."
								"Vous devez associer chaque courbe avec &nbsp; $f$ &nbsp; ou &nbsp; $F$."
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
							list: items
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 5
							list: if optA then help.derivee.variation else help.primitive.variation
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
