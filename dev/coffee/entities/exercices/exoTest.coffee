define ["app", "utils/math","utils/help", "utils/colors", "utils/tab", "mathjax"], (app, mM, help, colors, TabSignApi, MathJax) ->

	return {
		init: (inputs) ->
			tabX = ["$-\\infty$", "$x_1$", "$x_2$", "$+\\infty$"]
			tabS = ",-,z,+,z,-,"
			tab = (TabSignApi.make(tabX, {hauteur_ligne:25, color:colors.html(0), texColor:colors.tex(0)})).addSignLine(tabS)
			["test", tab]

		getBriques: (inputs, options) ->
			[message, tab] = @init(inputs)

			initTab = (view)->
				$container = view.$el
				$el = $("<div></div>")
				$container.append($el)
				svg = tab.render $el[0]
				view.listenTo app, "zoom", (r)->
					tab.render $el[0]
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,$el[0]]);

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							ps:[
								"Mon text de test."
							]
						}
						{
							type: "add-input"
							text: "Ensemble solution."
							name: "pwet"
						}
						{
							type: "def"
							rank: 2
							renderingFunctions:[
								initTab
							]

						}
						{
							type: "validation"
						}
					]
					validations:{
					}
					verifications:[
					]
				}
			]


	}
