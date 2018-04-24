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
							ps: [
								"On considère la fonction &nbsp; $#{fTex}$."
								"Vous devez donner l'expression de sa dérivée."
								"<b>Attention :</b> La variable choisie est &nbsp; $t$ &nbsp; et pas &nbsp; $x$ &nbsp; !"
							]
						}
						{
							type: "input"
							format: [
								{ text: "$f'(t) =$", cols:2, class:"text-right" }
								{ latex: true, cols:10, name:"u"}
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.trigo.derivee
						}
					]
					validations:{
						u: "number"
					}
					verifications:[
						name:"u"
						tag:"$f'(t)$"
						good:fDer
						parameters: {
							forme:{fraction:true}
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[f, fDer, fTex] = that.init(inputs,options)
				return "$#{fTex}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Donnez la dérivée des fonctions suivantes :"
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
			that = @
			fct_item = (inputs, index) ->
				[f, fDer, fTex] = that.init(inputs,options)
				return "$#{fTex}$"

			return {
				children: [
					"Donnez la dérivée des fonctions suivantes :"
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
