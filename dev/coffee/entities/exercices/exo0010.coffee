define ["utils/math","utils/help"], (mM, help) ->
	# id:10
	# title:"Équation du second degré"
	# description:"Résoudre une équation du second degré."
	# keyWords:["Analyse","Trinome","Équation","Racines","Première"]
	# options: {
	#	d:{ tag:"Résoudre dans" , options:["Réels", "Complexes"] }
	#}

	return {
		init: (inputs, dansR) ->
			if (typeof inputs.a isnt "undefined") and (typeof inputs.b isnt "undefined") and (typeof inputs.c isnt "undefined")
				[a,b,c] = ( mM.toNumber(item) for item in [inputs.a, inputs.b, inputs.c] )
			else
				# 1 fois sur 4, on aura un delta<0 pour une équation dans R
				# 1 fois sur 2 si dans C
				if dansR then al = mM.alea.real [1,2,3,4]
				else al = mM.alea.real [1,2]
				a = mM.alea.number [-2,-1,1,2,3]
				x0 = mM.alea.number {min:-10, max:10}
				b = mM.exec [-2,x0,a, "*","*" ], {simplify:true}
				d = mM.alea.number {min:0, max:10}
				if al is 1 then c = mM.exec [x0, x0, "*", d, d, "*", "+", a, "*"], {simplify:true}
				else c = mM.exec [x0, d, "-", x0, d, "+", "*", a, "*"], {simplify:true}
				inputs.a = String(a)
				inputs.b = String(b)
				inputs.c = String(c)

			return mM.polynome.make { coeffs:[c, b, a] }

		getBriques: (inputs, options) ->
			dansR = Number(options.d.value) is 0
			poly = @init(inputs, dansR)

			[
				{
					bareme:20
					title: "Discriminant"
					items: [
						{
							type: "text"
							ps: [
								"On considère le trinôme &nbsp; $P(x)=#{poly.tex()}$."
								"Donnez le discriminant &nbsp; $\\Delta$ &nbsp; de ce trinôme."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$\\Delta =$", cols:3, class:"text-right" }
								{ name:"delta", cols:5, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["aide", "sqrt", "pow"]
						}
						{
							type: "aide"
							list: help.trinome.discriminant
						}
					]
					validations:{
						delta:"number"
					}
					verifications:[
						{
							name:"delta"
							tag:"$\\Delta$"
							good:poly.discriminant()
						}
					]
				}
				{
					bareme:80
					title: "Solutions"
					items: [
						{
							type: "text"
							ps:[
								"Donnez les racines de &nbsp; $P(x)$ &nbsp; dans $\\mathbb{#{if dansR then "R" else "C"}}$."
								"Autrement dit, donnez les solutions de &npsp; $#{poly.tex()} = 0$"
								"Séparez les solutions par ;"
								"Si aucune solution, entrez ∅"
							]
						}
						{
							type: "input"
							format: [
								{ text:"$\\mathcal{S} = $", cols:3, class:"text-right" }
								{ name:"solutions", cols:8, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["empty", "sqrt", "aide"]
						}
						{
							type: "aide"
							list: help.trinome.racines
						}
					]
					validations:{
						solutions:"liste"
					}
					verifications:[
						{
							name:"solutions"
							type:"all"
							tag:"$\\mathcal{S}$"
							good: mM.polynome.solve.exact poly, {y:0, imaginaire:not dansR}
						}
					]
				}

			]

		getExamBriques: (inputs_list,options) ->
			dansR = Number(options.d.value) is 0
			if dansR then ensemble = "R"
			else ensemble = "C"
			that = @
			fct_item = (inputs, index) ->
				poly = that.init(inputs,dansR)
				return "$P(x)=#{poly.tex()}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"Pour les polynomes suivants, donnez le discriminant et les racines dans &nbsp; $\\mathbb{#{ensemble}}$ &nbsp; quand elles existent."
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
			dansR = Number(options.d.value) is 0
			if dansR then ensemble = "R"
			else ensemble = "C"
			that = @
			fct_item = (inputs, index) ->
				poly = that.init(inputs,dansR)
				return "$P(x)=#{poly.tex()}$"

			return {
				children: [
					"Pour les polynomes suivants, donnez le discriminant et les racines dans $\\mathbb{#{ensemble}}$ quand elles existent."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
