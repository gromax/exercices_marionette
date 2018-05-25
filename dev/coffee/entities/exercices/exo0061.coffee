define ["utils/math", "utils/help"], (mM, help) ->
	return {
		init: (inputs, options) ->

			A = mM.alea.vector({ name:"\\vec{u}", def:inputs }).save(inputs)
			B = mM.alea.vector({ name:"\\vec{v}", def:inputs }).save(inputs)
			if inputs.sas?
				showAsSum = (inputs.sas is "1")
			else
				opt = Number options.a?.value ? 0
				switch opt
					when 0 then showAsSum = false
					when 1 then showAsSum = true
					else showAsSum = mM.alea.dice(1,2)
				if showAsSum then inputs.sas = "1" else inputs.sas = "0"

			if showAsSum
				Atex = A.texColumn()
				Btex = B.texColumn()
			else
				Atex = A.texSum(true)
				Btex = B.texSum(true)
			[
				Atex
				Btex
				A.scalaire(B)
			]

		getBriques: (inputs, options) ->
			[Atex, Btex, gAB] = @init(inputs, options)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé."
								"On donne deux vecteurs &nbsp; $#{Atex}$ &nbsp; et &nbsp; $#{Btex}$."
								"Donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$\\vec{u} \\cdot \\vec{v} =$", cols:4, class:"text-right" }
								{ latex:false, cols:8, name:"s" }
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: [
								"Si &nbsp; $\\vec{u} = \\begin{pmatrix} x\\\\ y \\end{pmatrix}$ &nbsp; et &nbsp; $\\vec{v} = \\begin{pmatrix} x'\\\\ y' \\end{pmatrix}$ &nbsp; alors &nbsp; $\\vec{u}\\cdot\\vec{v} = x\\cdot x' + y\\cdot y'$"
								"Quand on écrit les vecteurs comme combinaison de &nbsp; $\\vec{i}$ &nbsp; et &nbsp; $\\vec{j}$, il suffit de développer en sachant que &nbsp; $\\vec{i}\\cdot\\vec{i} = \\vec{j}\\cdot\\vec{j} = 1$ &nbsp; et &nbsp; $\\vec{i}\\cdot\\vec{j} = \\vec{j}\\cdot\\vec{i} = 0$."
							]
						}
					]
					validations:{
						s:"number"
					}
					verifications:[
						{
							name:"s"
							tag:"$\\vec{u} \\cdot \\vec{v}$"
							good:gAB
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[Atex, Btex, gAB] = that.init(inputs,options)
				return "$#{Atex}$ &nbsp; et &nbsp; $#{Btex}$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé."
							"On donne deux vecteurs &nbsp; $\\vec{u}$ &nbsp; et &nbsp; $\\vec{v}$."
							"Dans chaque cas, donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."
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

			if inputs_list.length is 1
				[Atex, Btex, gAB] = that.init(inputs_list[0],options)
				return {
					children: [
						"On se place dans un repère $(O;\\vec{i},\\vec{j})$ orthonormé."
						"On donne deux vecteurs $#{Atex}$ et $#{Btex}$."
						"Donnez le produit scalaire &nbsp; $\\vec{u} \\cdot \\vec{v}$."
					]
				}
			else
				fct_item = (inputs, index) ->
					[Atex, Btex, gAB] = that.init(inputs,options)
					return "$#{Atex}$ et $#{Btex}$"

				return {
					children: [
						"On se place dans un repère &nbsp; $(O;\\vec{i},\\vec{j})$ orthonormé."
						"On donne deux vecteurs $\\vec{u}$ et $\\vec{v}$."
						"Dans chaque cas, donnez le produit scalaire $\\vec{u} \\cdot \\vec{v}$."
						{
							type: "enumerate",
							enumi:"1",
							children: _.map(inputs_list, fct_item)
						}
					]
				}

	}
