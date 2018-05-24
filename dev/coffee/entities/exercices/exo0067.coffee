define ["utils/math"], (mM, help) ->
	return {
		init: (inputs) ->
			if inputs.vals?
				vals = ( Number it for it in inputs.vals.split(";"))
			else
				if mM.alea.dice(1,2)
					vals= ( mM.alea.real {min:-15, max:15} for i in [1..4])
				else
					vals= ( mM.alea.real {min:-15, max:15} for i in [1..6])
				inputs.vals = vals.join(";")
			if vals.length is 4
				is2Vec = true
				u = mM.vector("\\vec{u}", {x: vals[0], y:vals[1]})
				v = mM.vector("\\vec{v}", {x: vals[2], y:vals[3]})
				good = vals[0]*vals[2] + vals[1]*vals[3]
				[ [u, v], good ]
			else
				is2Vec = false
				A = mM.vector("A", {x: vals[0], y:vals[1]})
				B = mM.vector("B", {x: vals[2], y:vals[3]})
				C = mM.vector("C", {x: vals[4], y:vals[5]})
				ABx = vals[2] - vals[0]
				ABy = vals[3] - vals[1]
				ACx = vals[4] - vals[0]
				ACy = vals[5] - vals[1]
				u = mM.vector("\\overrightarrow{AB}", {x: ABx, y:ABy})
				v = mM.vector("\\overrightarrow{AC}", {x: ACx, y:ACy})
				good = ABx*ACx + ABy*ACy
				[ [A, B, C, u, v], [ABx, ABy, ACx, ACy, good]]

		getBriques: (inputs,options, fixedSettings) ->
			[ coords, goods] = @init(inputs, options)
			if coords.length>2
				# On a 3 points
				[A,B,C, u, v] = coords
				[
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
								good: goods[0]
							}
							{
								name: "ABy"
								tag:"$y_{\\overrightarrow{AB}}$"
								good: goods[1]
							}
							{
								name: "ACx"
								tag:"$x_{\\overrightarrow{AC}}$"
								good: goods[2]
							}
							{
								name: "ACy"
								tag:"$y_{\\overrightarrow{AC}}$"
								good: goods[3]
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
									"Calculez le produit scalaire $#{u.texLine()}\\cdot #{v.texLine()}$."
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
								good:goods[4]
								tag:"$\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$"
							}
						]
					}
				]
			else
				# On a deux vecteurs
				[u,v] = coords
				[
					{
						bareme:100
						items:[
							{
								type:"text"
								ps:[
									"On se place dans un repère orthonormé $(O;I,J)$"
									"On donne deux vecteurs $#{u.texLine()}$ et $#{v.texLine()}$."
									"Calculez le produit scalaire $\\vec{u}\\cdot\\vec{v}$."
								]
							}
							{
								type:"input"
								format:[
									{ text:"$\\vec{u}\\cdot\\vec{v} =$", cols:4, class:"text-right" }
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
								good:goods
								tag:"$\\vec{u}\\cdot\\vec{v}$"
							}
						]
					}
				]

		getExamBriques: (inputs_list,options, fixedSettings) ->
			that = @

			fct_item = (inputs, index) ->
				[ coords, goods] = that.init(inputs,options)
				if coords.length>2
					[A, B, C, u, v] = coords
					return "$#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$"
				else
					[u,v] = coords
					return "$#{u.texLine()}$ et $#{v.texLine()}$"
			return {
				children: [
					{
						type: "text",
						children: [
							"Dans les différents cas, on donne :"
							"Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$",
							"ou les coordonnées de deux vecteurs $\\vec{u}$ et $\\vec{v}$. Il faut alors calculer $\\vec{u}\\cdot\\vec{v}$."
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
				[ coords, goods] = that.init(inputs,options)
				if coords.length>2
					[A, B, C, u, v] = coords
					return "$#{A.texLine()}$ ; $#{B.texLine()}$ et $#{C.texLine()}$"
				else
					[u,v] = coords
					return "$#{u.texLine()}$ et $#{v.texLine()}$"
			return {
				children: [
					"Dans les différents cas, on donne :"
					"Les coordonnées de trois points A, B et C. Il faut alors calculer $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}$",
					"ou les coordonnées de deux vecteurs $\\vec{u}$ et $\\vec{v}$. Il faut alors calculer $\\vec{u}\\cdot\\vec{v}$."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

	}
