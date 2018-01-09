define ["utils/math","utils/help"], (mM, help) ->
	# id:51
	# title:"Loi uniforme"
	# description:"Calculer des probabilités avec la loi uniforme."
	# keyWords:["probabilités","uniforme","TSTL"]
	# options: {
	# 	a:{ tag:"Calcul $E(X)$" , options:["Oui", "Non"] , def:0 }
	#	b:{ tag:"Calcul $\\sigma(X)$" , options:["Oui", "Non"] , def:0 }
	#}

	Controller =
		init: (inputs, options) ->
			if (typeof inputs.Xmin is "undefined") then inputs.Xmin = mM.alea.real({min:-5, max:20})
			Xmin = Number inputs.Xmin
			if (typeof inputs.Xmax is "undefined") then inputs.Xmax = mM.alea.real({min:Xmin+10, max:100})
			Xmax = Number inputs.Xmax
			# Symbole d'inégalité à gauche
			symbs = ["","<","\\leqslant"]
			if (typeof inputs.sa is "undefined") then inputs.sa = mM.alea.real [0,1,2]
			sa = Number inputs.sa
			if sa is 0
				a = Xmin
				ens = "X"
			else
				if (typeof inputs.a is "undefined") then inputs.a = mM.alea.real({min:Xmin, max:Xmax-1})
				a = Number inputs.a
				ens = "#{a} #{symbs[sa]} X"
			if (typeof inputs.sb is "undefined")
				if sa is 0 then inputs.sb = mM.alea.real([1,2])
				else inputs.sb = mM.alea.real([0,1,2])
			sb = Number inputs.sb
			if sb is 0 then b = Xmax
			else
				if (typeof inputs.b is "undefined") then inputs.b = mM.alea.real({min:a+1, max:Xmax})
				b = Number inputs.b
				ens = "#{ens} #{symbs[sb]} #{b}"

			items = [
				{
					type: "text"
					rank: 1
					ps:[
						"La variable aléatoire $X$ suit la <b>loi uniforme</b> sur $[#{Xmin};#{Xmax}]$."
						"<b>Remarque :</b> on note parfois $\\mathcal{U}([#{Xmin};#{Xmax}])$ cette loi."
					]
				}
				{
					type: "input"
					rank: 2
					waited: "number"
					tag: "$p(#{ens})$"
					name: "pX"
					description: "Valeur à 0,01 près"
					good: (b-a)/(Xmax-Xmin)
					arrondi: -2
				}
			]


			if options.a.value is 0 then items.push {
				type: "input"
				rank: 3
				waited: "number"
				tag: "$E(X)$"
				name: "E"
				description: "Espérance à 0,01 près"
				good: (Xmin+Xmax)/2
				arrondi: -2
			}

			if options.b.value is 0 then items.push {
				type: "input"
				rank: 4
				waited: "number"
				tag: "$\\sigma(X)$"
				name: "sig"
				description: "Ecart-type à 0,01 près"
				good: (Xmax-Xmin)/Math.sqrt(12)
				arrondi: -2
			}

			items.push {
				type: "validation"
				rank: 5
				clavier: ["aide"]
			}

			items.push {
				type:"aide"
				rank: 6
				list: help.proba.binomiale.calculette
			}

			{
				inputs: inputs
				briques: [
					{
						bareme:100
						items: items
					}
				]

			}
		tex: (data) ->
			# à faire
			symbs = ["","<","\\leqslant"]
			if not isArray(data) then data = [ data ]
			its=[]
			for itData in data
				sa = Number itData.inputs.sa
				if sa is 0 then ens = "X"
				else
					a = Number itData.inputs.a
					ens = "#{a} #{symbs[sa]} X"
				sb = Number itData.inputs.sb
				if sb isnt 0
					b = Number itData.inputs.b
					ens = "#{ens} #{symbs[sb]} #{b}"
				if (itData.options.a isnt 0) or (itData.options.b isnt 0)
					itsQuest = ["Donnez $p(#{ens})$"]
					if itData.options.a isnt 0 then itsQuest.push "Donnez $E(X)$ à $0,01$ près."
					if itData.options.b isnt 0 then itsQuest.push "Donnez $\\sigma(X)$ à $0,01$ près."
					its.push Handlebars.templates["tex_enumerate"] {
						pre:"La variable $X$ suit la loi uniforme sur $[#{itData.inputs.Xmin};#{itData.inputs.Xmax}]$."
						items: itsQuest
					}
				else its.push """La variable $X$ suit la loi uniforme sur $[#{itData.inputs.Xmin};#{itData.inputs.Xmax}]$.

				Donnez $p(#{ens})$"""
			if its.length > 1 then [{
					title:@title
					content:Handlebars.templates["tex_enumerate"] {
						items: its
						numero:"1)"
						large:false
					}
				}]
			else [{
					title:@title
					content:Handlebars.templates["tex_plain"] {
						content: its[0]
						large:false
					}
				}]

	return Controller
