define ["utils/math"], (mM) ->

	return {
		init: (inputs, options) ->
			if inputs.forme?
				forme = inputs.forme
			else
				forme = inputs.forme = mM.alea.in ["R", "TR", "TE"]
			switch forme
				when "R"
					if inputs.dims then dims = ( Number x for x in inputs.dims.split(";") )
					else
						dims= [
							mM.alea.real {min:80, max:120}
							mM.alea.real {min:20, max:70}
						]
						inputs.dims = dims.join(";")
						# ABCD, AB dans la longueur, IJKL les milieux respectifs
					[L,h] = dims
					sommets = [
						["A", 0, 0]
						["B", L, 0]
						["C", L, h]
						["D", 0, h]
						["I", [L,2,"/"], 0]
						["J", L, [h, 2, "/"]]
						["K", [L,2,"/"], h]
						["L", 0, [h, 2, "/"]]
					]

					svg = (view)->
						draw = view.draw
						containerWidth = view.$el.width()
						m = 50
						r = 10
						w = Math.min(containerWidth*.9-2*m, 400)
						lS = 20 # letterSize
						hh = Math.round(h/L*w)
						draw.size(w+2*m,hh+2*m)
						group = draw.group()
						group.polygon("0,0 #{w},0 #{w},#{hh} 0,#{hh}").fill('lime').stroke({ width: 3 })
						for pt in [[0,0], [w/2,0], [w,0], [w,hh/2], [w,hh], [w/2,hh], [0,hh], [0,hh/2]]
							group.circle(r).center(pt[0],pt[1]).fill("black")
						group.text("A").cx(0).y(hh+r+2)
						group.text("B").cx(w).y(hh+r+2)
						group.text("C").cx(w).y(0-r-2-lS)
						group.text("D").cx(0).y(0-r-2-lS)
						group.text("I").cx(w/2).y(hh+r+2)
						group.text("J").x(w+2+r).cy(hh/2)
						group.text("K").cx(w/2).y(0-r-2-lS)
						group.text("L").x(0-r-lS).cy(hh/2)
						group.translate(m, m)

				when "TR"
					if inputs.dims then dims = ( Number x for x in inputs.dims.split(";") )
					else
						dims= [
							mM.alea.real {min:80, max:120}
							mM.alea.real {min:20, max:70}
						]
						inputs.dims = dims.join(";")
						# ABCD, AB dans la longueur, IJKL les milieux respectifs
					[L,h] = dims
					sommets = [
						["A", 0, 0]
						["B", L, 0]
						["C", 0, h]
						["I", [L, 2, "/"], 0]
						["J", [L, 2, "/"], [h, 2, "/"]]
						["K", 0, [h, 2, "/"]]
					]
					svg = (view)->
						draw = view.draw
						containerWidth = view.$el.width()
						m = 50
						r = 10
						w = Math.min(containerWidth*.9-2*m, 400)
						lS = 20 # letterSize
						hh = Math.round(h/L*w)
						draw.size(w+2*m,hh+2*m)
						group = draw.group()
						group.polygon("0,0 #{w},#{hh} 0,#{hh}").fill('lime').stroke({ width: 3 })
						for pt in [[0,hh], [w/2,hh], [w,hh], [w/2,hh/2], [0,0], [0,hh/2]]
							group.circle(r).center(pt[0],pt[1]).fill("black")
						group.text("A").cx(0).y(hh+r+2)
						group.text("B").cx(w).y(hh+r+2)
						group.text("C").cx(0).y(0-r-2-lS)
						group.text("I").cx(w/2).y(hh+r+2)
						group.text("J").cx(w/2).y(hh/2-lS-r-2)
						group.text("K").x(0-r-lS).cy(hh/2)
						group.translate(m, m)
				when "TE"
					if inputs.dims then L = dims = Number input.dims
					else
						L = dims = inputs.dims = mM.alea.real {min:80, max:120}
					sommets = [
						["A", 0, 0]
						["B", L, 0]
						["C", [L, 2, "/"], [L, 3, "sqrt", 2, "/", "*"]]
						["I", [L, 2, "/"], 0]
						["J", [L, 3, "*", 4, "/"], [L, 3, "sqrt", 4, "/", "*"]]
						["K", [L, 4, "/"], [L, 3, "sqrt", 4, "/", "*"]]
					]
					t = 20

					svg = (view)->
						r = 10
						lS = 20 # letterSize
						draw = view.draw
						size = Math.min(view.$el.width(),500)
						draw.size(size,size)
						group = draw.viewbox(-50,-50,300,300)
						group.polygon("0,0 200,0 100,173").fill('lime').stroke({ width: 3 })
						for pt in [[0,0], [100,0], [200,0], [150,87], [100,173], [50,87]]
							group.circle(r).center(pt[0],pt[1]).fill("black")
						m = 50
						group.text("A").cx(0).y(0-r-2-lS)
						group.text("I").cx(100).y(0-r-2-lS)
						group.text("B").cx(200).y(0-r-2-lS)
						group.text("C").cx(100).y(173+r+2)
						group.text("J").cx(150).y(87+r+2)
						group.text("K").cx(50).y(87+r+2)

			if inputs.choix?
				choix = (sommets[Number it] for it in inputs.choix.split(";"))
			else
				nq = options.a.options[Number options.a.value]
				n = sommets.length
				indexChoix = _.flatten (_.shuffle([0..n-1])[0..1] for i in [1..nq*2])
				inputs.choix = indexChoix.join(";")
				choix = (sommets[it] for it in indexChoix)
			n = (choix.length - choix.length %4)/4
			quests = ( [ "\\overrightarrow{#{choix[0+4*i][0]+choix[1+4*i][0]}} \\cdot \\overrightarrow{#{choix[2+4*i][0]+choix[3+4*i][0]}}", mM.exec( _.flatten([choix[1+4*i][1], choix[0+4*i][1], "-", choix[3+4*i][1], choix[2+4*i][1], "-", "*", choix[1+4*i][2], choix[0+4*i][2], "-", choix[3+4*i][2], choix[2+4*i][2], "-", "*", "+"]), {simplify:true}) ] for i in [0..n-1])
			[ forme, dims, sommets, quests, svg ]

		getBriques: (inputs,options) ->
			[ forme, dims, sommets, quests, svg ] = @init(inputs, options)

			#initSVG = (view)->
			#	$container = view.$el
			#	$container.append(svg)

			[
				{
					bareme:100
					items:[
						{
							type: "text"
							ps: switch forme
								when "R" then [
									"On donne le rectangle ABCD ci-dessous."
									"AB = #{dims[0]} et AD=#{dims[1]}"
									"I, J, K et L sont les milieux des côtés."
									if quests.length>1 then "Calculez les produits scalaires."
									else "Calculez le produit scalaire."
								]
								when "TR" then [
									"On donne le triangle ABC ci-dessous, rectangle en A."
									"AB = #{dims[0]} et AC=#{dims[1]}"
									"I, J et K sont les milieux des côtés."
									if quests.length>1 then "Calculez les produits scalaires."
									else "Calculez le produit scalaire."
								]
								else [
									"On donne le triangle équilatéral ABC ci-dessous."
									"AB = #{dims}"
									"I, J et K sont les milieux des côtés."
									if quests.length>1 then "Calculez les produits scalaires."
									else "Calculez le produit scalaire."
								]
						}
						{
							type: "svg"
							renderingFunctions:[
								svg
							]

						}
					].concat(
						( { type:"input", format:[{ cols:4, text:"$#{q[0]} =$", class:"text-right" }, { cols:8, name:"s#{i}", latex:true } ]} for q, i in quests),
						[{ type: "validation"}]
					)
					validations: _.object( ("s#{i}" for q,i in quests ), ("number" for q,i in quests) )
					verifications: ( { name:"s#{i}", tag:"$#{q[0]}$", good:q[1]} for q,i in quests)
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ forme, dims, sommets, quests, svg ] = that.init(inputs,options)
				return {
					children: [
						switch forme
							when "R"
								"ABCD est un rectangle, AB=#{dims[0]} et AD=#{dims[1]}. I, J, K et L sont les milieux sont les milieux de [AB], [BC], [CD] et [DA]. Calculez :"
							when "TR"
								"ABC est un triangle rectangle en A, AB=#{dims[0]} et AD=#{dims[1]}. I, J, K sont les milieux sont les milieux de [AB], [BC], [CA]. Calculez :"
							else
								"ABC est un triangle équilatéral, AB=#{dims}. I, J, K sont les milieux sont les milieux de [AB], [BC], [CA]. Calculez :"
						{
							type: "enumerate"
							enumi: "a"
							children: ["$#{q[0]}$" for q in quests]
						}
					]
				}

			return {
				children: [
					{
						type: "subtitles"
						enumi: "A"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		getTex: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ forme, dims, sommets, quests, svg ] = that.init(inputs,options)
				return {
					children: [
						switch forme
							when "R"
								"$ABCD$ est un rectangle, $AB=#{dims[0]}$ et $AD=#{dims[1]}$. $I$, $J$, $K$ et $L$ sont les milieux sont les milieux de $[AB]$, $[BC]$, $[CD]$ et $[DA]$. Calculez :"
							when "TR"
								"$ABC$ est un triangle rectangle en $A$, $AB=#{dims[0]}$ et $AD=#{dims[1]}$. $I$, $J$, $K$ sont les milieux sont les milieux de $[AB]$, $[BC]$, $[CA]$. Calculez :"
							else
								"$ABC$ est un triangle équilatéral, $AB=#{dims}$. $I$, $J$, $K$ sont les milieux sont les milieux de $[AB]$, $[BC]$, $[CA]$. Calculez :"
						{
							type: "enumerate"
							enumi: "a"
							children: ["$#{q[0]}$" for q in quests]
						}
					]
				}

			if inputs_list.length is 1
				return fct_item(inputs_list[0],0)
			else
				return {
					children: [
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
