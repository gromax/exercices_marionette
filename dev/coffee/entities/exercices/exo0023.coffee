define ["utils/math", "utils/help"], (mM, help) ->

	# id:23
	# title:"Équation de la tangente à une courbe"
	# description:"Pour $x$ donné, on donne $f(x)$ et $f'(x)$. Il faut en déduire l'équation de la tangente à la courbe à l'abscisse $x$."
	# keyWords:["Dérivation","Tangente","Équation","Première"]

	Controller =
		init: (inputs, options) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			droite = mM.droite.par2pts A,B
			goodEq = droite.reduiteTex()
			xAtex = A.x.tex()
			yAtex = A.y.tex()
			der = droite.m().tex()

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
									"On considère une fonction une fonction &nbsp; $f$ &nbsp; dérivable sur $\\mathbb{R}$."
									"$\\mathcal{C}$ &nbsp; est sa courbe représentative dans un repère."
									"On sait que &nbsp; $f\\left(#{xAtex}\\right) = #{yAtex}$ &nbsp; et &nbsp; $f'\\left(#{xAtex}\\right) = #{der}$."
									"Donnez l'équation de la tangente &nbsp; $\\mathcal{T}$ &nbsp; à la courbe &nbsp; $\\mathcal{C}$ &nbsp; en l'abscisse &nbsp; $#{xAtex}$."
								]
							}
							{
								type: "input"
								rank: 2
								waited: "number"
								tag:"$y=$"
								name:"e"
								description:"Équation de la tangente"
								good:droite.reduiteObject()
								developp:true
								cor_prefix: "y="
								formes:"FRACTION"
							}
							{
								type: "validation"
								rank: 3
								clavier: ["aide"]
							}
							{
								type: "aide"
								rank: 4
								list: help.derivee.tangente
							}
						]
					}
				]
			}

		tex: (data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			{
				title:@title
				content:Handlebars.templates["tex_enumerate"] {
					pre: "Dans le(s) cas suivant(s), on considère une fonction $f$ et sa courbe. Pour une certaine valeur $a$, on donne $f(a)$ et $f'(a)$. Donnez la tangente à la courbe au point d'abscisse $a$."
					items: ("$a=#{item.values.a}$, $f(a)=#{item.values.y}$ et $f'(a)=#{item.values.der}$" for item in data)
					large:false
				}
			}

	return Controller
