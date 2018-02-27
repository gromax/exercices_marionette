define ["utils/math","utils/help"], (mM, help) ->

	# id:9
	# title:"Expression d'une fonction affine"
	# description:"On connaît deux valeurs d'une fonction affine. Il faut en déduire l'expression de la fonction."
	# keyWords:["Analyse","Fonction","Expression","Affine","Seconde"]

	# debug : Ajouter le custom permettant de gérer le cas d'une inversion

	return {
		init: (inputs) ->
			A = mM.alea.vector({ name:"A", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"B", def:inputs, forbidden:[ {axe:"x", coords:A} ] }).save(inputs)
			[
				A
				B
				mM.droite.par2pts A,B
			]

		getBriques: (inputs, options) ->
			[A, B, droite] = @init(inputs)

			[
				{
					bareme:100
					items:[
						{
							type: "text"
							rank: 1
							ps: [
								"On considère une fonction affine &nbsp; $f$ &nbsp; telle que &nbsp; $#{A.texFunc("f")}$ &nbsp; et &nbsp; $#{B.texFunc("f")}$."
								"On sait que &nbsp; $f(x)=a\\cdot x+b$. Vous devez donner &nbsp; $a$ &nbsp; et &nbsp; $b$."
							]
						}
						{
							type: "input"
							rank: 2
							waited:"number"
							tag:"$a$"
							name:"a"
							description:"Valeur de a"
							good:droite.m()
						}
						{
							type: "input"
							rank: 3
							waited:"number"
							tag:"$b$"
							name:"b"
							description:"Valeur de b"
							good:droite.p()
						}
						{
							type: "validation"
							rank: 4
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 5
							list: help.fonction.affine.expression
						}
					]
				}
			]
	}
