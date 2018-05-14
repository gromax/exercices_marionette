define ["utils/math", "utils/help", "utils/colors", "utils/svg"], (mM, help, colors, TabVarApi) ->

	return {
		init: (inputs) ->
			if inputs.forme?
				forme = inputs.forme
			else
				forme = inputs.forme = mM.alea.in ["R"] # ["R", "TR", "TE"]
			switch forme
				when "R"
					if inputs.dims then dims = inputs.dims.split(";")
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
							["I", L/2, 0]
							["J", L, h/2]
							["K", L/2, h]
							["L", 0, h/2]
						]
						if inputs.choix?
							choix = (sommets[Number it] for it in inputs.choix.split(";"))
						else
							indexChoix = ( mM.alea.in [0..7] for i in [1..4])
							inputs.choix = indexChoix.join(";")
							choix = (sommets[it] for it in indexChoix)
						tex = "\\overrightarrow{#{choix[0][0]+choix[1][0]}} \\cdot \\overrightarrow{#{choix[2][0]+choix[3][0]}}"
						good = (choix[1][1]-choix[0][1])*(choix[3][1]-choix[2][1]) + (choix[1][2]-choix[0][2])*(choix[3][2]-choix[2][2])
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
			[ forme, dims, sommets, tex, good, svg ]

		getBriques: (inputs,options) ->
			[ forme, dims, sommets, tex, good, svg ] = @init(inputs)

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
								"On donne la figure ci-dessous."
								"Donnez la valeur de &nbsp;$#{tex}$."
							]
						}
						{
							type: "def"
							renderingFunctions:[
								initSVG
							]

						}
						{
							type:"input"
							format: [
								{ cols:4, text:"$#{tex} =$", class:"text-right" }
								{ cols:8, name:"s", latex:true }
							]
						}
						{
							type: "validation"
						}
					]
					validations:{
						s:"number"
					}
					verifications:[
						{
							name:"s"
							tag:"$#{tex}$"
							good: good
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			renderingFunctions = []
			fct_item = (inputs, index) ->
				[items, tabs, ranks] = that.init(inputs,options)
				tabs = _.shuffle(tabs)
				divId = "tabs" + Math.round(Math.random()*10000)
				initTabs = (view)->
					$container = $("##{divId}", view.$el)
					initOneTab = (tab) ->
						$el = $("<div></div>")
						$container.append($el)
						tab.render $el[0]
					_.each(tabs, initOneTab)
				renderingFunctions.push initTabs
				return {
					children: [
						{
							divId: divId
						}
						{
							type: "enumerate"
							enumi: "a"
							children: items
						}
					]
				}

			return {
				children: [
					{
						type:"text"
						children:[
							"Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré."
							"À chaque fois, vous devez dire à quelle fonction correspond chaque tableau."
						]
					}
					{
						type: "subtitles"
						enumi: "A"
						refresh: true
						children: _.map(inputs_list, fct_item)
					}
				]
				renderingFunctions : renderingFunctions
			}

		getTex: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[items, tabs, ranks] = that.init(inputs,options)
				tabs = _.shuffle(tabs)

				return (tab.toTexTpl() for tab in tabs).concat [
					{
						type: "enumerate"
						enumi: "a)"
						children: items
					}
				]

			if inputs_list.length is 1
				return {
					children: [
						"On vous donne 4 tableaux de variations et 4 fonctions du second degré."
						"Vous devez dire à quelle fonction correspond chaque tableau."
					].concat fct_item(inputs_list[0],0)
				}
			else
				return {
					children: [
						"Dans chaque cas, on vous donne 4 tableaux de variations et 4 fonctions du second degré."
						"À chaque fois, vous devez dire à quelle fonction correspond chaque tableau."
						{
							type: "enumerate"
							enumi: "1"
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
