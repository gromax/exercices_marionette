define ["utils/math","utils/help"], (mM, help) ->
	# id:5
	# title:"Distance entre deux points"
	# description:"Dans un repère orthonormé, calculer la distance entre deux points. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
	# keyWords:["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]

	return {
		getBriques: (inputs,options) ->
			[A, B, gAB] = @init(inputs)
			if options.a?.value is 1
				zA = A.affixe().tex()
				zB = B.affixe().tex()
				enonce = [
					"Dans le plan complexe, on donne deux points $A$, d'affixe $z_A=#{zA}$ et $B$, d'affixe $z_B=#{zB}$."
					"Il faut déterminer la valeur exacte de la distance $AB$."
				]
			else
				enonce = [
					"On se place dans un repère orthonormé $(O;I,J)$"
					"On donne deux points $#{A.texLine()}$ et $#{B.texLine()}$."
					"Il faut déterminer la valeur exacte de la distance $AB$."
				]

			[
				{
					bareme:100
					title:"Distance $AB$"
					items:[
						{
							type: "text"
							rank: 1
							ps: enonce
						}
						{
							type: "input"
							rank: 2
							waited:"number"
							tag:"$AB$"
							name:"AB"
							description:"Distance AB"
							good:gAB
						}
						{
							type: "validation"
							rank: 3
							clavier: ["aide", "sqrt"]
						}
						{
							type: "aide"
							rank: 4
							list: help.geometrie.analytique.distance.concat help.interface.sqrt
						}
					]
				}
			]

		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			[
				A
				B
				A.toClone().minus(B).norme()
			]
	}
