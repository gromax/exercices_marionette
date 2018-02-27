define ["utils/math","utils/help"], (mM, help) ->
	# id:53
	# title:"Équations avec logarithme et exponentielle"
	# description:"Résoudre des équations contenant des logarithmes et des exponentielles."
	# keyWords:["logarithme","exponentielle","équation","TSTL"]
	# options: {
	#	a:{ tag:"ln ou exp" , options:["ln()", "exp()", "e^()"] }
	#	b:{ tag:"équation", options:["f(ax+b)=f(cx+d)","a.f(x)+b = c.f(x)+d","a.f²(x)+...=0,","c.f(ax+b)+d=...","a.f²(ax+b)+...=0"] }
	#}

	return {
		init: (inputs, options) ->
			a = Number(options.a.value ? 0)
			b = Number(options.b.value ? 0)
			# a = 0 pour une équation en ln ; 1 et 2 pour exp (changement de notation)
			# b = 0 pour ln(expr 1) = ln(expr 2) (ou exp)
			# b = 1 pour 3 ln(x) +2 = 2 ln(x) -1 (ou exp)
			# b = 2 pour ln(x)^2 - 5 ln(x) + 2 =0
			# b = 3 pour 3 ln(expr) +2 = 2 ln(expr) -1 (ou exp)
			# b = 4 pour ln(expr)^2 - 5 ln(expr) + 2 =0
			info_notation = false
			domaine = false
			# Dans le cas b = 1 à 4 on stocke dans inputs.b l'expression dans ln/exp et dans c l'expression du premier membre et éventuellement d au second membre
			# dans le cas b=0, on se contente de c et d qui sont les expressions dans ln/exp au premier et second membre
			switch
				when typeof inputs.b isnt "undefined"
					expr = mM.toNumber(inputs.b)
					expr1 = mM.toNumber(inputs.c ? "x")
					expr2 = mM.toNumber(inputs.d ? "0")
					a = Number(inputs.a ? a)
					if a is 0
						p = mM.polynome.make { number:expr, variable:"x" }
						r = mM.polynome.solve.exact p, {y:0}
						if r.length>0 then domaine = "L'équation est définie pour $x>#{r.pop().tex()}$"
					{ goods, eqTex } = @cas_b12(expr,expr1,expr2,a)
				when (typeof inputs.c isnt "undefined") and (typeof inputs.d isnt "undefined")
					expr1 = mM.toNumber(inputs.c)
					expr2 = mM.toNumber(inputs.d, "x")
					a = Number(inputs.a ? a)
					if a is 0
						p1 = mM.polynome.make { number:expr1, variable:"x" }
						p2 = mM.polynome.make { number:expr2, variable:"x" }
						r1 = (mM.polynome.solve.exact p1, {y:0}).pop()
						r2 = (mM.polynome.solve.exact p2, {y:0}).pop()
						if r1.float() > r2.float() then domaine = "L'équation est définie pour &nbsp; $x>#{r1.tex()}$"
						else domaine = "L'équation est définie pour &nbsp; $x>#{r2.tex()}$"
					{ goods, eqTex } = @cas_b0(expr1,expr2,a)
				else
					# On commence par créer expr qui sera dans ln ou exp
					switch
						when (b is 2) or (b is 4)
							# Cas d'un polynome du second degré
							# On choisit l'expression qui ira dans le ln/exp : soit ax+b, soit x
							if b is 4
								expr = mM.alea.poly { degre:1, coeffDom:{ min:1, max:5, sign:true }, values:{min:-10, max:10} }
								if a is 0
									p = mM.polynome.make { number:expr, variable:"x" }
									r = mM.polynome.solve.exact p, {y:0}
									if r.length>0 then domaine = "L'équation est définie pour &nbsp; $x>#{r.pop().tex()}$"
							else
								expr = mM.exec ["x"]
								if a is 0
									domaine = "L'équation est définie pour &nbsp; $x>0$"
							# Il faut d'abord résoudre une équation du second degré, puis prendre le ln (si a=1) ou le exp (si a=0) Donc on prend une parabole. Pour le cas a=1, on place un sommet xS>0 pour garantir l'existence d'une racine positive, s'il y a des racines
							if a is 0 then xS = mM.alea.real { values:{min:-10, max:10} }
							else xS = mM.alea.real { values:{min:0, max:10} }
							# Une fois sur 8 on prend le cas d'une fonction du second degré sans racine
							# Je ne prend que des parabole convexe
							if mM.alea.dice(1,8)
								yS = mM.alea.real { values:{min:1, max:20} }
								expr1 = mM.exec [ "x", xS, "-", 2, "^", yS, "+"], { simplify:true, developp:true }
							else
								sqrtYS = mM.alea.real { min:1, max:10 }
								expr1 = mM.exec [ "x", xS, "-", 2, "^", sqrtYS, 2, "^", "-"], { simplify:true, developp:true }
							expr2 = mM.toNumber 0
							inputs.a = String a
							inputs.b = String expr
							inputs.c = String expr1
							{ goods, eqTex } = @cas_b12(expr,expr1,expr2,a)
							if a is 0 then info_notation = "La notation &nbsp; $\\ln^2(#{expr.tex()})$ &nbsp; est un racourci pour &nbsp; $\\left(\\ln(#{expr.tex()})\\right)^2$"
							if a is 1 then info_notation = "La notation &nbsp; $\\exp^2(#{expr.tex()})$ est un racourci pour &nbsp; $\\left(\\exp(#{expr.tex()})\\right)^2$"
						when (b is 1) or (b is 3)
							# 3 ln(x) +2 = 2 ln(x) -1 (ou exp)
							if b is 3
								expr = mM.alea.poly { degre:1, coeffDom:{ min:1, max:5, sign:true }, values:{min:-10, max:10} }
								if a is 0
									p = mM.polynome.make { number:expr, variable:"x" }
									r = mM.polynome.solve.exact p, {y:0}
									if r.length>0 then domaine = "L'équation est définie pour &nbsp; $x>#{r.pop().tex()}$"
							else
								expr = mM.exec ["x"]
								if a is 0
									domaine = "L'équation est définie pour &nbsp; $x>0$"
							# On aura u.ln(ax+b)+v = w.ln(ax+b)+t
							# Dans le cas d'une exponentielle, il faut être sûr que la solution (t-v)/(u-w)>0
							u = mM.alea.real { min:-10, max:10 }
							v = mM.alea.real { min:-10, max:10 }
							w = mM.alea.real { min:-10, max:10, no:[u] }
							if a is 0 then t = mM.alea.real { min:-10, max:10 }
							else
								tm = Math.floor(-v/(u-w)+1)
								t = mM.alea.real { min:tm, max:tm+15 }
							aff1 = mM.exec [u, "x", "*", v, "+"], { simplify:true}
							aff2 = mM.exec [w, "x", "*", t, "+"], { simplify:true}
							inputs.a = String a
							inputs.b = String expr
							inputs.c = String aff1
							inputs.d = String aff2
							{ goods, eqTex } = @cas_b12(expr,aff1,aff2,a)
						else
							# on résout ln(u x+v) = ln(w x +t) cas a=0
							# ou exp(ux+v) = exp(wx+t)
							u = mM.alea.real { min:1, max:20 }
							w = mM.alea.real { min:1, max:20, no:[u] }
							if a is 0
								# C'est un ln, dans un cas sur 8 on veut qu'il n'y ait pas de solution
								if mM.alea.dice(1,8)
									# C'est un cas sans solution
									if (u>w)
										# La racine de expr1 doit être inférieure pour que l'intersection soit sous y =0
										racine1 = mM.alea.real { min:-5, max:4, real:true }
										racine2 = mM.alea.real { min:racine1+1, max:5, real:true }
										v = Math.ceil -racine1*u # Le ceil décale racine expr1 à gauche
										t = Math.floor -racine2*w # Le floor décal racine expr2 à droite
										racine = mM.exec [-t, w, "/"], { simplify:true }
									else
										# La racine de expr1 doit être supérieure pour que l'intersection soit sous y =0
										racine1 = mM.alea.real { min:-4, max:5, real:true }
										racine2 = mM.alea.real { min:-5, max:racine1-1, real:true }
										v = Math.floor -racine1*u # Le ceil décale racine expr1 à droite
										t = Math.ceil -racine2*w # Le floor décal racine expr2 à gauche
										racine = mM.exec [-v, u, "/"], { simplify:true }
								else
									# C'est un cas avec solution
									if (u>w)
										# La racine de expr1 doit être supérieure pour que l'intersection soit au-dessus de y =0
										racine1 = mM.alea.real { min:-4, max:5, real:true }
										racine2 = mM.alea.real { min:-5, max:racine1-1, real:true }
										v = Math.floor -racine1*u # Le ceil décale racine expr1 à droite
										t = Math.ceil -racine2*w # Le floor décal racine expr2 à gauche
										racine = mM.exec [-v, u, "/"], { simplify:true }
									else
										# La racine de expr1 doit être inférieure pour que l'intersection soit au-dessus de y =0
										racine1 = mM.alea.real { min:-5, max:4, real:true }
										racine2 = mM.alea.real { min:racine1+1, max:5, real:true }
										v = Math.ceil -racine1*u # Le ceil décale racine expr1 à gauche
										t = Math.floor -racine2*w # Le floor décal racine expr2 à droite
										racine = mM.exec [-t, w, "/"], { simplify:true }
								domaine = "L'équation est définie pour $x>#{racine.tex()}$"

							else
								# Pas besoin de s'embêter, la solution existe toujours
								v = mM.alea.real { min:-5, max:5 }
								t = mM.alea.real { min:-5, max:5 }
							# Il faut contrôler l'absence ou la présence de solutions

							expr1 = mM.exec [u, "x", "*", v, "+"], { simplify:true }
							expr2 = mM.exec [w, "x", "*", t, "+"], { simplify:true }
							inputs.a = String a
							inputs.c = String expr1
							inputs.d = String expr2
							{ goods, eqTex } = @cas_b0(expr1,expr2,a)
			[eqTex, info_notation, goods, domaine]

		getBriques: (inputs, options) ->
			[eqTex, info_notation, goods, domaine] = @init(inputs,options)
			infos = []
			if domaine then infos.push(domaine)
			if info_notation then infos.push(info_notation)

			[
				{
					bareme: 100
					items:[
						{
							type: "text"
							rank: 1
							ps:[
								"On considère l'équation : $#{ eqTex }$."
								"Vous devez donner la ou les solutions de cette équations, si elles existent."
								"<i>S'il n'y a pas de solution, écrivez $\\varnothing$. s'il y a plusieurs solutions, séparez-les avec ;</i>"
							]
						}
						{
							type: "ul"
							rank: 2
							list: _.map(infos,(item)-> { type:"warning", text:item } )
						}
						{
							type: "input"
							rank: 3
							waited: "liste:number"
							name:"solutions"
							tag:"$\\mathcal{S}$"
							good: goods
						}
						{
							type: "validation"
							rank: 4
							clavier: ["empty"]
						}
					]
				}
			]

		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[eqTex, info_notation, goods, domaine] = that.init(inputs,options)
				if domaine then return "$#{ eqTex }$. "+domaine
				else return "$#{ eqTex }$"

			return {
				children: [
					{
						type: "text",
						children: [
							"On considère les équations suivantes."
							"Vous devez donner la ou les solutions de ces équations, si elles existent."
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
				[eqTex, info_notation, goods, domaine] = that.init(inputs,options)
				if domaine then return "$#{ eqTex }$. "+domaine
				else return "$#{ eqTex }$"

			return {
				children: [
					"On considère les équations suivantes."
					"Vous devez donner la ou les solutions de ces équations, si elles existent."
					{
						type: "enumerate",
						children: _.map(inputs_list, fct_item)
					}
				]
			}

		cas_b0: (expr1,expr2,a) ->
			diff = mM.exec [ expr1, expr2, "-"], {simplify:true}
			pol = mM.polynome.make diff
			goods_not_verified = mM.polynome.solve.exact pol
			goods = []
			for it in goods_not_verified
				if (a isnt 0) or expr1.floatify({x:it}).isPositive() then goods.push it
			if (a is 0) then fct = "ln" else fct = "exp"
			mg = mM.exec [expr1, fct]
			md = mM.exec [expr2, fct]
			if a is 1 then options = { altFunctionTex:["exp"] } else options = {}
			{ goods:goods, eqTex:mg.tex(options)+" = "+md.tex(options) }

		cas_b12: (expr,expr1,expr2,a) ->
			diff = mM.exec [ expr1, expr2, "-"], {simplify:true}
			pol = mM.polynome.make diff
			goods_not_verified = mM.polynome.solve.exact pol
			goods = []
			pol = mM.polynome.make expr
			for it in goods_not_verified
				xs = null
				if a is 0 then xs = mM.polynome.solve.exact(pol, { y:mM.exec([it, "exp"]) })
				else if it.isPositive() then xs = mM.polynome.solve.exact(pol, { y:mM.exec([it, "ln"]) })
				if xs isnt null
					goods.push(x) while (x=xs.pop()?.simplify(null,true))
			if a is 0 then X = mM.exec [expr, "ln"]
			else X = mM.exec [expr, "exp"]
			if a is 2
				mg = expr1.replace(X, "x").simplify().order() # afin d'intégrer la puissance 2 dans le e^
			else
				mg = expr1.replace(X, "x").order()
			md = expr2.replace(X,"x").order()
			if a is 1 then options = { altFunctionTex:["exp"] } else options = {}
			{ goods:goods, eqTex:mg.tex(options)+" = "+md.tex(options) }

		tex: (data) ->
			# en chantier
			if not isArray(data) then data = [ data ]
			{
				title:@title
				content:Handlebars.templates["tex_enumerate"] { items: ("$#{item.equation}$" for item in data), large:false }
			}

	}
