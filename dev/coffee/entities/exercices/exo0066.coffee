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

					LL=L*2
					hh=h*2
					m = 50
					t = 20
					svg = """<center><svg height="#{hh+m*2}" width="#{LL+m*2}">
					<polygon points="#{m},#{m} #{LL+m},#{m} #{LL+m},#{hh+m} #{m},#{hh+m}" style="fill:lime;stroke:black;stroke-width:3" />
					<circle cx="#{m}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+LL}" cy="#{m+hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m}" cy="#{m+hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+LL}" cy="#{m+.5*hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m+hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m}" cy="#{m+.5*hh}" r="2" stroke="black" stroke-width="3" />
					<text x="#{m-t}" y="#{m-t}" >A</text>
					<text x="#{m+t+LL}" y="#{m-t}" >B</text>
					<text x="#{LL+m+t}" y="#{hh+m+t}" >C</text>
					<text x="#{m-t}" y="#{hh+m+t}" >D</text>
					<text x="#{m+.5*LL}" y="#{m+t}" >I</text>
					<text x="#{m+LL-t}" y="#{m+.5*hh}" >J</text>
					<text x="#{m+.5*LL}" y="#{m+hh+t}" >K</text>
					<text x="#{m-t}" y="#{m+.5*hh}" >L</text>
					<line x1="#{m}" y1="#{m-.5*t}" x2="#{LL+m}" y2="#{m-.5*t}" stroke-width="2" stroke="black" />
					<text x="#{m+.5*LL}" y="#{m-t}" >#{L}</text>
					<line x1="#{m+LL+.5*t}" y1="#{m}" x2="#{m+LL+.5*t}" y2="#{m+hh}" stroke-width="2" stroke="black" />
					<text x="#{m+LL+t}" y="#{m+.5*hh}" >#{h}</text>
					</svg></center>"""
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
					LL=L*2
					hh=h*2
					m = 50
					t = 20
					r = 20
					svg = """<center><svg height="#{hh+m*2}" width="#{LL+m*2}">
					<polygon points="#{m},#{m} #{LL+m},#{m} #{m},#{hh+m}" style="fill:lime;stroke:black;stroke-width:3" />
					<polygon points="#{m},#{m} #{r+m},#{m} #{r+m},#{r+m} #{m},#{r+m}" style="fill:lime;stroke:black;stroke-width:3" />
					<circle cx="#{m}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m}" cy="#{m+hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m+.5*hh}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m}" cy="#{m+.5*hh}" r="2" stroke="black" stroke-width="3" />
					<text x="#{m-t}" y="#{m-t}" >A</text>
					<text x="#{m+t+LL}" y="#{m-t}" >B</text>
					<text x="#{m-t}" y="#{hh+m+t}" >C</text>
					<text x="#{m+.5*LL}" y="#{m+t}" >I</text>
					<text x="#{m+.5*LL+t}" y="#{m+.5*hh+t}" >J</text>
					<text x="#{m+.5*t}" y="#{m+.5*hh}" >K</text>
					<line x1="#{m}" y1="#{m-.5*t}" x2="#{LL+m}" y2="#{m-.5*t}" stroke-width="2" stroke="black" />
					<text x="#{m+.5*LL}" y="#{m-t}" >#{L}</text>
					<line x1="#{m-.5*t}" y1="#{m}" x2="#{m-.5*t}" y2="#{m+hh}" stroke-width="2" stroke="black" />
					<text x="#{m-1.5*t}" y="#{m+.5*hh}" >#{h}</text>
					</svg></center>"""
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
					LL=L*2
					m = 50
					t = 20
					svg = """<center><svg height="#{LL+m*2}" width="#{LL+m*2}">
					<polygon points="#{m},#{m} #{LL+m},#{m} #{LL*.5+m},#{LL*.866+m}" style="fill:lime;stroke:black;stroke-width:3" />
					<circle cx="#{m}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m+.866*LL}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.5*LL}" cy="#{m}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.75*LL}" cy="#{m+.433*LL}" r="2" stroke="black" stroke-width="3" />
					<circle cx="#{m+.25*LL}" cy="#{m+.433*LL}" r="2" stroke="black" stroke-width="3" />
					<text x="#{m-t}" y="#{m-t}" >A</text>
					<text x="#{m+t+LL}" y="#{m-t}" >B</text>
					<text x="#{m+.5*LL}" y="#{.866*LL+t+m}" >C</text>
					<text x="#{m+.5*LL}" y="#{m+t}" >I</text>
					<text x="#{m+.75*LL+t}" y="#{m+.433*LL+t}" >J</text>
					<text x="#{m+.25*LL+.5*t}" y="#{m+.433*LL}" >K</text>
					<line x1="#{m}" y1="#{m-.5*t}" x2="#{LL+m}" y2="#{m-.5*t}" stroke-width="2" stroke="black" />
					<text x="#{m+.5*LL}" y="#{m-t}" >#{L}</text>
					</svg></center>"""
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

			initSVG = (view)->
				$container = view.$el
				$container.append(svg)

			[
				{
					bareme:100
					items:[
						{
							type: "text"
							ps:[
								switch forme
									when "R" then "On donne le rectangle ABCD ci-dessous."
									when "TR" then "On donne le triangle rectangle ABC ci-dessous."
									else "On donne le triangle équilatéral ABC ci-dessous."
								if quests.length>1 then "Calculez les produits scalaires."
								else "Calculez le produit scalaire."
							]
						}
						{
							type: "def"
							renderingFunctions:[
								initSVG
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
