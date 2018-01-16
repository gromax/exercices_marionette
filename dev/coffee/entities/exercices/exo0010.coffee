define ["utils/math","utils/help"], (mM, help) ->
	# id:10
	# title:"Équation du second degré"
	# description:"Résoudre une équation du second degré."
	# keyWords:["Analyse","Trinome","Équation","Racines","Première"]
	# options: {
	#	d:{ tag:"Résoudre dans" , options:["Réels", "Complexes"] }
	#}

	Controller =
		init: (inputs, options) ->
			dansR = options.d.value is 0

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
			poly = mM.polynome.make { coeffs:[c, b, a] }

			{
				inputs: inputs
				briques:[
					{
						bareme:20
						title: "Discriminant"
						items: [
							{
								type: "text"
								rank:1
								ps: [
									"On considère le trinôme &nbsp; $P(x)=#{poly.tex()}$."
									"Donnez le discriminant &nbsp; $\\Delta$ &nbsp; de ce trinôme."
								]
							}
							{
								type: "input"
								rank:2
								waited: "number"
								tag:"$\\Delta =$"
								name:"delta"
								description:"Discriminant"
								good:poly.discriminant()
							}
							{
								type: "validation"
								rank:3
								clavier: ["aide"]
							}
							{
								type: "aide"
								rank: 4
								list: help.trinome.discriminant
							}
						]
					}
					{
						bareme:80
						title: "Solutions"
						items: [
							{
								type: "text"
								rank:1
								ps:[
									"Donnez les racines de &nbsp; $P(x)$ &nbsp; dans $\\mathbb{#{if dansR then "R" else "C"}}$."
									"Autrement dit, donnez les solutions de &npsp; $#{poly.tex()} = 0$"
									"Séparez les solutions par ;"
									"Si aucune solution, entrez ∅"
								]
							}
							{
								type: "input"
								rank: 2
								waited: "liste:number"
								tag:"$\\mathcal{S}$"
								name:"solutions"
								good:mM.polynome.solve.exact poly, {y:0, imaginaire:not dansR}
							}
							{
								type: "validation"
								rank: 3
								clavier: ["empty", "sqrt", "aide"]
							}
							{
								type: "aide"
								rank: 4
								list: help.trinome.racines
							}
						]
					}

				]
			}
		tex: (data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			if data[0]?.options.d.value is 0 then title = "Résoudre dans $\\mathbb{R}$"
			else title = "Résoudre dans $\\mathbb{C}"
			{
				title:title
				content:Handlebars.templates["tex_enumerate"] { items: ("$#{item.equation}$" for item in data), large:false }
			}

	return Controller

