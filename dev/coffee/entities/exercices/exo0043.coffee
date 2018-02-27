define ["utils/math","utils/help"], (mM, help) ->
	# id:43
	# title: "Suites et intérêts composés"
	# description: "On donne le rendement annuel d'un placement. On cherche à savoir au bout de combien de temps on aura doublé le capital initial."
	# keyWords:["Analyse", "Suite", "Première"]

	return {
		init: (inputs) ->
			if typeof inputs.r is "undefined" then r = inputs.r = mM.alea.real({ min:15, max:50} )/10
			else r = Number inputs.r
			if typeof inputs.c is "undefined" then c = inputs.c = mM.alea.real { min:1, max:8 }
			else c = Number inputs.c
			[
				c*1000 # Premier terme
				r
				q = 1+r/100 # Raison
				Math.ceil(Math.log(2)/Math.log(q)) # Doublement
			]

		getBriques: (inputs, options) ->
			[c0, r, q, n] = @init(inputs)

			[
				{
					bareme: 50
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Le 1 janvier 2010, on place la somme de #{c0} € sur un compte bancaire qui rapporte tous les ans #{mM.misc.numToStr r}&nbsp;% d'intérêts composés."
								"Soit &nbsp; $(C_n)$ &nbsp; la suite représentant le capital sur le compte au 1 janvier de l'année 2010$+n$."
								"Donnez le premier terme &nbsp; $C_0$ &nbsp; et la raison &nbsp; $q$ &nbsp; de la suite."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$C_0$"
							name:"c0"
							description:"Premier terme"
							good:c0
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$q$"
							name:"q"
							description:"Raison"
							good:q
						}

						{
							type: "validation"
							rank: 6
							clavier: []
						}
					]
				}
				{
					bareme: 50
					title: "Doublement du capital"
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Donnez le rang &nbsp; $n$ &nbsp; de l'année pour laquelle le capital aura doublé."
								"Précisez l'année correspondante."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$n$"
							name:"n"
							description:"Rang du doublement"
							good:n
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "Année"
							name:"a"
							description:"Année du doublement"
							good:2010+n
						}

						{
							type: "validation"
							rank: 6
							clavier: []
						}
					]
				}
			]

		tex: (data) ->
			if not isArray(data) then data = [ data ]
			out=[]
			for itData in data
				out.push {
					title:@title
					content:Handlebars.templates["tex_enumerate"] {
						pre:"Le 1 janvier 2010, on place la somme de #{itData.tex.c0} euros sur un compte bancaire qui rapporte tous les ans #{itData.tex.r}\\% d'intérêts composés. Soit $(C_n)$ la suite représentant le capital sur le compte au 1 janvier de l'année 2010$+n$."
						items: [
							"$(C_n)$ est une suité géométrique. Donnez son premier terme et sa raison."
							"Au bout de combien d'année le capital sera-t-il le double du capital initial ?"
						]
						large:false
					}
				}
			out
	}

