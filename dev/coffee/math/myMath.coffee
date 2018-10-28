	# Objet permettant de fabriquer les objets mathématiques depuis l'extérieur
	mM = {
		misc: {
			numToStr: (num,decimals) ->
				if decimals? then out = num.toFixed decimals
				else out = String num
				out.replace '.', ","
			toPrecision: (num, decimals) ->
				if decimals? then Number(num.toFixed decimals)
				else num
		}
		alea: {
			# Ensemble des objets produits aléatoirement
			poly : (params) ->
				config = _.extend {
					variable:"x" 	# variable du polynome
					degre:0 		# impose le degré ou sinon {min, max}
					monome:false 	# simple monome
					coeffDom: null	# Permet de fixer le numeréteur du degré dominant
					values:1		# numérateurs possibles
					denominators : null	# null-> entiers, nombre-> tous le même, tableau-> valeurs possibles, { min, max } -> intervalle de valeurs
				}, params

				degre = Proba.alea config.degre
				if degre<0 then degre =0
				if config.monome then degres = [degre] else degres = [0..degre]
				coeffs = []
				for i in degres
					coeff = if i is degre and (config.coeffDom isnt null) then @number config.coeffDom
					else
						if config.denominators  isnt null
							@number { numerator:config.values, denominator:config.denominators }
						else
							@number config.values
					if i is degre # Si c'est le degré dominant, il ne doit pas être nul
						coeff = @number({numerator:config.values, denominator:config.denominators}) while coeff.isNul()
					if not coeff.isNul()
						if i isnt 0 then coeff = new Monome( coeff, {name:config.variable, power:i})
						coeffs.push coeff
				if coeffs.length is 1 then coeffs.pop()
				else new PlusNumber(coeffs.reverse()...)
			number : (params) ->
				###
				Paramètres de proba.alea avec possibilité de séparer entre numerator et dénominatoravec des trucs en plus
				- un dénominateur
				###
				if (numParams = params.numerator)? and (denParams = params.denominator)?
					numerator = Proba.alea(numParams)
					denominator = Proba.alea(denParams)
					if denominator is 0 then denominator = 1
					(new RationalNumber numerator,denominator).simplify()
				else
					new RealNumber Proba.alea(params)
			real: (params) ->
				# Même principe que précédent mais avec simple retour d'un nombre
				if (numParams = params.numerator)? and (denParams = params.denominator)?
					numerator = Proba.alea(numParams)
					denominator = Proba.alea(denParams)
					if denominator is 0 then numerator
					else numerator/denominator
				else
					Proba.alea(params)
			dice: (up,down) ->
				# renvoie vrai ou faux pour un alea à la proba up/down
				Math.random()*down < up
			in: (arr) -> Proba.aleaIn arr
			shuffle:(source)->
				return source unless source.length >= 2
				for index in [source.length-1..1]
					# Choose random element `randomIndex` to the front of `index` to swap with.
					randomIndex = Math.floor Math.random() * (index + 1)
					# Swap `randomIndex` with `index`, using destructured assignment
					[source[index], source[randomIndex]] = [source[randomIndex], source[index]]
				source
			vector: (params) ->
				config = mergeObj { axes:["x", "y"], def:{}, name:"?", values:[{min:-10, max:10}] }, params
				coords = { x:null, y:null, z:null }
				# on crée le point avant de s'assurer qu'il vérifie bien les conditions
				# tryLeft limite le nombre de boucles pour éviter d'entrer dans une boucle infinie
				# ok permet d'arrêter quand les conditions sont obtenues
				# force permet d'essayer dans un premier temps les valeurs def
				tryLeft = 10
				ok = false
				force = false
				while (ok is false) and (tryLeft>0)
					tryLeft -= 1
					for axe,i in config.axes
						if i<config.values.length then values = config.values[i]
						else values = config.values[0]
						if (typeof config.def[axe+config.name] is "undefined") or force
							coords[axe] = mM.alea.number values
						else
							coords[axe] = mM.toNumber config.def[axe+config.name]
					# On va tester pour voir si les coordonnées obtenues répondent bien aux conditions
					ok = true
					if isArray(config.forbidden)
						for item in config.forbidden
							switch
								when item instanceof Vector then ok = ok and not(item.sameAs coords)
								when item?.axe? then ok = ok and not(item.coords.sameAs coords, item.axe)
								when isArray(item?.aligned) and (item.aligned.length is 2) then ok = ok and not(item.aligned[0].aligned?(item.aligned[1], coords))
					force = true
				return new Vector config.name, coords
		}
		distribution: {
			gaussian: (x,params) ->
				config = mergeObj { moy:0, std:1 }, params
				Proba.gaussianDistribution (x - config.moy)/config.std
			binomial: (n,p,k) -> Proba.binomial_density(n, p, k)
		}
		repartition: {
			gaussian: (x,params) ->
				config = mergeObj { moy:0, std:1 }, params
				if (typeof x is "object")
					if x.max? then out = Proba.gaussianRepartition (x.max - config.moy)/config.std else out = 1
					if x.min? then out = out - Proba.gaussianRepartition (x.min - config.moy)/config.std
					out
				else Proba.gaussianRepartition (x - config.moy)/config.std
			binomial: (n,p,k) ->
				if (typeof k is "object")
					if k.max? then out = Proba.binomial_rep(n, p, k.max) else out = 1
					if k.min? then out = out - Proba.binomial_rep(n, p, k.min)
					out
				else Proba.binomial_rep(n, p, k)
		}
		intervalle_fluctuation:{
			binomial:(n,p,seuil=.95)-> Proba.binomial_IF(n,p,seuil)
		}
		test: {
			isFloat: (number) ->
				nO = mM.toNumber(number)
				unless nO instanceof RealNumber then return false
				out = nO.float()
				if Number.isNaN(out) then return false
				out
		}
		trigo:{
			degToRad: (value) ->
				switch
					when isArray(value) then return @degToRad mM.exec value
					when value instanceof NumberObject then return value.toClone().md(new RealNumber(180),true).md(SymbolManager.makeSymbol("pi"),false).simplify()
					when typeof value is "number" then return value * Math.PI() / 180
					else return NaN
			radToDeg: (value) ->
				switch
					when isArray(value) then return @radToDeg mM.exec value
					when value instanceof NumberObject then return value.toClone().md(new RealNumber(180),false).md(SymbolManager.makeSymbol("pi"),true).simplify()
					when typeof value is "number" then return value / Math.PI() * 180
					else return NaN
			angles: -> Trigo.anglesConnus()
			principale: (value,symbols) ->
				value = mM.toNumber value
				nPi = value.floatify(symbols).float()/Math.PI
				tours = Math.round(nPi/2)*2
				output = value.toClone().am (new RealNumber tours).md(SymbolManager.pi(),false), true
				if nPi-tours is -1 then output.opposite()
				output.simplify()
			complexe: (module, argument) ->
				# l'argument est un angle en degrés donné comme un float
				module = mM.toNumber module
				Trigo.cos(argument).md(module,false).am(Trigo.sin(argument).md(module,false).md(new ComplexeNumber(0,1),false),false).simplify()
		}
		exec: (arr,params) ->
			# execute le tableau comme une pile inversée
			config = mergeObj {
				simplify: false
				developp: false
				clone:true
			}, params

			arr.reverse()
			pile=[]
			if not isArray(arr) then return new RealNumber()
			while arr.length>0
				arg = arr.pop()
				switch
					when arg instanceof NumberObject
						if config.clone then pile.push arg.toClone()
						else pile.push arg
					when arg is "+"
						op2 = pile.pop()
						pile.push(new PlusNumber(pile.pop(),op2))
					when arg is "-"
						op2 = pile.pop()?.opposite?()
						pile.push(new PlusNumber(pile.pop(),op2))
					when arg is "*"
						op2 = pile.pop()
						pile.push(new MultiplyNumber(pile.pop(),op2))
					when arg is "/"
						op2 = pile.pop()
						pile.push(MultiplyNumber.makeDiv(pile.pop(),op2))
					when arg is "^"
						op2 = pile.pop()
						pile.push(new PowerNumber(pile.pop(),op2))
					when arg is "*-" then pile.push(pile.pop()?.opposite?())
					when arg is "conjugue" then pile.push(pile.pop()?.conjugue?())
					when arg is "^-1" then pile.push(pile.pop()?.inverse?())
					when arg is "union"
						op2 = pile.pop()
						op1 = pile.pop()
						pile.push(new Union(op1,op2))
					when arg is "intersection"
						op2 = pile.pop()
						op1 = pile.pop()
						pile.push(new Intersection(op1,op2))
					when arg in ["x","y","t","i","pi","e","∞", "infini"] then pile.push SymbolManager.makeSymbol(arg)
					when (typeof arg is "string") and (FunctionNumber.functions[arg]?) then pile.push(new FunctionNumber(arg,pile.pop()))
					when typeof arg is "number" then pile.push(new RealNumber(arg))
					when (typeof arg is "string") and (m = arg.match /// ^symbol:([a-zA-Z_']+)$ ///i) then pile.push SymbolManager.makeSymbol(m[1])
					when (typeof arg is "string") and (m = arg.match /// ^ensemble:([\[\]]+)([\[\]]+)$ ///i)
						op2 = pile.pop()
						op1 = pile.pop()
						pile.push (new Ensemble()).init(m[1] is "[", op1, m[2] is "]", op2)
			if pile.length is 0 then return new RealNumber()
			out = pile.pop()
			if config.developp then out.developp()
			if config.simplify then out = out.simplify(null,config.developp)
			out
		parse: (expression,params) -> (new ParseInfo expression,params).object
		equals: (a, b) ->
			if not a instanceof NumberObject then a = @toNumber(a)
			if not b instanceof NumberObject then b = @toNumber(b)
			dif = Math.abs a.toClone().minus(b).floatify().float()
			dif<ERROR_MIN

		toNumber: (value) ->
			switch
				when value instanceof NumberObject then return value
				when $.isNumeric( value ) then return new RealNumber(Number value)
				when (value is null) or (typeof value is "undefined") then return new RealNumber()
				when isArray value then return @exec value
				when typeof value is "object"
					if typeof value.numerator is "number"
						out = new RationalNumber(value.numerator, value.denominator)
						if value.simplify then out = out.simplify()
						return out
					if typeof value.reel is "number" then return new ComplexeNumber(value.reel, value.imaginaire)
					return new RealNumber()
				when value is "NaN" then return new RealNumber()
				when typeof value is "string" and (m = value.match /// ^liste:([;\|:,\#@&!?]+)= ///)
					liste = value.substring(value.indexOf("=")+1).split(m[1])
					(@toNumber(item) for item in liste)
				when typeof value is "string" then return @parse value, {type:"number"}
				else new RealNumber()
		float: (value,params) ->
			# params contient les éventuels symboles utiles
			# params.decimals donne la precision
			decimals = params?.decimals
			switch
				when isArray value then (@float(item,params) for item in value)
				when isArray params then (@float(value,item) for item in params)
				when typeof value is "number" then value
				when value instanceof FloatNumber then value.float(decimals)
				when value instanceof NumberObject then value.floatify(params).float(decimals)
				when value instanceof Polynome then value.floatify(params).float(decimals)
				else NaN
		assignValueToSymbol: (nO, liste) ->
			nO.toClone().assignValueToSymbol(liste).simplify()
		calc:(op1,op2,op)->
			Oop1 = @toNumber op1
			Oop2 = @toNumber op2
			switch op
				when "+" then return Oop1.am Oop2,false
				when "-" then return Oop1.am Oop2,true
				when "*" then return Oop1.md Oop2,false
				when "/" then return Oop1.md Oop2,true
				else return new RealNumber()
		vector: (name, coords) ->
			coords[key] = mM.toNumber(coords[key]) for key of coords
			new Vector name, coords
		droite: {
			par2pts: (A, B) ->
				if not((A instanceof Vector) and (B instanceof Vector)) then return new Droite2D()
				uDir = B.toClone().am A, true
				a = uDir.y
				b = uDir.x.opposite()
				pt = A.toClone()
				c = pt.x.md(a,false).opposite().am(pt.y.md(b,false),true) # c=-ax-by
				return new Droite2D [ a,b,c ]
			fromNumber: (num) -> new Droite2D(num)
		}
		polynome: {
			make:(params) ->
				# Produit un objet polynome
				switch
					when typeof params is "string" then params = { expression:params }
					when params instanceof NumberObject then params = { number:params }
				config = mergeObj {
					variable: "x"
					type: "polynome" # indique le type de sortie. L'alternative est number
				}, params
				switch
					when isArray(config.points)
						# Méthode lagrangian
						# points : liste de points de forme [{x:, y:}]
						# On vérifie que le tableau a bien le bon format
						indice=0
						while indice<config.points.length
							if (typeof config.points[indice].x is "undefined") or (typeof config.points[indice].y is "undefined") then config.points.splice(i,1)
							else
								config.points[indice].x = mM.toNumber(config.points[indice].x)
								config.points[indice].y = mM.toNumber(config.points[indice].y)
								indice++
						if config.type is "number" then PolynomeMaker.lagrangian(config.points,config.variable).toNumberObject().simplify()
						else PolynomeMaker.lagrangian(config.points,config.variable)
					when isArray(config.roots)
						# on donne les racines
						if config.a? then a = mM.toNumber(a) else a = new RealNumber(1)
						indice = 0
						roots = ( mM.toNumber x for x in config.roots )
						if config.type is "number" then PolynomeMaker.width_roots(a,roots,config.variable).toNumberObject().simplify()
						else PolynomeMaker.width_roots(a,roots,config.variable)
					when isArray(config.coeffs)
						# On donne les coeffs
						coeffs = ( mM.toNumber x for x in config.coeffs )
						if config.type is "number" then PolynomeMaker.widthCoeffs(coeffs,config.variable).toNumberObject().simplify()
						else PolynomeMaker.widthCoeffs(coeffs,config.variable)
					when config.expression? then PolynomeMaker.fromNumberObject( config.variable, (new ParseInfo config.expression,{type:"number"}).object )
					when config.number? then PolynomeMaker.fromNumberObject(config.variable,config.number)
					when config.type is "number" then new RealNumber()
					else PolynomeMaker.invalid(config.variable)
			solve: {
				numeric: (poly,params) ->
					config = mergeObj {
						bornes: null	# {min: ,max:} sinon pris à l'infini
						decimals: 1
						y:0				# P(x) = y
					}, params
					poly.solve_numeric(config.bornes?.min, config.bornes?.max, config.decimals, config.y)
				exact: (poly,params) ->
					config = mergeObj {
						y:0				# P(x) = y
						imaginaire:false
					}, params
					y = mM.toNumber config.y
					poly.solveExact(y,config.imaginaire)
			}
		}
		suite: {
			geometrique: (params) ->
				config = mergeObj {
					nom: "u"
					raison: 1
					premierTerme: { valeur:1, rang:0 }
				}, params
				(new Suite(
					config.nom
					config.premierTerme.rang
					[ mM.toNumber(config.premierTerme.valeur) ]
					(x) -> @u_nMin[0].toClone().md(PowerNumber.make(@raison.toClone(),x.am(new RealNumber(@nMin),true)),false )
					(x) -> @raison.toClone().md(x,false)
				)).set("raison", mM.toNumber(config.raison))
			arithmetique: (params) ->
				config = mergeObj {
					nom: "u"
					raison: 0
					premierTerme: { valeur:0, rang:0 }
				}, params
				(new Suite(
					config.nom
					config.premierTerme.rang
					[ mM.toNumber config.premierTerme.valeur ]
					(x) -> @u_nMin[0].toClone().am(MultiplyNumber.makeMult([x.am(new RealNumber(@nMin),true),@raison.toClone()]),false )
					(x) -> x.toClone().am(@raison,false)
				)).set("raison",mM.toNumber(config.raison))
			arithmeticogeometrique: (params) ->
				config = mergeObj {
					nom: "u"
					q: 1
					r:0
					premierTerme: { valeur:0, rang:0 }
				}, params
				q = mM.toNumber(config.q)
				r = mM.toNumber(config.r)
				if q.floatify().float() is 1 then return (new Suite(
					config.nom
					config.premierTerme.rang
					[ mM.toNumber config.premierTerme.valeur ]
					(x) -> @u_nMin[0].toClone().am(MultiplyNumber.makeMult([x.am(new RealNumber(@nMin),true),@raison.toClone()]),false )
					(x) -> x.toClone().am(@raison,false)
				)).set("raison",r)
				h = r.toClone().md(q.toClone().am(new RealNumber(1),true),true)
				(new Suite(
					config.nom
					config.premierTerme.rang
					[ mM.toNumber config.premierTerme.valeur ]
					(x) -> @u_nMin[0].toClone().am(@h,false).md(PowerNumber.make(@q.toClone(),x.am(new RealNumber(@nMin),true)),false ).am(@h,true)
					(x) -> @q.toClone().md(x,false).am(@r,false)
				)).set("q",q).set("h",h).set("r",r)
		}
		ensemble: {
			vide: () -> new Ensemble()
			R: () -> (new Ensemble()).inverse()
			singleton: (value) ->
				v = mM.toNumber value
				(new Ensemble()).insertSingleton(v)
			intervalle:(ouvrant,val1,val2,fermant) ->
				v1 = mM.toNumber val1
				v2 = mM.toNumber val2
				(new Ensemble()).init((ouvrant is "[") or (ouvrant is true), v1, (fermant is "]") or (fermant is true), v2)
		}
		factorisation:(obj,regex, params)->
			# Bug ici, besoin de trop simplifier
			if (f=obj.facto?(regex))?
				config = mergeObj { simplify:false, developp:false }, params
				if config.simplify then f[0] = f[0].simplify(null,config.developp).simplify() # bug : pourquoi faut-il deux simplify() ?
				MultiplyNumber.makeMult f
			else obj.toClone()

		verification: {
			numberValidation: (userString, inConfig) ->
				switch
					when typeof userString isnt "string"
						{ processed:false,  user:userString, error:"Erreur inconnue !"}
					when userString is ""
						{ processed:false, user:userString, error:"Ne doit pas être vide" }
					else
						config = _.extend({ developp:true, toLowerCase:false }, inConfig ? {})
						info = new ParseInfo(userString, config)
						if info.valid
							{ processed:info, user:userString, error:false }
						else
							{ processed:info, user:userString, error: info.messages }

			isSame: (processedAnswer, goodObject, parameters)->
				if typeof goodObject is "number" then goodObject = new RealNumber(goodObject)
				# Fonction de vérification des exercices pour les numberObject ou number
				# La sortie bareme est un facteur / 1
				# processedAnswer = Parse du string retourné par l'utilisateur
				# goodObject = bonne valeur. Un NumberObject
				# params = objet de paramètres dont les possibilités sont données ci-dessous
				default_config = {
					formes:null		# forme autorisées. Par ex : { racine:true, fraction:true } ou encore "FRACTION"
					p_forme:0.75		# pondération pour une forme pas suffisemment simplifiée
					tolerance:0		# Une approximation dans la tolérance est considérée comme juste et n'est pas signalée
					approx:0.1		# Une approximation est tolérée mais signalée comme fausse
					p_approx:0.5	# Pondération si le résultat n'est qu'approximatif et dans la tolérance
					arrondi:null	# Si on demande un arrondi, on précise ici une puissance (-2 pour 0.01 par ex.)
					p_arrondi:0.5	# Pondération si arrondi demandé et mal fait
					symbols:null	# liste de symboles
					custom:false	# fonction custom
				}

				keysFilter = [
					"formes"
					"p_forme"
					"tolerance"
					"approx"
					"p_approx"
					"arrondi"
					"p_arrondi"
					"symbols"
					"custom"
					"goodTex"
				]

				filtered_parameters = _.pick(parameters, keysFilter...)
				config = _.extend default_config, filtered_parameters

				erreur = erreurManager.main(goodObject,processedAnswer.object,config.symbols)
				# erreur = objet produit par la fonction mM.erreur et contenant les infos :
				# - exact = true/false : valeur exacte
				# - float = true/false : valeur décimale
				# - approx_ok:true/false : approximation correctement faite
				# - ecart:ecart = nombre
				# - p_user = nombre entier : puissance du dernier chiffre significatif

				note = 0
				errors=[]		# liste des messages d'erreur
				switch
					when typeof config.arrondi is "number"
						# On exige un arrondi.
						approx = Math.pow(10,config.arrondi)

						# On vérifie d'abord qu'on est juste au moins dans l'approx
						# Une difficulté : Si la réponse attendue est ,4,10236 à 0,01. L'utilisateur répond 4,10 ou 4,1 ce qui est
						# pris identique pour la machine et peut provoquer une erreur
						if (erreur.exact or erreur.float and (erreur.ordre<=config.arrondi))

							# Maintenant on peut vérifier si l'utilisateur respecte le format
							if not erreur.float
								errors.push { type:"warning", text:"Approximation sous forme décimale attendue." }
							if not(erreur.approx_ok or erreur.exact)
								errors.push { type:"warning", text:"Il faut arrondir au #{approx} le plus proche." }
							if erreur.p_user<config.arrondi
								errors.push { type:"warning", text:"Vous donnez trop de décimales." }
							if errors.length>0
								goodMessage = { type:"warning", text:"$#{processedAnswer.tex}$ &nbsp; est acceptée mais peut être amélioré." }
								note = config.p_arrondi
							else
								goodMessage = { type:"success", text:"$#{processedAnswer.tex}$ &nbsp; est une bonne réponse." }
								note = 1
						else
							if not erreur.float
								errors.push { type:"warning", text:"Approximation sous forme décimale attendue." }
							goodMessage = { type:"error", text:"La bonne réponse était &nbsp; $#{ numToStr(mM.float(goodObject), -config.arrondi)}$" }
					when erreur.exact or erreur.float and (erreur.ecart<=config.tolerance)
						# Résultat exact ou dans la tolérance
						note = 1
						if not processedAnswer.forme(config.formes)
							note *= config.p_forme
							errors.push { type:"warning", text:"Vous devez simplifier votre résultat." }
						if errors.length>0
							goodMessage = { type:"warning", text:"$#{processedAnswer.tex}$ &nbsp; est acceptée mais peut être amélioré." }
						else
							goodMessage = { type:"success", text:"$#{processedAnswer.tex}$ &nbsp; est une bonne réponse." }
					when erreur.float and erreur.approx_ok and (erreur.ecart<=config.approx)
						errors.push { type:"warning", text:"Vous avez donné une approximation. Il faut donner une valeur exacte." }
						note = config.p_approx
						goodMessage = { type:"warning", text:"$#{processedAnswer.tex}$ &nbsp; est acceptée mais peut être amélioré." }
					else
						goodMessage = { type:"error", text:"La bonne réponse était &nbsp; $#{ config.goodTex ? goodObject.tex()}$" }
				# Retour :
				{
					note: note
					errors: errors
					goodMessage: goodMessage
				}

			areAll : (processedAnswerList, goodObjectList, parameters) ->
				note = 0
				errors = []
				goodMessage = false

				goodObjectList = ( mM.toNumber(it) for it in goodObjectList ) # assure que les items passés sont bien des numberobjects

				if processedAnswerList.length is 0
					# L'utilisateur a répondu ensemble vide
					if (goodObjectList.length is 0)
						# La réponse était ensemble vide, c'est donc une bonne réponse
						goodMessage = { type:"success", text:"$\\varnothing$ &nbsp; est une bonne réponse" }
						note = 1
					else
						# La bonne réponse n'était pas vide
						stringAnswer = ( "$#{it.tex()}$" for it in goodObjectList).join("&nbsp; ; &nbsp;")
						goodMessage = { type:"error", text:"Vous auriez dû donner &nbsp; #{stringAnswer}." }
				else
					# L'utilisateur a donné plusieurs réponses
					if (goodObjectList.length is 0)
						# La réponse était ensemble vide, L'utilisateur s'est donc trompé
						goodMessage = { type:"error", text:"La bonne réponse était &nbsp; $\\varnothing$." }
					else
						# Il faut faire le tri pour associer deux à deux user et good
						{ closests, lefts } = mM.verification.tri processedAnswerList, goodObjectList
						bads = []
						goods = []
						N = Math.max(goodObjectList.length, processedAnswerList.length)
						messages = []
						for sol in closests
							if sol.good?
								# Un objet good a été associé à cette réponse utilisateur
								verifResponse = mM.verification.isSame(sol.info, sol.good, parameters)
								note += verifResponse.note/N
								if verifResponse.note is 0
									bads.push sol.info
									lefts.push sol.good
								else
									goods.push sol.info
									errors = errors.concat(verifResponse.errors)
							else
								bads.push sol.info
						if goods.length>0
							stringGoods = ( "$#{it.tex}$" for it in goods).join("&nbsp; ; &nbsp;")
							goodMessage = { type:"success", text:"Bonne(s) réponse(s) : &nbsp; #{stringGoods}" }
						if bads.length>0
							stringBads = ( "$#{it.tex}$" for it in bads).join("&nbsp; ; &nbsp;")
							errors.push { type:"error", text: "Ces solutions que vous donnez sont fausses: &nbsp;#{stringBads}." }
						if lefts.length>0
							stringLefts = ( "$#{it.tex?() ? it}$" for it in lefts).join("&nbsp; ; &nbsp;")
							errors.push { type:"error", text: "Vous n'avez pas donné ces solutions : &nbsp;#{stringLefts}." }
				# Retour :
				{
					note: note
					errors: errors
					goodMessage: goodMessage
				}

			areSome: (processedAnswerList, goodObjectList, parameters) ->
				note = 0
				errors = []
				goodMessage = false
				if not isArray(processedAnswerList)
					processedAnswerList = _.compact([processedAnswerList])
				if processedAnswerList.length is 0
					# L'utilisateur a répondu ensemble vide
					if (goodObjectList.length is 0)
						# La réponse était ensemble vide, c'est donc une bonne réponse
						goodMessage = { type:"success", text:"$\\varnothing$ &nbsp; est une bonne réponse" }
						note = 1
					else
						# La bonne réponse n'était pas vide
						stringAnswer = ( "$#{it.tex()}$" for it in goodObjectList).join(" ; ")
						goodMessage = { type:"error", text:"Vous auriez dû donner &nbsp; #{stringAnswer}." }
				else
					# L'utilisateur a donné plusieurs réponses
					if (goodObjectList.length is 0)
						# La réponse était ensemble vide, L'utilisateur s'est donc trompé
						goodMessage = { type:"error", text:"La bonne réponse était &nbsp; $\\varnothing$." }
					else
						# Il faut faire le tri pour associer deux à deux user et good
						{ closests, lefts } = mM.verification.tri processedAnswerList, goodObjectList
						bads = []
						N = processedAnswerList.length
						messages = []
						goods = []
						for sol in closests
							if sol.good?
								# Un objet good a été associé à cette réponse utilisateur
								verifResponse = mM.verification.isSame(sol.info, sol.good, parameters)
								note += verifResponse.note/N
								if verifResponse.note is 0
									bads.push sol.info
									lefts.push sol.good
								else
									goods.push sol.info
									errors = errors.concat(verifResponse.errors)
							else
								bads.push sol.info
						if goods.length>0
							stringGoods = ( "$#{it.tex}$" for it in goods).join("&nbsp; ; &nbsp;")
							goodMessage = { type:"success", text:"Bonne(s) réponse(s) : &nbsp; #{stringGoods}" }
						if bads.length>0
							stringBads = ( "$#{it.tex}$" for it in bads).join("&nbsp; ; &nbsp;")
							errors.push { type:"error", text: "Ces solutions que vous donnez sont fausses: &nbsp;#{stringBads}." }
							if not goodMessage
								# Il n'y a que des mauvaise réponse, il faut les préciser
								stringLefts = ( "$#{it.tex?() ? it}$" for it in lefts).join("&nbsp; ; &nbsp;")
								goodMessage = { type:"error", text:"Réponse(s) possible(s) : &nbsp; #{stringLefts}" }
				# Retour :
				{
					note: note
					errors: errors
					goodMessage: goodMessage
				}

			tri: (users,goods) ->
				# users est un tableau d'objets ParseInfo
				# goods est un tableau d'objets (idem)
				goodsObj = ( { value: mM.toNumber(item), rank:i, d:[] } for item,i in goods )
				usersObj = ( { value:userInfo.object, info:userInfo, rank:i, d:[] } for userInfo, i in users when userInfo instanceof ParseInfo)
				erreurManager.tri(usersObj,goodsObj)


		}
	}
