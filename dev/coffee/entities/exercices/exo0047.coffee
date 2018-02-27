define ["utils/math","utils/help"], (mM, help) ->
	# id:47
	# title: "Calcul de l'aire d'un parallélogramme avec les complexes"
	# description: "Quatre points A, B, D sont donnés. On sait que $ABCD$ est un parallélogramme. Il faut trouver l'aire de $ABCD$."
	# keyWords:["Géométrie", "Complexe", "Première"]

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[A] }).save(inputs)
			D = mM.alea.vector({ name:"D", def:inputs, forbidden:[A] }).save(inputs)
			[
				zA = A.affixe()
				zB = B.affixe()
				zD = D.affixe()
				zAB = mM.exec [zB, zA, "-"], {simplify:true}
				zAD = mM.exec [zD, zA, "-"], {simplify:true}
				z = mM.exec [ zAB, "conjugue", zAD, "*"], {simplify:true}
				aire = z.getImag().toClone().abs()
			]

		getBriques: (inputs, options) ->
			[zA, zB, zD, zAB, zAD, z, aire] = @init(inputs)

			[
				{
					bareme: 40
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"On donne &nbsp; $A$ &nbsp; d'affixe &nbsp; $z_A=#{zA.tex()}$, &nbsp; $B$ &nbsp; d'affixe &nbsp; $z_B=#{zB.tex()}$ &nbsp; et &nbsp; $D$ &nbsp; d'affixe &nbsp; $z_D=#{zD.tex()}$."
								"Le point &nbsp; $C$ &nbsp; est tel que &nbsp; $ABCD$ &nbsp; est un parallélogramme (pas besoin de savoir l'affixe de &nbsp; $C$)"
								"On notera &nbsp; $z_1$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AD}$ &nbsp; et &nbsp; $z_2$ &nbsp; l'affixe de &nbsp; $\\overrightarrow{AB}$."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$z_1$"
							name:"z1"
							description:"Affixe de AD"
							good:zAD
						}
						{
							type: "input"
							rank:3
							waited: "number"
							tag: "$z_2$"
							name:"z2"
							description:"Affixe de AB"
							good:zAB
						}
						{
							type: "validation"
							rank: 6
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 7
							list: help.complexes.affixeVecteur
						}
					]
				}
				{
					bareme: 40
					title:"$z=z_1\\cdot\\overline{z_2}$"
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"Calculez le produit &nbsp; $z=z_1\\cdot\\overline{z_2}$ &nbsp; sous sa forme algébrique."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "$z$"
							name:"z"
							description:"Forme x+iy"
							good:z
						}
						{
							type: "validation"
							rank: 6
							clavier: []
						}
					]
				}
				{
					bareme: 20
					title:"Aire de $ABCD$"
					items: [
						{
							type:"text"
							rank:1
							ps:[
								"On peut prouver que l'aire recherchée est la valeur absolue de la partie imaginaire de &nbsp; $z$."
								"Donnez l'aire de &nbsp; $ABCD$."
							]
						}
						{
							type: "input"
							rank:2
							waited: "number"
							tag: "Aire de &nbsp; $ABCD$"
							name:"a"
							description:"Aire"
							good:aire
						}
						{
							type: "validation"
							rank: 6
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 7
							list: help.complexes.aire_plg
						}
					]
				}
			]

	}
