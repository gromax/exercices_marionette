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

	return {
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

			derivee = fct.derivate("x").simplify(null,true)
			# On produit une version factorisée pour avoir une version idéale du tex
			deriveeForTex = mM.factorisation derivee, /// exp\(([x*+-\d]+)\)$ ///i, { simplify:true, developp:true }

			if optE is 1
				if (typeof inputs.x isnt "undefined") then x = Number inputs.x
				else
					x = mM.alea.real { min:xmin, max:xmax }
					inputs.x = String x
				fa = mM.float fct, { x:x, decimals:2 }
				f2a = mM.float derivee, { x:x, decimals:2 }
				p = mM.misc.toPrecision(-mM.float(derivee, { x:x })*x+mM.float(fct, { x:x }),2)
				console.log p
				t = mM.exec [f2a, "x", "*", p, "+"], {simplify:true}
			else
				x = false
				fa = false
				f2a = false
				t = false

			[fct, derivee, deriveeForTex, x, fa, f2a, t]

		getBriques: (inputs, options) ->
			optE = Number(options.e.value ? 0)
			[fct, derivee, deriveeForTex, x, fa, f2a, t] = @init(inputs,options)

			briques = [
				{
					title: "Expression de $f'$"
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"Soit $f(x) = #{fct.tex()}$"
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
							tag:"$\\mathcal{T}$"
							answerPreprocessing:(userValue)->
								pattern =/y\s*=([\s*+-/0-9a-zA-Z]+)/
								result = pattern.exec(userValue)
								if result
									{ processed:result[1], error:false }
								else
									{ processed:userValue, error:"L'équation doit être de la forme y=..." }
							name:"e"
							description:"Équation de la tangente"
							good:t
							goodTex: "y = #{t.tex()}"
							developp:true
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

			briques

		getExamBriques: (inputs_list,options) ->
			optE = Number(options.e.value ? 0)
			that = @
			fct_item = (inputs, index) ->
				[fct, derivee, deriveeForTex, x, fa, f2a, t] = that.init(inputs,options)
				if optE is 1
					return "$f(x) = #{fct.tex()}$ et $a=#{x}$"
				else
					return "$f(x) = #{fct.tex()}$"

			if optE is 1
				return {
					children: [
						{
							type: "text",
							children: [
								"Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$."
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
			else
				return {
					children: [
						{
							type: "text",
							children: [
								"Dans tous les cas, déterminer l'expression de $f'(x)$."
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

		getTex: (inputs_list, options) ->
			optE = Number(options.e.value ? 0)
			that = @
			fct_item = (inputs, index) ->
				[fct, derivee, deriveeForTex, x, fa, f2a, t] = that.init(inputs,options)
				if optE is 1
					return "$f(x) = #{fct.tex()}$ et $a=#{x}$"
				else
					return "$f(x) = #{fct.tex()}$"

			if optE is 1
				return {
					children: [
						"Dans tous les cas, déterminer l'expression de $f'(x)$ ; calulez $f(a)$ et $f'(a)$ à $0,01$ près ; déterminez la tangente à $\\mathcal{C}_f$ à l'abscisse $a$."
						{
							type: "enumerate",
							refresh:true
							enumi:"1",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
			else
				return {
					children: [
						"Dans tous les cas, déterminer l'expression de $f'(x)$."
						{
							type: "enumerate",
							refresh:true
							enumi:"1",
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
