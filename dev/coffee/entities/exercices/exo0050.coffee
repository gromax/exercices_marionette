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
			if typeof inputs.cv isnt "undefined" then cv = Number inputs.cv
			else
				if options.b.value is 0 then cv = inputs.cv = 0
				else cv = inputs.cv = mM.alea.real [1,2,3]
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
							rank: 1
							ps: [
								"On considère la série statistique donnée par le tableau suivant :"
							]
						}
						{
							type: "tableau"
							rank: 2
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
					rank: 3
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
							rank: 1
							ps:[
								"Soit &nbsp; $G$ &nbsp; le point moyen du nuage &nbsp; $M_i\\left(x_i;#{tagVar}_i\\right)$."
								"Donnez ses coordonnées à 0,01 près"
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$x_G$"
							name:"xG"
							description:"Abscisse de G"
							good:serie_x.moyenne()
							arrondi: -2
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$y_G$"
							name:"yG"
							description:"Ordonnée de G"
							good:serie_z.moyenne()
							arrondi: -2
						}
						{
							type: "validation"
							rank: 6
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 7
							list: help.stats.centre
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
						rank: 1
						ps:[
							"Donnez les coefficients de l'ajustement affine : &nbsp; $#{tagVar}=ax+b$ &nbsp; à 0,001 près"
							"Donnez ses coordonnées à 0,01 près"
						]
					}
					{
						type: "input"
						rank:2
						waited: "number"
						tag: "$a$"
						name:"a"
						description:"à 0,001 près"
						good:a
						arrondi: -3
					}
					{
						type: "input"
						rank:3
						waited: "number"
						tag: "$b$"
						name:"b"
						description:"à 0,001 près"
						good:b
						arrondi: -3
					}
					{
						type: "validation"
						rank: 6
						clavier: ["aide"]
					}
					{
						type: "aide"
						rank: 7
						list: help.stats.ajustement.concat(help.stats.variance,help.stats.covariance)
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
							rank: 1
							ps:[
								"Donnez la valeur de &nbsp; $y$ &nbsp; pour &nbsp; $x = #{mM.misc.numToStr(i,1)}$ &nbsp; à 0,01 près"
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$y$"
							name:"y"
							description:"à 0,01 près"
							good:y
							arrondi: -2
						}
						{
							type: "validation"
							rank: 6
							clavier: []
						}
					]
				})

			briques

		tex: (data) ->
			if not isArray(data) then data = [ data ]
			out = []
			for itData in data
				cv = Number itData.inputs.cv
				tables = itData.inputs.table.split("_")
				xs = tables[0].split(";")
				ys = tables[1].split(";")
				xs.unshift("$x_i$")
				ys.unshift("$y_i$")
				ennonce = Handlebars.templates["tex_tabular"] {
					pre:"On considère la série statistique donnée par le tableau suivant :"
					lines: [xs, ys]
					cols: xs.length
					large: false
				}
				switch cv
					when 1 then tex_chgt = "On propose le changement de variable suivant : $z = \\ln(y)$."
					when 2
						A = Number itData.inputs.A
						tex_chgt = "On propose le changement de variable suivant : $z = \\ln\\left(\\dfrac{#{A}}{y}-1\\right)$."
					when 3
						A = Number itData.inputs.A
						tex_chgt = "On propose le changement de variable suivant : $z = \\ln(#{A}-y)$."
					else tex_chgt = ""
				if cv is 0 then tagVar = "y" else tagVar = "z"
				its=[]
				if itData.options.a.value isnt 0
					its.push "Donnez les coordonnées de $G$, centre du nuage des $M_i\\left(x_i;#{tagVar}_i\\right)$ à $0,01$ près."
				its.push "Donnez les coefficients de l'ajustement affine : $#{tagVar}=ax+b$ à 0,001 près"
				if itData.options.c.value isnt 0
					i = Number itData.inputs.i
					its.push "Donnez la valeur de $y$ pour $x = #{numToStr(i,1)}$ à 0,01 près"
				out.push {
					title:@title
					content: ennonce + Handlebars.templates["tex_enumerate"] {
						pre:tex_chgt
						items: its
						large:false
					}
				}
			out
	}
