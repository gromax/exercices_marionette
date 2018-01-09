define ["utils/math","utils/help"], (mM, help) ->
	# id:28
	# title:"Dériver une fonction"
	# description:"Une fonction polynome est donnée, il faut la dériver."
	# keyWords:["Analyse", "fonction", "Dérivation", "Première"]
	# options: {
	#	a:{ tag:"Avec ln ou exp" , options:["Sans", "ln(x)", "ln(ax+b)", "exp(x)", "exp(ax)"] }
	#	d:{ tag:"Degré max du polynôme", options:[0,1,2,3,4,5] }
	#	e:{ tag:"Tangente", options:["non", "oui"] }
	# }

	Controller =
		init: (inputs, options) ->
			optA = Number(options.a.value ? 0)
			optD = Number(options.d.value ? 0)
			optE = Number(options.e.value ? 0)
			xmin = -10 # pour le calcul de la tangente
			xmax=10
			# debug ancienne version
			if inputs.poly then inputs.fct = inputs.poly
			if (typeof inputs.fct is "undefined")
				if (optD is 0) then operands = [
					mM.alea.number { denominator:[1,2,3], values:{ min:-10, max:10} }
				]
				else operands = [
					mM.alea.poly { degre:{min:1, max:optD }, coeffDom:[1,2,3], denominators:[1,2,3], values:{ min:-10, max:10} }
				]
				if (optA is 1) or (optA is 2)
					# Il y aura un ln que l'on va multiplier par :
					# Soit du a, soit du ax, soit du ax^2+bx,au pire par du degré 2
					if mM.alea.dice(2,3) then coeff = mM.exec [ mM.alea.poly({ degre:[0,1], coeffDom:[1,2,3], values:{ min:-10, max:10} }), "x", "*" ], { simplify:true, developp:true }
					else coeff = mM.alea.number { denominators:[1,2], values:{ min:-10, max:10} }
					operands.push coeff
					if optA is 2
						a = mM.alea.real {min:1, max:10}
						b = mM.alea.real {min:-10, max:10}
						xmin = (1-b)/a # Pour l'éventuel calcul de tangente
						xmax = (20-b)/a
						operands.push(a,"x","*",b,"+")
					else
						operands.push "x"
						xmin = 1 # Pour l'éventuel calcul de tangente
						xmax = 20
					operands.push "ln", "*", "+"
				if (optA is 3) or (optA is 4)
					# Il y aura un exp que l'on va multiplier avec le polynome
					if optA is 4
						aPol = mM.alea.real({min:0.01, max:0.5, real:2, sign:true})
						xmin = -2/Math.abs(aPol)
						xmax = 2/Math.abs(aPol)
						operands.push aPol, "x", "*"
					else
						operands.push "x"
						xmin = -2
						xmax = 2
					operands.push "exp", "*"
				fct = mM.exec operands, { simplify:true }
				inputs.fct = String fct
			else fct = mM.parse(inputs.fct)
			fct_tex = fct.tex()
			derivee = fct.derivate("x").simplify(null,true)
			# On produit une version factorisée pour avoir une version idéale du tex
			deriveeForTex = mM.factorisation derivee, /// exp\(([x*+-\d]+)\)$ ///i, { simplify:true, developp:true }

			briques = [
				{
					title: "Expression de $f'$"
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"Soit $f(x) = #{fct_tex}$"
								"Donnez l'expression de $f'$, fonction dérivée de $f$."
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							tag:"$f'(x)$"
							name:"d"
							description:"Expression de la dérivée"
							good:derivee
							developp:true
							goodTex:deriveeForTex.tex()
							formes: { fraction:true, distribution:true }
						}
						{
							type: "validation"
							rank: 3
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 4
							list: help.derivee.basics
						}
					]
				}
			]

			if optE is 1
				if (typeof inputs.x isnt "undefined") then x = Number inputs.x
				else
					x = mM.alea.real { min:xmin, max:xmax }
					inputs.x = String x
				fa = mM.float fct, { x:x, decimals:2 }
				f2a = mM.float derivee, { x:x, decimals:2 }
				t = mM.exec [f2a, "x", x, "-", "*", fa, "+"], {simplify:true, developp:true}
				briques.push {
					title:"Calcul de $f(a)$ et $f'(a)$ en $a=#{x}$"
					bareme:100
					items:[
						{
							type: "input"
							rank: 1
							waited: "number"
							tag: "$f(#{x})$"
							name: "fa"
							description: "Valeur de f(a) à 0,01"
							good: fa
							arrondi: -2
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							tag: "$f'(#{x})$"
							name: "f2a"
							description: "Valeur de f'(a) à 0,01"
							good: f2a
							arrondi: -2
						}
						{
							type: "validation"
							rank: 3
							clavier: []
						}
					]
				}

				briques.push {
					title:"Équation de la tangente $\\mathcal{T}_{#{x}}$ à l'abscisse $#{x}$"
					bareme:100
					items: [
						{
							type: "input"
							rank: 1
							waited: "number"
							tag:"$y=$"
							name:"e"
							description:"Équation de la tangente"
							good:t
							developp:true
							cor_prefix:"y="
							formes:"FRACTION"
						}
						{
							type: "validation"
							rank: 2
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 3
							list: help.derivee.tangente
						}
					]
				}

			{
				inputs: inputs
				briques: briques
			}

		tex: (data) ->
			# en travaux
			if not isArray(data) then data = [ data ]
			if (data[0]?.options.e?.value is 1)
				{
					title:@title
					content:Handlebars.templates["tex_enumerate"] {
						pre:"Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$."
						items: ("$x \\mapsto #{item.fct}$ et $a=#{item.inputs.x}$" for item in data)
						large:false
					}
				}
			else
				{
					title:@title
					content:Handlebars.templates["tex_enumerate"] {
						pre: "Donnez les dérivées des fonctions suivantes :"
						items: ("$x \\mapsto #{item.fct}$" for item in data)
						large:false
					}
			}

	return Controller
