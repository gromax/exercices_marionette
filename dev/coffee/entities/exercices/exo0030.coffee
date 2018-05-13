define ["utils/math", "utils/help", "utils/colors"], (mM, help, colors) ->

	# id:30
	# title: "Suites et termes général et récurrence"
	# description: "On donne l'expression de suites et il faut l'associer à la forme donnée par récurence."
	# keyWords:["Analyse", "Suite", "Première"]

	return {
		init: (inputs) ->
			items=[]

			if (inputs.ranks?)
				ranks =(Number it for it in inputs.ranks.split(";"))
			else
				ranks = _.shuffle([0..3])
				inputs.ranks = ranks.join(";")

			if inputs.q1? then q1 = Number inputs.q1
			else q1 = inputs.q1 = mM.alea.real( { min:1, max:10, sign:true } )
			if inputs.q2? then q2 = Number inputs.q2
			else q2 = inputs.q2 = mM.alea.real( { min:1, max:10, sign:true } )
			if inputs.u1? then u1 = Number inputs.u1
			else u1 = inputs.u1 = mM.alea.real( { min:1, max:10, sign:true } )
			if inputs.u2? then u2 = Number inputs.u2
			else u2 = inputs.u2 = mM.alea.real( { min:1, max:10, sign:true } )
			# u1 et q1 sont le premier terme et la raison pour une paire de suites arithmétique - géométrique. u2 et q2 pour une deuxième paire
			# La première suite est arithmétique
			u=mM.suite.arithmetique { premierTerme:{ valeur:u1, rang:0 }, raison:q1 }
			items.push { a:"u_n=#{u.explicite().tex()}", b:"u_{n+1}=#{u.recurence().tex()}", c:u.calc(0).tex()}
			# Le seconde est une suite géométrique
			u=mM.suite.geometrique { premierTerme:{ valeur:u1, rang:0}, raison:q1}
			items.push { a:"u_n=#{u.explicite().tex()}", b:"u_{n+1}=#{u.recurence().tex()}", c:u.calc(0).tex()}
			# La troisième est arithmétique
			u=mM.suite.arithmetique { premierTerme:{ valeur:u2, rang:0 }, raison:q2 }
			items.push { a:"u_n=#{u.explicite().tex()}", b:"u_{n+1}=#{u.recurence().tex()}", c:u.calc(0).tex()}
			# La quatrième est géométrique
			u=mM.suite.geometrique { premierTerme:{ valeur:u2, rang:0 }, raison:q2 }
			items.push { a:"u_n=#{u.explicite().tex()}", b:"u_{n+1}=#{u.recurence().tex()}", c:u.calc(0).tex()}

			[
				_.shuffle ({ type: "normal", text:"$#{item.a}$", color:colors.html(ranks[i]) } for item, i in items)
				("$#{item.b}$ &nbsp; et &nbsp; $u_0=#{item.c}$" for item in items)
				ranks
			]

		getBriques: (inputs, options) ->
			[ liste_fixe, liste_choix, ranks ] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							ps: [
								"On vous donee d'abord des suites données explicitement."
								"Ensuite on vous donne des suites données par récurence."
								"Associez-les en utilisant les boutons de la deuxième liste"
							]
						}
						{
							type: "color-list"
							list: liste_fixe
						}
						{
							type: "color-choice"
							name: "it"
							list: liste_choix
						}
						{
							type: "validation"
						}
					]
					validations:{
						it:"color:4"
					}
					verifications:[
						{
							name: "it"
							items: liste_choix
							colors: ranks
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[ liste_fixe, liste_choix, ranks ] = that.init(inputs,options)
				return {
					children: [
						{
							type: "text"
							children: [
								"Associez les formes explicites et les formes récurrentes deux à deux."
							]
						}
						{
							type: "2cols"
							col1:{
								type: "enumerate"
								enumi: "a"
								children: _.pluck(liste_fixe,"text")
							}
							col2:{
								type: "enumerate"
								enumi: "1"
								children: liste_choix
							}
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
				[ liste_fixe, liste_choix, ranks ] = that.init(inputs,options)
				return [
					"Associez les formes explicites et les formes récurrentes deux à deux."
					{
						type: "multicols"
						cols: 2
						children: [
							{
								type: "enumerate"
								enumi: "a"
								children: _.pluck(liste_fixe,"text")
							}
							{
								type: "enumerate"
								enumi: "1"
								children: liste_choix
							}
						]
					}
				]

			if inputs_list.length>1
				return {
					children: [
						{
							type: "enumerate"
							enumi: "A"
							children: _.map(inputs_list, fct_item)
						}
					]
				}
			else
				return {
					children: fct_item(inputs_list[0])
				}

	}
