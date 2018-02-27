define ["utils/math", "utils/help", "utils/colors"], (mM, help, colors) ->

	# id:30
	# title: "Suites et termes général et récurrence"
	# description: "On donne l'expression de suites et il faut l'associer à la forme donnée par récurence."
	# keyWords:["Analyse", "Suite", "Première"]

	return {
		init: (inputs) ->
			items=[]
			if inputs.q1? then q1 = Number inputs.q1
			else q1 = inputs.q1 = mM.alea.real( { values:{min:1, max:10}, sign:true } )
			if inputs.q2? then q2 = Number inputs.q2
			else q2 = inputs.q2 = mM.alea.real( { values:{min:1, max:10}, sign:true } )
			if inputs.u1? then u1 = Number inputs.u1
			else u1 = inputs.u1 = mM.alea.real( { values:{min:1, max:10}, sign:true } )
			if inputs.u2? then u2 = Number inputs.u2
			else u2 = inputs.u2 = mM.alea.real( { values:{min:1, max:10}, sign:true } )
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

			if inputs.o? then o = ( Number c for c in inputs.o )
			else
				o = _.shuffle([0,1,2,3])
				inputs.o = o.join("")
			# On affecte le rang, ce qui revient à affecter les couleurs
			item.rank = o[i] for item,i in items

			[
				_.shuffle ({ type: "normal", text:"$#{item.a}$", color:colors.html(item.rank)} for item in items)
				_.shuffle ({ text:"$#{item.b}$ &nbsp; et &nbsp; $u_0=#{item.c}$", rank:item.rank } for item in items)
			]

		getBriques: (inputs, options) ->
			[ liste_fixe, liste_choix ] = @init(inputs)

			[
				{
					bareme: 100
					items: [
						{
							type: "text"
							rank: 1
							ps: [
								"On vous donee d'abord des suites données explicitement."
								"Ensuite on vous donne des suites données par récurence."
								"Associez-les en utilisant les boutons de la deuxième liste"
							]
						}
						{
							type: "color-list"
							rank: 2
							list: liste_fixe
						}
						{
							type: "color-choice"
							rank: 3
							name: "it"
							list: liste_choix
						}
						{
							type: "validation"
							rank: 4
							clavier: []
						}
					]
				}
			]

		tex:(data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			out = []
			for itData in data
				col1 = Handlebars.templates["tex_enumerate"] {
					numero:"a)"
					items:itData.tex.gauche
				}
				col2 = Handlebars.templates["tex_enumerate"] {
					numero:"\\hspace{-7mm}1)"
					items:itData.tex.droite
				}
				content = Handlebars.templates["tex_plain"] {
					multicols:2
					center:true
					contents:[col1, "\\columnbreak", col2]
				}
				out.push {
					title:@title
					content: Handlebars.templates["tex_plain"] {
						contents:["Associez les formes explicites et les formes récurrentes deux à deux.", content]
						large:false
					}
				}
			out

	}
