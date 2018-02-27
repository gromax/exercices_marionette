define ["utils/math", "utils/help"], (mM, help) ->
	# id:37
	# title:"Dérivée d'une fonction trigonométrique"
	# description:"Dériver une fonction de la forme $f(t)=A\\sin(\\omega t+\\varphi)$."
	# keyWords:["Dérivation","Trigonométrie","Première"]

	return {
		init: (inputs) ->
			unless inputs.f? then inputs.f = "#{ mM.alea.real { min:1, max:50 } } #{ mM.alea.in ["cos","sin"] }(#{ mM.alea.real { min:0, max:30, sign:true } } t #{ mM.alea.in ["+","-"] } #{ mM.alea.real { min:0, max:30 } })"
			[
				f = mM.toNumber(inputs.f).simplify()
				f.derivate("t")
				"f: t \\mapsto #{f.tex()}"
			]

		getBriques: (inputs, options) ->
			[f, fDer, fTex] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On considère la fonction &nbsp; $#{fTex}$."
								"Vous devez donner l'expression de sa dérivée."
								"<b>Attention :</b> La variable choisie est &nbsp; $t$ &nbsp; et pas &nbsp; $x$ &nbsp; !"
							]
						}
						{
							type: "input"
							rank: 2
							waited: "number"
							name: "u"
							tag:"$f'(t)$"
							description:"Expression de f'"
							good:fDer
							forme:{fraction:true}
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 5
							list: help.trigo.derivee
						}
					]
				}
			]

	}
