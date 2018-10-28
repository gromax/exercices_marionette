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
							ps: [
								"On considère une fonction affine &nbsp; $f$ &nbsp; telle que &nbsp; $#{A.texFunc("f")}$ &nbsp; et &nbsp; $#{B.texFunc("f")}$."
								"On sait que &nbsp; $f(x)=a\\cdot x+b$. Vous devez donner &nbsp; $a$ &nbsp; et &nbsp; $b$."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$a =$", cols:3, class:"text-right" }
								{ name:"a", cols:5, latex:true }
							]
						}
						{
							type: "input"
							format: [
								{ text:"$b =$", cols:3, class:"text-right" }
								{ name:"b", cols:5, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: help.fonction.affine.expression
						}
					]
					validations:{
						a:"number"
						b:"number"
					}
					verifications:[
						{
							name: "a"
							tag:"$a$"
							good:droite.m()
						}
						(data)->
							if not(droite.m().isOne()) and mM.float(mM.exec([data["a"].processed.object, droite.m(), "*"])) is 1
								{
									add: {
										type:"ul"
										list:[
											{
												type:"warning"
												text:"Vous avez calculé &nbsp; $\\frac{\\Delta x}{\\Delta y}$ &nbsp; au lieu de &nbsp; $\\frac{\\Delta y}{\\Delta x}$."
											}
										]
									}
								}
							else
								null
						{
							name: "b"
							tag:"$b$"
							good:droite.p()
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
