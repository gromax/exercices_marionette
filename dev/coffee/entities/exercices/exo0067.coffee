define ["utils/math"], (mM, help) ->
	return {
		init: (inputs, options) ->
			if inputs.vals?
				vals = ( Number it for it in inputs.vals.split(";"))
			else
				vals= ( mM.alea.real {min:-15, max:15} for i in [1..6])
				inputs.vals = vals.join(";")
			A = mM.vector("A", {x: vals[0], y:vals[1]})
			B = mM.vector("B", {x: vals[2], y:vals[3]})
			if vals[0] is vals[2] and vals[3] is vals[1] then vals[2] = vals[2]+1 # évite un vecteur nul
			C = mM.vector("C", {x: vals[4], y:vals[5]})
			if vals[0] is vals[4] and vals[5] is vals[1] then vals[5] = vals[5]+1 # évite un vecteur nul
			vAB = B.toClone().minus(A).setName("\\overrightarrow{AB}")
			vAC = C.toClone().minus(A).setName("\\overrightarrow{AC}")
			scal = vAB.scalaire(vAC)

			cA = Number(options.a?.value) ? 0  #Calcul d'angle
			if cA is 1
				AB = vAB.norme()
				AC = vAC.norme()
				c = mM.float(scal) / (mM.float(AB)*mM.float(AC))
				CAparams = [
					AB
					AC
					Math.acos(c)*180 / Math.PI
				]
			else
				CAparams = false


			[ [A, B, C, vAB, vAC], scal, CAparams]

		getBriques: (inputs,options, fixedSettings) ->
			[ coords, scal, CAparams] = @init(inputs, options)
			[A,B,C, vAB, vAC] = coords

			out = [
				{
					bareme:50
					items:[
						{
							type: "text"
							ps: [
								"On se place dans un repère orthonormé $(O;I,J)$"
								"On donne trois points $#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$."
								"Commencez par donner les coordonnées des vecteurs."
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\overrightarrow{AB} =$", cols:3, class:"text-right" }
								{ text:"(", cols:1, class:"text-right h4"}
								{ name:"ABx", cols:3, latex:true }
								{ text:";", cols:1, class:"text-center h4"}
								{ name:"ABy", cols:3, latex:true }
								{ text:")", cols:1, class:"h4"}
							]
						}
						{
							type: "input"
							format: [
								{ text: "$\\overrightarrow{AC} =$", cols:3, class:"text-right" }
								{ text:"(", cols:1, class:"text-right h4"}
								{ name:"ACx", cols:3, latex:true }
								{ text:";", cols:1, class:"text-center h4"}
								{ name:"ACy", cols:3, latex:true }
								{ text:")", cols:1, class:"h4"}
							]
						}
						{
							type: "validation"

						}
					]
					validations:{
						"ABx": "number"
						"ABy": "number"
						"ACx": "number"
						"ACy": "number"
					}
					verifications:[
						{
							name: "ABx"
							tag:"$x_{\\overrightarrow{AB}}$"
							good: vAB.x
						}
						{
							name: "ABy"
							tag:"$y_{\\overrightarrow{AB}}$"
							good: vAB.y
						}
						{
							name: "ACx"
							tag:"$x_{\\overrightarrow{AC}}$"
							good: vAC.x
						}
						{
							name: "ACy"
							tag:"$y_{\\overrightarrow{AC}}$"
							good: vAC.y
						}
					]
				}
				{
					bareme:50
					title: "Produit scalaire"
					items:[
						{
							type:"text"
							ps:[
								"Calculez le produit scalaire $#{vAB.texLine()}\\cdot #{vAC.texLine()}$."
							]
						}
						{
							type:"input"
							format:[
								{ text:"$\\overrightarrow{AB}\\cdot\\overrightarrow{AC} =$", cols:4, class:"text-right" }
								{ name:"s", cols:4, latex:true }
							]
						}
						{
							type: "validation"
						}
					]
					validations: {
						s:"number"
					}
					verifications:[
						{
							name:"s"
							good:scal
							tag:"$\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$"
						}
					]
				}
			]

			if CAparams isnt false
				out.push {
					bareme: 50
					title: "Angle $\\hat{A}$"
					items: [
						{
							type:"text"
							ps:[
								"Calculez les valeurs exactes de $AB$ et $AC$,"
								"déduisez-en une approximation de l'angle $\\hat{A}$ au degré près."
								"On se contentera d'une mesure géométrique : pas besoin de préciser le signe de cet angle."
							]
						}
						{
							type:"input"
							format:[
								{ text:"$AB =$", cols:4, class:"text-right" }
								{ name:"AB", cols:4, latex:true }
							]
						}
						{
							type:"input"
							format:[
								{ text:"$AC =$", cols:4, class:"text-right" }
								{ name:"AC", cols:4, latex:true }
							]
						}
						{
							type:"input"
							format:[
								{ text:"$\\hat{A} =$", cols:4, class:"text-right" }
								{ name:"a", cols:4, latex:true }
							]
						}
						{
							type:"validation"
							clavier:["sqrt", "pow"]
						}
					]
					validations:{
						a:"number"
						AB:"number"
						AC:"number"
					}
					verifications:[
						{
							name:"AB"
							good:CAparams[0]
							tag:"AB"
						}
						{
							name:"AC"
							good:CAparams[1]
							tag:"AC"
						}
						{
							name:"a"
							good:CAparams[2]
							tag:"$\\hat{A}$"
							parameters:{
								arrondi:0
							}
						}
					]

				}
			out


		getExamBriques: (inputs_list,options, fixedSettings) ->
			that = @

			fct_item = (inputs, index) ->
				[ coords, scal, CAparams ] = that.init(inputs,options)
				[A, B, C, vAB, vAC] = coords
				return "$#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$"
			calcul_angle = Number(options.a?.value) is 1
			return {
				children: [
					{
						type: "text",
						children: [
							"Dans les différents cas, on donne :"
							if calcul_angle is false then "Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$."
							else "Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$, les distances $AB$ et $AC$ et en déduire l'angle $\\hat{A}$."

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

		getTex: (inputs_list, options, fixedSettings) ->
			that = @
			fct_item = (inputs, index) ->
				[ coords, scal, CAparams] = that.init(inputs,options)
				[A, B, C, u, v] = coords
				return "$#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$"
			calcul_angle = Number(options.a?.value) is 1
			return {
				children: [
					"Dans les différents cas, on donne :"
					if calcul_angle is false then "Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$."
					else "Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$, les distances $AB$ et $AC$ et en déduire l'angle $\\hat{A}$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
