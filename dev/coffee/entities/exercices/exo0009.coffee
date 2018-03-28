define ["utils/math","utils/help"], (mM, help) ->

	# id:9
	# title:"Expression d'une fonction affine"
	# description:"On connaît deux valeurs d'une fonction affine. Il faut en déduire l'expression de la fonction."
	# keyWords:["Analyse","Fonction","Expression","Affine","Seconde"]

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
							custom_verification_message: (answer_data)->
								if not(droite.m().isOne()) and mM.float(mM.exec([answer_data["a"].processedAnswer.object, droite.m(), "*"])) is 1
									return {
										type:"warning"
										text:"Vous avez calculé &nbsp; $\\frac{#{B.x}-#{A.x}}{#{B.y}-#{A.y}}$ &nbsp; au lieu de &nbsp; $\\frac{#{B.y}-#{A.y}}{#{B.x}-#{A.x}}$."
									}
								else return null
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



		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[A, B, droite] = that.init(inputs,options)
				namef = "f_#{index}"
				return "$#{A.texFunc(namef)}$ &nbsp; et &nbsp; $#{B.texFunc(namef)}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On considère des fonctions affines dont on connaît l'image de deux antécédents."
							"Donnez l'expression de ces fonctions."
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
				[A, B, droite] = that.init(inputs,options)
				namef = "f_#{index}"
				return "$#{A.texFunc(namef)}$ et $#{B.texFunc(namef)}$"

			return {
				children: [
					"On considère des fonctions affines dont on connaît l'image de deux antécédents."
					"Donnez l'expression de ces fonctions."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}


	}
