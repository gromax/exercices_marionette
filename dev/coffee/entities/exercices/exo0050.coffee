define ["utils/math","utils/help"], (mM, help) ->
	# id:50
	# title:"Ajustement par la méthode des moindres carrés"
	# description:"On vous donne une série statistique à deux variables $(x;y)$. Vous devez déterminer un ajustement de $y$ en $x$ par la méthode des moindres carrés."
	# keyWords:["Statistiques","Ajustement","carré","TSTL","BTS"]
	# options: {
	#	a:{ tag:"Coordonnées du point moyen" , options:["Non", "Oui"] }
	#	b:{ tag:"Changement de variable" , options:["Non", "Oui"] }
	#	c:{ tag:"Calcul d'interpolation" , options:["Non", "Oui"] }
	#}

	return {
		init: (inputs, options) ->
			calculInterpolation = Number(options.c.value ? 0) is 1
			changementVariable = Number(options.b.value ? 0) is 1
			if typeof inputs.cv isnt "undefined" then cv = Number inputs.cv
			else
				if changementVariable cv = inputs.cv = mM.alea.real [1,2,3]
				else cv = inputs.cv = 0
				# Les changements de variables sont : ln ; ln(A-y) ; ln(A/y-b)
			if (typeof inputs.table is "undefined")
				N = mM.alea.real { min:6, max:8 }
				ecart = mM.alea.real [1,2,4,5,10]
				min = mM.alea.real([0,1,2,3,4,5])*ecart
				max = (N-1)*ecart+min
				table_x = ( i*ecart+min for i in [0..N])
				serie_x = new SerieStat table_x
				# Si on a un changement de variable, il faudra faire un e^z
				# et donc que le e^z n'ait pas une trop grande amplitude. Disons 4.
				switch cv
					when 1 # y = exp(ax+b)
						_a = 2*(1+Math.random())/(max-min)
						_b = 1+Math.random()*4-_a*min
						table_y = ( Number((Math.exp(_a*x+_b)).toFixed(0)) for x in table_x)
					when 2 # y = A/(1+exp(ax+b)), a négatif et pour min, il faut qu'en min, ax+b proche de 2 ou 3
						A = mM.alea.real {min:200, max:800}
						inputs.A = String A
						_a = -2*(1+Math.random())/(max-min)
						_b = 2+Math.random()-_a*min
						table_y = ( Number((A/(1+Math.exp(_a*x+_b))).toFixed(0)) for x in table_x)
					when 3 # y = A - exp(ax+b) - Il faut exp(b) proche de A
						A = mM.alea.real {min:200, max:500}
						inputs.A = String A
						_a = -2*(1+Math.random())/(max-min)
						_b = Math.log(A)-Math.random()-_a*min
						table_y = ( Number((A-Math.exp(_a*x+_b)).toFixed(0)) for x in table_x)
					else
						_a = 1.1+Math.random()*10/ecart
						_b = Math.random()*(min+max)/2
						table_y = ( Number((_a*x+_b).toFixed(0)) for x in table_x)
				serie_y = new SerieStat table_y
				inputs.table = serie_x.storeInString()+"_"+serie_y.storeInString()
			else
				tables = inputs.table.split("_")
				serie_x = new SerieStat tables[0]
				serie_y = new SerieStat tables[1]
				if (cv is 2) or (cv is 3) then A = Number inputs.A
			# Calcul des bonnes valeurs de a et b tenant compte des fixNumber qui créent une variation
			switch cv
				when 1
					serie_z = serie_y.transform (x)->Math.log(x)
					chgTex = "$z = \\ln(y)$"
				when 2
					serie_z = serie_y.transform (x)->Math.log(A/x-1)
					chgTex = "$z = \\ln\\left(\\dfrac{#{A}}{y}-1\\right)$"
				when 3
					serie_z = serie_y.transform (x)->Math.log(A-x)
					chgTex = "$z = \\ln(#{A}-y)$"
				else
					serie_z = serie_y
					chgTex = false
			{ a, b, r } = serie_x.ajustement serie_z, 3

			if calculInterpolation
				if typeof inputs.i is "undefined"
					i = inputs.i = min + Math.floor( ecart*10*(mM.alea.real([1..N-2])+.2+Math.random()*.6) )/10
				else i = Number inputs.i
				switch cv
					when 1 then y = Math.exp(a*i+b)
					when 2 then y = A/(1+Math.exp(a*i+b))
					when 3 then y = A - Math.exp(a*i+b)
					else y = a*i+b
			else
				i = false
				y = false
			[serie_x, serie_y, serie_z, chgTex,a,b,i,y]
		getBriques: (inputs, options) ->
			calculG = Number(options.a.value ? 0) is 1
			[serie_x, serie_y, serie_z, chgTex,a,b,i,y] = @init(inputs,options)

			briques = [
				{
					items: [
						{
							type: "text"
							ps: [
								"On considère la série statistique donnée par le tableau suivant :"
							]
						}
						{
							type: "tableau"
							entetes: false
							lignes: [
								_.flatten(["$x_i$", serie_x.getValues()])
								_.flatten(["$y_i$", serie_y.getValues()])
							]
						}
					]
				}
			]

			if chgTex is false
				tagVar = "y"
			else
				tagVar = "z"
				briques[0].items.push({
					type:"text"
					ps:[
						"On propose le changement de variable suivant : &nbsp; #{chgTex}."
					]
				})

			if calculG
				briques.push({
					bareme: 50
					title: "Centre du nuage"
					items:[
						{
							type: "text"
							ps:[
								"Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;#{tagVar}_i\\right)$."
								"Donnez ses coordonnées à 0,01 près"
							]
						}
						{
							type:"input"
							format:[
								{ text:"G (", cols:3, class:"text-right h4"}
								{ name:"xG", cols:2, latex:true }
								{ text:";", cols:1, class:"text-center h4"}
								{ name:"yG", cols:2, latex:true }
								{ text:")", cols:1, class:"h4"}
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.stats.centre
						}
					]
					validations: {
						xG:"number"
						yG:"number"
					}
					verifications:[
						{
							name: "xG"
							tag:"$x_G$"
							good:serie_x.moyenne()
							parameters: {
								arrondi: -2
							}
						}
						{
							name: "yG"
							tag:"$y_G$"
							good:serie_z.moyenne()
							parameters: {
								arrondi: -2
							}
						}
					]
				})

			# brique pour l'ajustement lui-même
			briques.push({
				bareme: 100
				title: "Ajustement"
				items:[
					{
						type: "text"
						ps:[
							"Donnez les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$ &nbsp; à 0,001 près"
						]
					}
					{
						type: "input"
						tag: "a"
						name:"a"
						description:"à 0,001 près"
					}
					{
						type: "input"
						tag: "$b$"
						name:"b"
						description:"à 0,001 près"
					}
					{
						type: "validation"
						clavier: ["aide"]
					}
					{
						type: "aide"
						list: help.stats.ajustement.concat(help.stats.variance,help.stats.covariance)
					}
				]
				validations: {
					a:"number"
					b:"number"
				}
				verifications:[
					{
						name: "a"
						good:a
						parameters: {
							arrondi: -3
						}
					}
					{
						name: "b"
						good:b
						parameters: {
							arrondi: -3
						}
					}
				]
			})

			if i isnt false
				briques.push({
					bareme: 50
					title: "Interpolation / Extrapolation"
					items: [
						{
							type: "text"
							ps:[
								"Donnez la valeur de &nbsp; $y$ &nbsp; pour &nbsp; $x = #{mM.misc.numToStr(i,1)}$ &nbsp; à 0,01 près"
							]
						}
						{
							type: "input"
							tag: "$y$"
							name:"y"
							description:"à 0,01 près"
						}
						{
							type: "validation"
						}
					]
					validations: {
						y:"number"
					}
					verifications:[
						{
							name: "y"
							good:y
							parameters: {
								arrondi: -2
							}
						}
					]
				})

			briques

		getExamBriques: (inputs_list,options) ->
			calculG = Number(options.a.value ? 0) is 1
			changementVariable = Number(options.b.value ? 0) is 1
			calculInterpolation = Number(options.c.value ? 0) is 1
			that = @
			fct_item = (inputs, index) ->
				[serie_x, serie_y, serie_z, chgTex,a,b,i,y] = that.init(inputs, options)
				children = [
					{
						type: "tableau"
						lignes: [
							_.flatten(["$x_i$", serie_x.getValues()])
							_.flatten(["$y_i$", serie_y.getValues()])
						]
					}
				]
				ps = []
				if chgTex isnt false
					ps.push "On propose le changement de variable suivant : &nbsp; #{chgTex}."
				if i isnt false
					ps.push "Interpolation en &nbsp; $x = #{mM.misc.numToStr(i,1)}$"
				if ps.length>0
					children.push({
						type:"text"
						ps:ps
					})
				return { children: children }

			if changementVariable then tagVar = "z" else tagVar = "y"


			if not(calculG or calculInterpolation)
				children = [
					{
						type: "text"
						children:[
							"On donne les séries statistiques suivantes."
							"Dans tous les cas, donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$"
						]
					}
				]
			else
				questions = []
				if calculG
					questions.push "Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;#{tagVar}_i\\right)$. Donnez ses coordonnées à 0,01 près"
				questions.push "Donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$"
				if calculInterpolation
					questions.push "Donnez, à 0,01 près, l'interpolation de la valeur de &nbsp; $y$ &nbsp; pour la valeur de &nbsp; $x$ &nbsp; indiquée."
				children = [
					{
						type: "text"
						children:[
							"On donne les séries statistiques suivantes."
							"Dans tous les cas :"
						]
					}
					{
						type: "enumerate"
						enumi: "1"
						children: questions
					}
				]

			children.push({
				type: "subtitles"
				enumi: "A"
				refresh:true
				children: _.map(inputs_list, fct_item)
			});


			return {
				children: children
			}

		getTex: (inputs_list, options) ->
			calculG = Number(options.a.value ? 0) is 1
			changementVariable = Number(options.b.value ? 0) is 1
			calculInterpolation = Number(options.c.value ? 0) is 1
			that = @
			fct_item = (inputs, index) ->
				[serie_x, serie_y, serie_z, chgTex,a,b,i,y] = that.init(inputs, options)
				children = [
					{
						type: "tableau"
						lignes: [
							_.flatten(["$x_i$", serie_x.getValues()])
							_.flatten(["$y_i$", serie_y.getValues()])
						]
					}
				]
				ps = []
				if chgTex isnt false
					ps.push "On propose le changement de variable suivant : #{chgTex}."
				if i isnt false
					ps.push "Interpolation en $x = #{mM.misc.numToStr(i,1)}$"
				if ps.length>0
					children.push({
						type:"text"
						ps:ps
					})
				return children

			if changementVariable then tagVar = "z" else tagVar = "y"
			if inputs_list.length is 1
				if not(calculG or calculInterpolation)
					children = [
						"On donne la série statistique suivante."
						"Donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$"
					]
				else
					questions = []
					if calculG
						questions.push "Soit &nbsp; $G$ &nbsp; le point moyen du nuage $M_i\\left(x_i;#{tagVar}_i\\right)$. Donnez ses coordonnées à 0,01 près"
					questions.push "Donnez, à 0,001 près, les coefficients de l'ajustement affine : $#{tagVar}=ax+b$"
					if calculInterpolation
						questions.push "Donnez, à 0,01 près, l'interpolation de la valeur de $y$ pour la valeur de $x$ indiquée."
					children = [
						"On donne la séries statistique suivante."
						{
							type: "enumerate"
							enumi: "1"
							children: questions
						}
					]

				children.push fct_item(inputs_list[0])
				return {
					children: children
				}

			else
				if not(calculG or calculInterpolation)
					children = [
						"On donne les séries statistiques suivantes."
						"Dans tous les cas, donnez, à 0,001 près, les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$"
					]
				else
					questions = []
					if calculG
						questions.push "Soit &nbsp; $G$ &nbsp; le point moyen du nuage $M_i\\left(x_i;#{tagVar}_i\\right)$. Donnez ses coordonnées à 0,01 près"
					questions.push "Donnez, à 0,001 près, les coefficients de l'ajustement affine : $#{tagVar}=ax+b$"
					if calculInterpolation
						questions.push "Donnez, à 0,01 près, l'interpolation de la valeur de $y$ pour la valeur de $x$ indiquée."
					children = [
						"On donne les séries statistiques suivantes."
						"Dans tous les cas :"
						{
							type: "enumerate"
							enumi: "1"
							children: questions
						}
					]

				children.push({
					type: "enumerate"
					enumi: "A)"
					children: _.map(inputs_list, fct_item)
				});


				return {
					children: children
				}
	}
