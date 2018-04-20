
	MODULO_LETTER = "k"

	class SymbolManager
		# Simple conteneur pour créer les objets symboles
		# et pour contenir les valeurs
		@symbolsValueList: {}
		@alias:false
		@setAlias:(alias) ->
			if (typeof alias isnt "object") or (alias is null) then @alias = false
			else @alias = alias
		@checkAlias: (name) ->
			if @alias is false then return false
			for key, value of @alias
				if name in value then return key
			false
		@makeSymbol: (name) ->
			# Le but de cette méthode est de créer directement le bon type d'objet
			a = name
			if (s=SymbolManager.checkAlias(name)) isnt false then name = s
			switch
				when name is "ℝ" then (new Ensemble()).inverse()
				when (name is "π") or (name is "pi") then @pi()
				when name is "∅" then new Ensemble()
				when (name is "∞") or (name is "infini") then new InftyNumber()
				when name is "i" then new ComplexeNumber(0,1)
				when name is "#" then new Monome(1, { name:"modulo", power:1} )
				when name is "" then new RealNumber()
				else new Monome(1, { name:name, power:1 })
		@pi: -> new Monome(1, { name:"pi", power:1 })
		@setSymbolsValue: (symbols) ->
			# Liste de symbols { key:value }
			for key, value of symbols
				switch
					when typeof value is "number" then @symbolsValueList[key] = new RealNumber(value)
					when (value instanceof NumberObject) and (value.isFunctionOf().length is 0) then @symbolsValueList[key] = value # On autorise pas de dépendance de symbole à symbole
					else @symbolsValueList[key] = new RealNumber()
		@getSymbolValue: (symbolName,symbols) ->
			v1=symbols?[symbolName]
			v2=@symbolsValueList[symbolName]
			switch
				when symbolName is "e" then return new RealNumber(Math.E)
				when symbolName is "pi" then return new RealNumber(Math.PI)
				when typeof v1 is "number" then new RealNumber v1
				when (v1 instanceof NumberObject) and not(v1.isFunctionOf(symbolName)) then v1
				when typeof v2 is "number" then new RealNumber v2
				when (v2 instanceof NumberObject) and not(v2.isFunctionOf(symbolName)) then v2
				else new RealNumber()
	class MObject
		simplify: (infos=null) -> @
		toString: -> "?"
		tex: -> "?"
		toClone: -> new MObject()
		getPolynomeFactors: (variable) -> null
		developp: (infos=null) -> @
		derivate: (variable) -> new MObject()
	#----------Numbers---------
	class NumberObject extends MObject
		_plus: true
		setPlus: (plus) ->
			@_plus = plus
			@
		signe: ->
			if @_plus then 1
			else -1
		toString: ->
			composite = @compositeString { tex:false }
			if composite[1] then out=composite[0]
			else out="-"+composite[0]
			if @_modulo?
				modComposite = @_modulo.compositeString { tex:false }
				if modComposite[1] then out = out+"+"+MODULO_LETTER+"*"+modComposite[0]
				else out = out+"-"+MODULO_LETTER+"*"+modComposite[0]
			out
		tex: (config)->
			# options.tex = indique si on cherche une version tex
			# les autres options ne servent que pour le cas d'un tex
			# options.symbolsUp : 2/4*x s'écriera 2x/4
			# options.altFunctionTex : tableau des fonctions à donner sous une forme alt
			# options.negPowerDown: Mets les puissances négatives au dénominateur
			options = mergeObj { tex:true }, config
			composite = @compositeString options
			if composite[1] then out=composite[0]
			else out="-"+composite[0]
			if @_modulo?
				modComposite = @_modulo.compositeString options
				if modComposite[1] then out = out+"+"+MODULO_LETTER+"\\cdot "+modComposite[0]
				else out = out+"-"+MODULO_LETTER+"\\cdot "+modComposite[0]
				out+=",k\\in\\mathbb{Z}"
			out
		compositeString : (options) -> ["?", @_plus, false, false]
			# Cette fonction renvoie en morceaux les différents éléments d'un string
			# On obtient donc un tableau qui renvoie :
			# string => chaine sans l'éventuel premier signe (toujours donnée en premier élément)
			# beginPlus => Indique que le premier signe est + (toujours présent, en 2e)
			# addition => Indique si bloc addition (toujours en 3e)
			# multiplication => Indique si bloc multiplication (toujours en 4e)
			# L'argument permet de préciser s'il s'agit d'un retour en laTex
		simplify: (infos=null,developp=false, memeDeno=false) -> new RealNumber()
		add: (operand, infos=null) -> @am(operand, false, infos)
		minus: (operand, infos=null) -> @am(operand, true, infos)
		am: (operand, minus, infos=null) ->
			if operand.isNul() then return @
			op = operand.toClone()
			if minus then op.opposite()
			if @isNul() then return op
			new PlusNumber(@, op)
		opposite: () ->
			# À noter que cette fonction renvoie toujours l'objet de départ et se contente de le modifier
			@_plus = not @_plus
			@
		mult: (operand, infos=null) -> @md(operand, false, infos)
		divide: (operand, infos=null) -> @md(operand, true, infos)
		md: (operand, divide,infos=null) ->
			if @isNul() then return new RealNumber(0)
			if operand.isNul()
				if divide then return new RealNumber()
				else return new RealNumber(0)
			op = operand.toClone()
			if divide
				if typeof (inverse = op.inverse()) isnt "undefined" then return new MultiplyNumber(@, inverse)
				else return (new MultiplyNumber(@)).pushDenominator(op)
			new MultiplyNumber(@, op)
		inverse : -> undefined
		puissance : (exposant) ->
			if (exposant instanceof NumberObject) then exposant = exposant.floatify().float()
			if not isInteger(exposant) then return new RealNumber()
			if exposant is 0 then return new RealNumber(1) # Suppose que 0^0 = 1
			if exposant > 10 then return new RealNumber() # Pour éviter un calcul trop long
			output = new RealNumber(1)
			for i in [1..Math.abs(exposant)]
				output = output.md(@, false)
			if exposant<0 then (new RealNumber(1)).md(output, true)
			else output
		floatify: (symbols) -> new RealNumber()
			#	Renvoie soit un RealNumber soit un ComplexeNumber
		float: () -> NaN
		isFunctionOf: (symbol) ->
			# Si on précise le string symbol, on cherche si l'objet est fonction de ce symbol
			# sinon on donne un tableau contenant tous les symbols donc le number est fonction
			if typeof symbol is "string" then false
			else []
		degre: (variable) -> 0 # degre de dépendance à un symbole donné. Pas "i"
		toClone : ->
			clone = new NumberObject()
			clone.setPlus(@_plus)
		isNul: (symbols) -> @floatify(symbols).isNul()
		isPositive: (symbols) -> @floatify(symbols).isPositive()
		isNegative: (symbols) -> @floatify(symbols).isNegative()
		isOne:(facto=1) -> @float() is facto
		isNaN: -> true
		isInteger: -> undefined	# Permet d'appeler la fonction sur tous les objets
		isFloat: -> undefined	# Permet d'appeler la fonction sur tous les objets
		isReal: (symbols) -> @floatify(symbols).isReal()	# Permet d'appeler la fonction sur tous les objets
		isImag: (symbols) -> @floatify(symbols).isImag()	# Permet d'appeler la fonction sur tous les objets
		getReal: -> new RealNumber()	# Permet d'appeler la fonction sur tous les objets
		getImag: -> new RealNumber()	# Permet d'appeler la fonction sur tous les objets
		conjugue: -> @ # certains type d'objets n'ont pas une définition appropriée de conjugue
		assignValueToSymbol: (liste) ->
			# Transforme les occurences de Symbol
			# C'est l'appel parent qui vérifie les items
			for key,value of liste
				switch
					when typeof value is "number" then liste[key] = new RealNumber(value)
					when (value instanceof NumberObject) and (value.isFunctionOf().length>0) then liste[key] = new RealNumber()
			@_childAssignValueToSymbol(liste)
		_childAssignValueToSymbol:(liste) -> @
		signature: -> "N/A"	# Permet de regrouper des termes dont la forme est semblable
		extractFactor: ->
			if @_plus then return new RealNumber(1)
			@_plus = true
			new RealNumber(-1)
		order: (normal=true) -> @ # Trie les facteurs
		derivate:(variable)->
			if @isFunctionOf(variable) then return new RealNumber()
			else return new RealNumber(0)
		extractModulo: (variable) -> { base:@, error:false } # La fonction peut corrompre l'objet en cas d'échec
		setModulo: (modulo) ->
			@_modulo = modulo
			@
		getModulo: ->
			if @_modulo? then @_modulo
			else false
		modulo: (param) ->
			if param instanceof NumberObject
				@_modulo = param
			if @_modulo? then return { base:@, modulo:@_modulo }
			unless typeof param is "string" then param = "modulo"
			out = @toClone().extractModulo param
			if not(out.error) and out.modulo?
				modulo = out.modulo.simplify()
				{ base:out.base.setModulo(modulo), modulo:modulo }
			else { base:@, modulo:false }
		applyFunction: (functionName) -> FunctionNumber.make functionName, @
		compare: (b,symbols)->
			ecart = @toClone().am(b,true);
			switch
				when ecart.isNul(symbols) then 0			# Peut fonctionner pour un complexe
				when ecart.isPositive(symbols) then 1		# Fonctionne pour +infini
				when ecart.isNegative(symbols) then -1		# Fonctionne pour -infini
				else false 							# Un complexe renvoie false, de même qu'un réel de value = NaN
			# À noter qu'un nombre peut renvoyer faux aussi bien à positif qu'à négatif, s'il est NaN ou écart complexe
		distance: (b, symbols) ->
			# Renvoie un float donnant la distance entre deux numberobject
			# Fonctionne pour les complexes
			if not(b instanceof NumberObject) then return NaN
			d = @toClone().am(b,true).floatify(symbols).abs().float()
			if @getModulo() isnt false then modA = @getModulo().floatify(symbols).abs().float()
			else modA=-1
			if b.getModulo() isnt false then modB = b.getModulo().floatify(symbols).abs().float()
			else modB=-1
			# Je ne prends en compte qu'un seul des modulo
			modulo = Math.max(modA,modB)
			if modulo>0
				d-= modulo while modulo<=d
			if d<ERROR_MIN then d = 0
			d
		equals: (b,symbols) -> @floatify(symbols).am(b.floatify(symbols),true).isNul()
		facto: (regex) -> null
		replace: (replacement,needle) ->
			# Remplaces les symboles needle par replacement
			@toClone()
		getNumDen:() -> [@, new RealNumber(1)]
	class PlusNumber extends NumberObject
		constructor: ->
			@operands = []
			for operand in arguments
				if operand instanceof PlusNumber and operand._plus
					@operands.push(sous_operand) for sous_operand in operand.operands
				else
					if operand instanceof NumberObject then @operands.push operand
		@makePlus: (ops) ->
			if ops.length is 0 then return new RealNumber(0)
			if ops.length is 1 then return ops[0]
			if (ops.length is 2) and ops[1].isImag() and ops[0].isReal()
				return ops[0].am ops[1], false
			new PlusNumber ops...
		compositeString: (options) ->
			n = @operands.length
			if n is 0 then return ['0', true, false, false]
			cs_start = @operands[0].compositeString options
			if n is 1
				cs_start[1] = (cs_start[1] == @_plus)
				return cs_start
			str = cs_start[0]
			for oper in @operands[1..n]
				cs = oper.compositeString options;
				if cs[1] then str += "+"+cs[0]
				else str += "-"+cs[0];
			if @_plus then return [str, cs_start[1], true, false]
			if not cs_start[1] then str = '-'+str
			if options.tex then str = "\\left(#{str}\\right)"
			else str = "(#{str})"
			[str, false, false, false]
		simplify: (infos=null,developp=false,memeDeno=false)->
			for operand, i in @operands
				if not @_plus then operand.opposite()
				@operands[i] = operand.simplify(infos,developp,memeDeno)
			@_plus = true
			@absorb_sousAdd()
			i=0
			while i<@operands.length
				sign_i = @operands[i].signature()
				if sign_i isnt "N/A"
					j=i+1
					while j<@operands.length
						sign_j = @operands[j].signature()
						if sign_i is sign_j
							if sign_i is "1" then @operands[i] = @operands[i].amSimple(@operands[j], false, infos)
							else
								@operands[i] = @operands[i].md(@operands[i].extractFactor().amSimple(@operands[j].extractFactor(),false), false)
								infos?.set("ADD_REGROUPEMENT")
							@operands.splice(j,1)
						else j++
				if @operands[i].isNul() then @operands.splice(i,1)
				else i++
			if (memeDeno is true) and (@operands.length>1)
				# Il faut chercher les dénominateurs et tout mettre sur un même dénominateur
				dens = new RealNumber 1
				for i in [0..@operands.length-1]
					[num, den] = @operands.shift().getNumDen()
					@operands = ( op.md(den,false).simplify() for op in @operands )
					@operands.push num
					dens = dens.md(den,false)
				dens = dens.simplify()
				out = @developp().simplify(null,false,false)
				if (dens instanceof RealNumber) and (dens.isOne()) then return out
				else return out.md(dens,true)
			if @operands.length is 0 then return new RealNumber(0)
			if @operands.length is 1 then return @operands[0]
			@
		am: (operand, minus, infos=null) ->
			if minus then @operands.push(operand.toClone().opposite())
			else @operands.push(operand.toClone())
			@
		opposite: ->
			@_plus = not @_plus
			@
		order: (normal=true) ->
			op.order(normal) for op in @operands
			if normal then @operands.sort (a,b) -> signatures_comparaison(a,b,1)
			else @operands.sort (a,b) -> signatures_comparaison(a,b,-1)
			@
		# md: (operand, divide, infos=null) -> identique au parent
		floatify : (symbols) ->
			total = new RealNumber(0)
			for operand in @operands
				total = total.addSimple(operand.floatify(symbols))
			if not @_plus then total.opposite()
			total
		isFunctionOf: (symbol) ->
			if typeof symbol is "string"
				for operand in @operands
					if operand.isFunctionOf(symbol) then return true
				false
			else
				out = []
				for operand in @operands
					sym = operand.isFunctionOf()
					out = union_arrays out, sym
				out
		degre: (variable) -> Math.max (operand.degre(variable) for operand in @operands)...
		toClone: ->
			clone = new PlusNumber()
			for operand in @operands
				clone.push(operand.toClone())
			clone.setPlus(@_plus)
		conjugue: ->
			operand.conjugue() for operand in @operands
			@
		_childAssignValueToSymbol: (liste) ->
			@operands[i]=operand._childAssignValueToSymbol(liste) for operand,i in @operands
			@
		developp: (infos=null) ->
			for operand,i in @operands
				if not @_plus then operand.opposite()
				@operands[i] = operand.developp(infos)
			@_plus = true
			@absorb_sousAdd()
			@
		#signature: -> identique au parent
		#extractFactor: -> identique au parent
		getPolynomeFactors: (variable) ->
			# utilisé pour créer l'arborescence nécessaire pour créer un objet polynome
			output = { add:( op.getPolynomeFactors(variable) for op in @operands ) }
			if @_plus then output
			else { mult:[-1, output] }
		derivate: (variable) ->
			der = new PlusNumber()
			der.setPlus(@_plus)
			der.push nb.derivate(variable) for nb in @operands
			der
		extractModulo: (variable) ->
			moduloObject = null
			for op, i in @operands
				moduloPartial = op.extractModulo variable
				if moduloPartial.error then return { error:true }
				if moduloPartial.modulo?
					if moduloObject is null then moduloObject = moduloPartial.modulo
					else moduloObject = moduloObject.am moduloPartial.modulo, false
					@operands[i] = moduloPartial.base
			if moduloObject is null then return { base:@simplify(), error:false }
			else return { base:@simplify(), error:false, modulo:moduloObject }
		# spécifiques de la classe
		push: ->
			for operand in arguments
				if operand instanceof PlusNumber and operand._plus
					@operands.push(sub_operand) for sub_operand in operand.operands
				else if operand instanceof NumberObject then @operands.push(operand)
			@
		developpingMult: (operand) ->
			if operand instanceof PlusNumber
				new_operands = []
				plus_produit = (@_plus == operand._plus)
				for plus1_operand in @operands
					for plus2_operand in operand.operands
						new_operands.push(plus1_operand.toClone().md(plus2_operand,false))
				if not plus_produit
					for plus_operand in new_operands
						operand.opposite()
				@operands = new_operands
			else
				for plus_operand, i in @operands
					@operands[i] = plus_operand.md(operand,false)
					if not @_plus then @operands[i].opposite()
			@_plus = true
			@
		absorb_sousAdd: ->
			for operand, i in @operands
				if (operand instanceof PlusNumber) and operand._plus
					@operands[i..i]=operand.operands
			@
		facto:(regex) ->
			out = []
			factor = null
			for op in @operands
				f = op.facto(regex)
				if f is null then return null
				if factor is null then factor = f[1]
				out.push f[0]
			if factor is null then return null
			[@constructor.makePlus(out), factor]
		replace: (replacement,needle) ->
			# Remplaces les symboles needle par replacement
			clone = new PlusNumber()
			clone.push(operand.replace(replacement,needle)) for operand in @operands
			clone.setPlus(@_plus)
		getOperands: -> @operands
	class MultiplyNumber extends NumberObject
		constructor: ->
			@_signature = null
			@numerator = []
			@denominator = []
			for operand in arguments
				if operand instanceof NumberObject then @numerator.push(operand)
			@absorbSousMults(true)
		@makeMult: (ops) ->
			# Utile pour l'utilisation depuis les tokens afin de créer l'objet adequat
			switch
				when ops.length is 2
					if ((ops[0] instanceof RealNumber) or (ops[0] instanceof RationalNumber) or ops[0].isPur?()) and ops[1].isSimpleSqrt?()
						return ops[1].mdSimple(ops[0],false) # Dans ce cas on regroupe le facteur et la racine
					if ops[1].isI?() and ops[0].isSimpleWidthI?()
						# Dans ce cas c'est x.i
						return ops[0].mdSimple(ops[1],false)
					if ops[0].isI?() and ops[1].isSimpleWidthI?()
						# Dans ce cas c'est i.x
						return ops[1].mdSimple(ops[0],false)
				when ops.length is 1 then return ops[0]
				when ops.length is 0 then return new RealNumber(1)
			(new MultiplyNumber).pushNumerator(ops...)
		@makeDiv: (op1,op2) ->
			# Utile pour l'utilisation depuis les tokens afin de créer l'objet adequat
			if (fractionized = op1.fractionize?(op2))? then return fractionized
			return (new MultiplyNumber()).pushNumerator(op1).pushDenominator(op2)
		compositeString: (options) ->
			num = @compositeString_special(@numerator, options)
			if @denominator.length is 0 then return num
			den = @compositeString_special(@denominator, options)
			if options.tex					# format tex
				if num[2] and not num[1]	# groupe additif et signe -
					num[0] = "-"+num[0]		# Dans ce cas on ajoute le - devant le premier élément
					num[1] = true
				if den[2] and not den[1]	# Même chose pour le dénominateur
					den[0] = "-#{den[0]}"
					den[1] = true
				return ["\\frac{#{num[0]}}{#{den[0]}}", num[1] is den[1], false, true]
			if num[2]
				if num[1] then num[0] = "(#{num[0]})"
				else num[0] = "(-#{num[0]})"
				num[1] = true
			if den[2]
				if den[1] then den[0] = "(#{den[0]})"
				else den[0] = "(-#{den[0]})"
				den[1] = true
			else
				if den[3] then den[0] = "(#{den[0]})"
			["#{num[0]}/#{den[0]}", num[1] is den[1], false, true]
		simplify: (infos=null,developp=false, memeDeno=false) ->
			@_signature = null
			for operand, i in @numerator
				if developp then operand = operand.developp(infos)
				@numerator[i] = operand.simplify(infos,developp,memeDeno)
			for operand, i in @denominator
				if developp then operand = operand.developp(infos)
				@denominator[i] = operand.simplify(infos,developp,memeDeno)
			@absorbSousMults(true)
			@absorbSousMults(false)
			@contractNumbersAndSymbols(infos)
			if developp then @developp_special(true,infos,true,memeDeno)
			if @denominator.length is 0
				if @numerator.length is 0 then return new RealNumber(1)
				if @numerator.length is 1 then return @numerator.pop()
			@
		# am : fonction par défaut
		opposite: ->
			if @numerator.length isnt 0 then @numerator[0].opposite()
			else @numerator.push(new RealNumber(-1))
			@
		order: (normal=true) ->
			num.order(normal) for num in @numerator
			den.order(normal) for den in @denominator
			if normal
				@numerator.sort (a,b) -> signatures_comparaison(a,b,1)
				@denominator.sort (a,b) -> signatures_comparaison(a,b,1)
			else
				@numerator.sort (a,b) -> signatures_comparaison(a,b,-1)
				@denominator.sort (a,b) -> signatures_comparaison(a,b,-1)
			@
		md: (operand, div, infos=null) ->
			# Debug : Il faudrait vérifier qu'on insère pas un multiply
			@_signature = null
			if div then @denominator.push(operand.toClone())
			else @numerator.push(operand.toClone())
			if (operand instanceof SimpleNumber) or (operand instanceof Monome) then @contractNumbersAndSymbols(infos)
			@
		inverse: ->
			@_signature = null
			temp = @numerator
			@numerator = @denominator
			@denominator = temp
			@contractNumbersAndSymbols()
			if @numerator.length is 0 then @numerator.push(new RealNumber(1))
			@
		floatify : (symbols) ->
			produit = new RealNumber(1)
			for operand in @numerator
				produit = produit.mdSimple(operand.floatify(symbols),false)
			for operand in @denominator
				produit = produit.mdSimple(operand.floatify(symbols).inverse(),false)
			produit
		isFunctionOf: (symbol) ->
			if typeof symbol is "string"
				for operand in @numerator
					if operand.isFunctionOf(symbol) then return true
				for operand in @denominator
					if operand.isFunctionOf(symbol) then return true
				false
			else
				out = []
				for operand in @numerator
					sym = operand.isFunctionOf()
					out = union_arrays out, sym
				for operand in @denominator
					sym = operand.isFunctionOf()
					out = union_arrays out, sym
				out
		degre:(variable) ->
			out = 0
			out += operand.degre(variable) for operand in @numerator
			out -= operand.degre(variable) for operand in @denominator
			out
		toClone: ->
			clone = new MultiplyNumber()
			for operand in @numerator
				clone.pushNumerator(operand.toClone())
			for operand in @denominator
				clone.pushDenominator(operand.toClone())
			clone
		conjugue: ->
			operand.conjugue() for operand in @numerator
			operand.conjugue() for operand in @denominator
			@
		_childAssignValueToSymbol: (liste) ->
			@numerator[i]=operand._childAssignValueToSymbol(liste) for operand,i in @numerator
			@denominator[i]=operand._childAssignValueToSymbol(liste) for operand,i in @denominator
			@
		developp: (infos=null) ->
			@_signature = null
			@developp_special(true,infos,false,false)
			if @denominator.length isnt 0 then @developp_special(false,infos,false,false)
			# Après développement, il peut ne rester qu'un élément plus
			if (@numerator.length is 1) and (@denominator.length is 0) then return @numerator[0]
			@
		signature: ->
			if @_signature isnt null then return @_signature
			num = []
			for operand in @numerator
				sign = operand.signature()
				if sign is "N/A" then return "N/A"
				if sign isnt "1" then num.push(sign)
			num.sort()
			den = []
			for operand in @denominator
				sign = operand.signature()
				if sign is "N/A" then return "N/A"
				if sign isnt "1" then num.push(sign)
			den.sort()
			if (num.length is 0) and (den.length is 0) then return "1"
			if num.length is 0 then output = "1"
			else output=num.join(".")
			if den.length is 1 then output = output+"/"+den[0]
			else if den.length > 1 then output = output+"/("+den.join(".")+")"
			@_signature = output
			return output
		extractFactor: ->
			factor = new RealNumber(1)
			i=0
			while i<@numerator.length
				if @numerator[i] instanceof SimpleNumber
					factor = factor.mdSimple(@numerator[i], false)
					@numerator.splice(i,1)
				else
					factor = factor.mdSimple(@numerator[i].extractFactor(), false)
					i++
			while i<@denominator.length
				if @denominator[i] instanceof SimpleNumber
					factor = factor.mdSimple(@denominator[i], true)
					@denominator.splice(i,1)
				else
					factor = factor.mdSimple(@denominator[i].extractFactor(),true)
					i++
			return factor
		getPolynomeFactors: (variable) ->
			if (item for item in @denominator when item.isFunctionOf(variable)).length>0 then null
			else
				mult = ( op.getPolynomeFactors(variable) for op in @numerator)
				if not @_plus then mult.unshift -1
				if @denominator.length>0
					oDiv = new RealNumber(1)
					oDiv = oDiv.md(op,true) for op in @denominator
					mult.push oDiv
				{ mult:mult }
		derivate: (variable) ->
			if not @isFunctionOf(variable) then return new RealNumber(0)
			numFactors = [new RealNumber 1]
			for op in @numerator
				if op.isFunctionOf(variable) then newTerm = numFactors[0].toClone()
				else newTerm = null
				numFactors[i] = opF.md(op,false) for opF,i in numFactors
				if newTerm isnt null then numFactors.push newTerm.md(op.derivate(variable),false)
			deno = new RealNumber(1)
			for op in @denominator
				deno = deno.md op,false
				if op.isFunctionOf(variable)
					newTerm = numFactors[0].toClone()
					deno = deno.md op,false
				else newTerm = null
				numFactors[i] = opF.md(op,false) for opF,i in numFactors
				if newTerm isnt null then numFactors.push newTerm.md(op.derivate(variable),false).opposite()
			numFactors.shift()
			out = numFactors.shift()
			out = out.am(numFactors.shift(),false) while numFactors.length>0
			out = out.md deno,true
			out
		# méthodes spécifiques
		pushNumerator: ->
			@_signature = null
			for operand in arguments
				if operand instanceof NumberObject then @numerator.push(operand)
			@
		pushDenominator: ->
			@_signature = null
			for operand in arguments
				if operand instanceof NumberObject then @denominator.push(operand)
			@absorbSousMults(false)
			@
		absorbSousMults: (up, widthInverse = true) ->
			# Absorbe les sous mults
			# up indique le sens :
			# pour true, c'est une absorption au niveau numérateur
			# pour false, c'est une absorption au niveau dénominateur
			# On parcours la liste (numerateur ou dénomionateur) operA à la recherche d'un élément multiply
			# Si on en trouve, le numérateur est simplement intégré à la même position
			# et le dénominateur est mis au bout de l'autre (dénominateur ou numérateur)
			# Le paramètre permet de ne pas traiter les cas où le multiply trouvé contient un dénominateur
			@_signature = null
			if up
				for operand, i in @numerator
					if (operand instanceof MultiplyNumber) and (widthInverse or (operand.denominator?.length is 0))
						@numerator[i..i] = operand.numerator
						@denominator = @denominator.concat(operand.denominator)
			else
				for operand, i in @denominator
					if (operand instanceof MultiplyNumber) and (widthInverse or (operand.denominator?.length is 0))
						@denominator[i..i] = operand.numerator
						@numerator = @numerator.concat(operand.denominator)
			@
		contractNumbersAndSymbols : (infos=null) ->
			@_signature = null
			# Attention : Le calcul donne la priorité au 0. Donc en cas de 0*infini, c'est 0 qui l'emporte
			# Tous les SimpleNumber ou Monome passent au numérateur
			@denominator.reverse()
			new_denominator = []
			i = 0
			while i<@denominator.length
				inv = @denominator[i].inverse()
				if typeof inv isnt "undefined"
					@numerator.push(inv)
					@denominator.splice(i,1)
				else i++
			# On assemble les Numbers et Symbols et Monomes ce qui est rendu beaucoup plus simple par la
			# la possibilité des monomes
			flagMultNotStarted = true
			base = new RealNumber(1)
			i=0
			while i<@numerator.length
				operand = @numerator[i]
				if (operand instanceof SimpleNumber) or (operand instanceof Monome)
					if operand.isNul()
						infos?.set("MULT_SIMPLE")
						@numerator = [new RealNumber(0)]
						@denominator = [];
						return @
					else
						if flagMultNotStarted
							base = base.md(operand, false)
							flagMultNotStarted = false
						else base = base.md(operand, false, infos)
						@numerator.splice(i,1)
				else
					base = base.md(operand.extractFactor(), false)
					i++
			if not (base=base.simplify(infos)).isOne() then @numerator.unshift(base)
			@
		developp_special: (up, infos,simplify,memeDeno) ->
			# up indique si on développe en haut ou en bas
			# Pour développer il faut au moins un plus, on commence par le chercher
			operPlus = null
			if up then operands = @numerator else operands = @denominator
			for operand,i in operands
				operands[i] = operand.developp(infos)
			@absorbSousMults(up) # pourrait être requis par le développement d'une puissance
			i=0
			while (i<operands.length) and (operPlus is null)
				if (operands[i] instanceof PlusNumber) then operPlus = operands[i]
				else i++
			if operPlus isnt null
				while operand = operands.shift()
					if operand isnt operPlus
						operPlus.developpingMult(operand)
						infos?.set("DISTRIBUTION")
						actionDone = true;
				# si simplify est true, on repasse un coup de simplify sur operPlus
				if simplify then operPlus = operPlus.simplify(infos,false,memeDeno)
				operands.push(operPlus)
			@
		compositeString_special: (operands, options) ->
			n = operands.length
			if n is 0 then return ['1', true, false, false]
			cs0 = operands[0].compositeString options
			if n is 1 then return cs0
			str = cs0[0]
			if (cs0[2])
				if cs0[1]
					if options.tex then str = "\\left(#{str}\\right)"
					else str = "(#{str})"
				else
					cs0[1] = true
					if options.tex then str = "\\left(-#{str}\\right)"
					else str = "(-#{str})"
			for operand in operands[1..n]
				cs = operand.compositeString options
				if not cs[1] then cs[0] = "-#{cs[0]}"
				if not cs[1] or cs[2]
					if options.tex then cs[0] = "\\left(#{cs[0]}\\right)"
					else cs[0] = "(#{cs[0]})"
				if options.tex then str = "#{str}\\cdot #{cs[0]}"
				else str = "#{str}*#{cs[0]}"
			[str, cs0[1], false, true]
		extractModulo: (variable) ->
			if not @isFunctionOf variable then return { base:@, error:false }
			@contractNumbersAndSymbols()
			for op,i in @numerator
				if (op instanceof Monome) and (op.isFunctionOf variable)
					mod = op.extractModulo(variable)
					if mod.error then return { error:true }
					@numerator[i] = mod.modulo
					if not @isFunctionOf variable then return { base:new RealNumber(0), error:false, modulo:@ }
					else return { error:true }
			# normalement on n'atteint pas ce niveau
			return { base:@, error:true }
		facto: (regex) ->
			i=0
			while i<@numerator.length
				f = @numerator[i].facto(regex)
				if f isnt null
					out = @toClone()
					out.numerator[i] = f[0]
					return [ out, f[1] ]
				i++
			return null
		replace: (replacement,needle) ->
			# Remplaces les symboles needle par replacement
			clone = new MultiplyNumber()
			for operand in @numerator
				clone.pushNumerator(operand.replace(replacement,needle))
			for operand in @denominator
				clone.pushDenominator(operand.replace(replacement,needle))
			clone
		getNumDen: -> [ new MultiplyNumber(@numerator...), new MultiplyNumber(@denominator...) ]
	class PowerNumber extends NumberObject
		# constructor est private. Passer par make
		constructor: (base, exposant) ->
			@_base = base
			@_exposant = exposant
		@make: (base, exposant) ->
			if (base is "e") or (base instanceof Monome) and (base.isSymbol("e")) then return FunctionNumber.make("exp",exposant)
			if (typeof base is "undefined") or not (base instanceof NumberObject) then base = new RealNumber(base)
			switch
				when exposant instanceof NumberObject then exp = exposant
				when typeof exposant is "number" then exp = new RealNumber(exposant)
				else exp = new RealNumber(1)
			if (base instanceof Monome) and exp.isReal() and exp.isInteger() then return base.puissance(exp)
			new PowerNumber(base,exp)
		compositeString: (options) ->
			if (@_base instanceof FunctionNumber) and (@_exposant instanceof RealNumber)
				cs = @_base.compositeString options, @_exposant.float()
				cs[1] = @_plus
				cs
			else
				b = @_base.compositeString options
				e = @_exposant.compositeString options
				if not b[1] then b[0] = "-#{b[0]}" # On ajoute l'éventuel - dans le string du nombre
				if not e[1] then e[0] = "-#{e[0]}" # On ajoute l'éventuel - dans le string du nombre
				if options.tex
					if b[2] or b[3] or not b[1] or (@_base instanceof FunctionNumber) then b[0] = "\\left(#{b[0]}\\right)"
					e[0] = "{#{e[0]}}"
				else
					if b[2] or b[3] or not b[1] or (@_base instanceof FunctionNumber) then b[0] = "(#{b[0]})"
					if e[2] or e[3] then e[0] = "(#{e[0]})"
				["#{b[0]}^#{e[0]}", @_plus, false, true]
		simplify: (infos=null, developp=false,memeDeno=false) ->
			@_exposant = @_exposant.simplify(infos,developp,memeDeno)
			@_base = @_base.simplify(infos,developp,memeDeno)
			# DEBUG : Comment convertir cela juste avec un Monome
			if (@_base instanceof Monome) and (@_base.isSymbol("e"))
				out = new FunctionNumber("exp",@_exposant)
				return out.simplify(infos,developp,memeDeno)
			if (@_base instanceof FunctionNumber) and (@_base._function.alias is "exp")
				@_base._operand = @_base._operand.md @_exposant, false
				return @_base.simplify(infos,developp,memeDeno)
			if @_exposant instanceof SimpleNumber
				output = null
				switch
					when @_exposant.isOne()
						infos?.set("EXPOSANT_UN")
						output = @_base
					when @_exposant.isNul()
						infos?.set("EXPOSANT_ZERO")
						output = new RealNumber(@signe()) # Suppose que 0^0 = 1
					when @_exposant.isReal() and @_exposant.isInteger()
						if @_base instanceof Monome then output = @_base.puissance(@_exposant)
						else if (@_base instanceof SimpleNumber) and @_base.isInteger()
							infos?.set("PUISSANCE")
							output = @_base.puissance(@_exposant,infos)
				if output isnt null
					if @_plus then return output
					return output.opposite()
			@
		am: (operand, minus, infos=null) ->
			op = operand.toClone()
			if (minus) then op.opposite()
			new PlusNumber(@, op)
		# md: (operand, div, infos=null) -> identique au parent
		floatify: (symbols) ->
			base = @_base.floatify(symbols)
			exposant = @_exposant.floatify(symbols)
			base.puissance(exposant)
		isFunctionOf: (symbol) ->
			if typeof symbol is "string" then @_base.isFunctionOf(symbol) or @_exposant.isFunctionOf(symbol)
			else union_arrays @_base.isFunctionOf(), @_exposant.isFunctionOf()
		degre: (variable) -> if @isFunctionOf(variable) then Infinity else 0
		toClone: -> PowerNumber.make(@_base, @_exposant).setPlus(@_plus)
		_childAssignValueToSymbol: (liste) ->
			@_base = @_base._childAssignValueToSymbol(liste)
			@_exposant = @_exposant._childAssignValueToSymbol(liste)
			@
		developp: (infos=null) ->
			@_base = @_base.developp(infos)
			@_exposant = @_exposant.developp(infos)
			if @_exposant.isNul()
				infos?.set("EXPOSANT_ZERO")
				return new RealNumber(@signe())
			if (@_exposant.isInteger()) and (@_exposant.isReal())
				infos?.set("EXPOSANT_DEVELOPP")
				output = @_base.puissance(@_exposant).developp(infos)
				if @_plus then return output
				return output.opposite()
			@
		# signature: () -> identique au parent
		# extractFactor: () -> identique au parent
		getPolynomeFactors: (variable) ->
			exp = @_exposant.simplify()
			switch
				when not(exp instanceof RealNumber) then null
				when not(exp.isInteger() and exp.isPositive()) then null
				when @_base.isFunctionOf(variable)
					output = { base:@_base.getPolynomeFactors(variable), power:exp.float() }
					if @_plus then output
					else @_plus { mult:[-1, output] }
				else @
		replace: (replacement,needle) ->
			base = @_base.replace(replacement,needle)
			exposant = @_exposant.replace(replacement,needle)
			new PowerNumber(base,exposant)
	class Monome extends NumberObject
		coeff: null		# Toujours un SimpleNumber
		symbols: null	# Une table d'objet {clé = string nom de la variable : valeur = number, toujours un entier relatif}
		_order:true		# Lors des affichages, les symbols sont donnés dans l'ordre / Pas encore géré
		constructor: (coeff, symbols) ->
			# Formats possible pour symbols :
			# "x^2*y"
			# [{name:"x", power:2}, {name:"y", power:1}]
			# { name:"x", power:2 }
			if coeff instanceof SimpleNumber then @coeff=coeff
			else @coeff = new RealNumber coeff
			@symbols = {}
			switch
				when typeof symbols is "string"
					#C'est le nom d'une variable ou d'un bloc comme "x^2*y"
					symbolsList = symbols.split("*")
					for symbolItem in symbolsList
						[name,power] = symbolItem.split("^")
						power = Number power
						if Number.isNaN(power) then power=1
						@pushSymbol name,power
				when isArray(symbols)
					@pushSymbol symbolItem.name,symbolItem.power for symbolItem in symbols
				when (typeof symbols is "object") and (symbols isnt null) then @pushSymbol symbols.name, symbols.power
		pushSymbol:(name,power,cleanZero=false,infos=null)->
			if @symbols[name]?
				if infos isnt null then infos?.set("MULT_SYMBOLE")
				@symbols[name]+=power
			else @symbols[name] = power
			if cleanZero and (@symbols[name] is 0) then delete @symbols[name]
			@
		hasSymbols: -> Object.keys(@symbols).length>0
		isSymbol: (name) -> (@symbols[name]? is 1) and (Object.keys(@symbols).length is 1) and (@coeff.isOne()) # Vérifie si ce monome est 1.symbol^1 (surtout pour e)
		# Fonctions de NumberObject
		setPlus: (plus) ->
			@coeff.setPlus(plus)
			@
		compositeString: (options) ->
			coeffDone = false
			numArray = []
			if options.negPowerDown then denArray = []
			if not @hasSymbols() then return @coeff.compositeString options
			multObj = false
			keys = Object.keys(@symbols).sort()
			if not @_order then keys.reverse()
			for key in keys
				power = @symbols[key]
				switch
					when options.tex and (key in grecques) then name = "\\#{key}"
					when key is "pi" then name = "π"
					when key is "modulo" then name=MODULO_LETTER
					else name = key
				multObj=true
				switch
					when power is 1
						multObj = false
						numArray.push name
					when options.tex and options.negPowerDown and power is -1
						denArray.push "#{name}"
					when options.tex and options.negPowerDown and power<0
						denArray.push "#{name}^{#{-power}}"
					when options.tex
						numArray.push "#{name}^{#{power}}"
					when power >=0 then numArray.push "#{name}^#{power}"
					when power is -1 and options.negPowerDown
						denArray.push "#{name}"
					when options.negPowerDown
						denArray.push "#{name}^#{-power}"
					else numArray.push "#{name}^(#{power})"
			if (keys.length>1) then multObj=true
			if (@coeff instanceof RationalNumber) and (options.floatNumber isnt true) and ((options.symbolsUp) or (options.negPowerDown))
				coeffDone = true
				if not @coeff.isOne() then multObj = true
				coeffNum = @coeff.numerator.compositeString options
				coeffPositif = coeffNum[1]
				coeffDen = @coeff.denominator.compositeString options
				if coeffNum[0] isnt "1"
					numArray.unshift coeffNum[0]
				if coeffDen[0] isnt "1"
					if denArray? then denArray.unshift coeffDen[0]
					else denArray = [ coeffDen[0] ]
			if options.tex
				numString=numArray.join(" ")
				if denArray? and denArray.length>0 then denString = denArray.join(" ")
				else denString = null
			else
				numString = numArray.join("*")
				if denArray? and denArray.length>0
					if denArray.length is 1 then denString = denArray.pop()
					else denString = "("+denArray.join("*")+")"
				else denString = null
			if numString is "" then numString = "1"
			if denString is null then outString = numString
			else
				if options.tex then outString = "\\frac{#{numString}}{#{denString}}"
				else outString = "#{numString}/#{denString}"
			if coeffDone is false
				csCoeff = @coeff.compositeString options
				if outString is "1" then return csCoeff
				coeffPositif = csCoeff[1]
				if csCoeff[0] isnt "1"
					multObj=true
					if csCoeff[2]
						if options.tex then outString = "\\left(#{csCoeff[0]}\\right)#{outString}"
						else "(#{csCoeff[0]})*#{outString}"
					else
						if options.tex then outString = csCoeff[0]+outString
						else outString = csCoeff[0]+"*"+outString
			[outString,coeffPositif,false,multObj]
		simplify: (infos=null) ->
			for key,power of @symbols
				if power is 0
					delete @symbols[key]
					infos?.set("EXPOSANT_ZERO")
			@coeff = @coeff.simplify(infos)
			if @coeff.isNul() or @coeff.isNaN() or (Object.keys(@symbols).length is 0) then return @coeff
			@
		am: (operand, minus, infos=null) ->
			if (operand instanceof Monome) and (operand.signature() is @signature())
				infos?.set("ADD_REGROUPEMENT")
				@coeff = @coeff.am(operand.coeff,minus)
				return @
			super(operand,minus,infos)
		opposite: () ->
			@coeff.opposite()
			@
		md: (operand, div, infos=null) ->
			switch
				when operand instanceof Monome
					@coeff = @coeff.md(operand.coeff,div,infos)
					if div
						@pushSymbol(key,-power,true,infos) for key,power of operand.symbols
					else
						@pushSymbol(key,power,true,infos) for key,power of operand.symbols
					if Object.keys(@symbols).length is 0 then return @coeff
					return @
				when operand instanceof SimpleNumber
					@coeff = @coeff.md(operand,div,infos)
					return @
			super(operand, div, infos)
		inverse: () ->
			@symbols[key] = -power for key, power of @symbols
			@coeff = @coeff.inverse()
			@
		puissance: (exposant) ->
			# Utilisé dans la simplification de power mais n'est qu'une réécriture
			if exposant instanceof NumberObject then exposant = exposant.floatify().float()
			if not(isInteger(exposant)) then return new RealNumber()
			if exposant is 0 then return new RealNumber(1)
			@symbols[key] *= exposant for key,power of @symbols
			@coeff = @coeff.puissance(exposant)
			@
		floatify: (symbols) ->
			out = @coeff.floatify(symbols)
			out = out.md( SymbolManager.getSymbolValue(key,symbols).floatify().puissance(power), false) for key,power of @symbols when power isnt 0
			out
		isFunctionOf: (symbol) ->
			if typeof symbol is "string"
				if (symbol is "e") or (symbol is "pi") or (symbol is "i") then false
				else (typeof @symbols[symbol] is "number") and (@symbols[symbol] isnt 0)
			else ( key for key, power of @symbols when (power isnt 0) and (key isnt "i") and (key isnt "pi") and (key isnt "e") )
		degre: (variable) -> @symbols[symbol] ? 0
		toClone: () ->
			cl = new Monome @coeff.toClone()
			cl.pushSymbol(key,power) for key,power of @symbols
			cl
		isNul: () -> @coeff.isNul()
		isOne: (factor) -> not(@hasSymbols()) and @coeff.isOne(factor)
		_childAssignValueToSymbol: (liste) ->
			for key,value of liste
				if @symbols[key]?
					if @symbols[key] isnt 1 then value = PowerNumber.make(value.toClone(), @_exposant)
					delete @symbols[key]
					switch
						when not @hasSymbols() then return value.md(@coeff,false)
						when value instanceof SimpleNumber
							@coeff = @coeff.md(value,false)
							return @
						when value instanceof Monome then return @md(value,false)
						else return MultiplyNumber.makeMult(value,@)
			@
		# developp: (infos=null) -> identique au parent
		signature: ->
			keys = Object.keys(@symbols).sort()
			s = ""
			s+= key+@symbols[key] for key in keys when (@symbols[key] isnt 0)
			if s is "" then return "1"
			s
		extractFactor: () ->
			coeff = @coeff
			@coeff = new RealNumber(1)
			coeff
		getPolynomeFactors: (variable) ->
			cl = @
			power = 0
			if @symbols[variable]?
				cl = @toClone()
				power = @symbols[variable]
				delete cl.symbols[variable]
			if not cl.hasSymbols() then cl = cl.coeff
			if power is 0 then cl
			else { monome:power, factor:cl }
		derivate: (variable) ->
			if @symbols[variable]? and (@symbols[variable] isnt 0)
				out = @toClone()
				power = @symbols[variable]
				out.coeff = out.coeff.md(new RealNumber(power),false)
				if power is 1 then return out.coeff
				out.symbols[variable] = power-1
				return out
			new RealNumber 0
		extractModulo: (variable) ->
			if @symbols[variable]?
				if @symbols[variable] isnt 1 then return { error:true }
				cl = @toClone()
				delete cl.symbols[variable]
				if not cl.hasSymbols() then cl=cl.coeff
				return {base:new RealNumber(0),error:false,modulo:cl}
			{ base:@, error:false}
		order: (normal=true) ->
			@_order = normal
			@
		replace: (replacement,needle) ->
			if @symbols[needle]?
				x = replacement.toClone()
				if @symbols[needle] isnt 1 then x = new PowerNumber(x,new RealNumber(@symbols[needle]))
				y = @toClone()
				delete y.symbols[needle]
				switch
					when y.isOne() then x
					when y.isOne(-1) then x.opposite()
					else x.md(y,false)
			else @toClone()
		getNumDen: () ->
			numSymbs = []
			denSymbs = []
			for key, value of @symbols
				if value>=0 then numSymbs.push { name:key, power:value }
				else denSymbs.push { name:key, power:-value }
			[ new Monome(@coeff, numSymbs), new Monome(1,denSymbs) ]
	class FunctionNumber extends NumberObject
		@functions: {
			inconnue: {
				tex: "\\text{fonction inconnue}"
				alias: "inconnue"
				needBraces: false
				powerNearName: false
				calc: (x) -> NaN
			}
			sqrt: {
				tex: "\\sqrt"
				alias: "sqrt"
				needBraces: true
				powerNearName: false
				calc: (x) -> Math.sqrt x
			}
			racine: { alias: "sqrt" }
			cos: {
				tex:"\\cos"
				alias: "cos"
				needBraces: false
				powerNearName: true
				calc: (x) -> Math.cos x
			}
			sin: {
				tex:"\\sin"
				alias: "sin"
				needBraces: false
				powerNearName: true
				calc: (x) -> Math.sin x
			}
			ln: {
				tex:"\\ln"
				alias: "ln"
				needBraces: false
				powerNearName: true
				calc: (x) -> Math.log x
			}
			exp: {
				tex:"e^"
				alt:{ needBraces:false, tex:"\\exp", powerNearName: true }
				alias: "exp"
				needBraces: true
				powerNearName: false
				calc: (x) -> Math.exp x
			}
		}
		constructor: (functionName, @_operand) ->
			# Le constructor n'est jamais appelé directement, seulement via make
			# Il n'est donc pas nécessaire de vérifier
			# @_function est un objet avec tout ce qu'il faut dedans
			@_function = FunctionNumber.functions[functionName]
		@make: (functionName,operand) ->
			if typeof operand is "number" then operand = new RealNumber(operand)
			if typeof FunctionNumber.functions[functionName] isnt "undefined"
				alias = FunctionNumber.functions[functionName].alias
				if alias is "sqrt" and (operand instanceof RealNumber) and operand.isInteger()
					return (new RadicalNumber()).insertFactor(operand._value, new RealNumber(1),false)
			return new FunctionNumber(functionName,operand)
		@exists: (functionName) -> typeof FunctionNumber.functions[functionName] isnt "undefined"
		@cos: (operand) -> @make("cos",operand)
		@sin: (operand) -> @make("sin",operand)
		@sqrt: (operand) -> @make("sqrt",operand)
		compositeString: (options,power) ->
			if options.tex
				opCS = @_operand.compositeString options
				if opCS[1] then opTex = opCS[0] else opTex = "-#{opCS[0]}"
				if isArray(options.altFunctionTex) and (@_function.alt?) and (@_function.alias in options.altFunctionTex) then f_tex = @_function.alt
				else f_tex = @_function
				switch
					when power? and @_plus and f_tex.powerNearName
						fct_name = "#{f_tex.tex}^{#{power}}"
						power = null
					when power? and not @_plus then fct_name = "-#{f_tex.tex}"
					else fct_name = f_tex.tex
				if f_tex.needBraces is true then tex = "#{fct_name}{#{opTex}}"
				else tex = "#{fct_name}\\left(#{opTex}\\right)"
				if power? then tex = "\\left(#{tex}\\right)^{#{power}}"
				[tex, @_plus or power?, false, false]
			else
				if power?
					if @_plus then ["(#{@_function.alias}(#{@_operand}))^#{power}", true, false, false]
					else ["(-#{@_function.alias}(#{@_operand}))^#{power}", true, false, false]
				else ["#{@_function.alias}(#{@_operand})", @_plus, false, false]
		simplify: (infos=null, developp=false,memeDeno=false) ->
			# Debug : À améliorer
			@_operand = @_operand.simplify(infos,developp,memeDeno)
			if (@_function.alias is "sqrt")
				# Debug : Mettre le fonction sqrt pour tous
				if (@_operand instanceof RationalNumber) or (@_operand instanceof RealNumber)
					sqrt = @_operand.sqrt(infos)
					if not @_plus then sqrt.opposite()
					return sqrt
			if (@_function.alias is "exp")
				if @_operand.isNul() then return new RealNumber(1)
				if @_operand.isOne() then return SymbolManager.makeSymbol("e")
			if (@_function.alias is "ln")
				if @_operand.isOne() then return new RealNumber(0)
				if @_operand.isNegative() or @_operand.isNul() then return new RealNumber()
			@
		# am: (operand, minus, infos=null) -> identique au parent
		md: (operand, div, infos=null) ->
			if (@_function.alias is "sqrt") and (operand instanceof FunctionNumber) and (operand._functionName is "sqrt")
				@_operand = @_operand.md(operand._operand, div, infos)
				return @simplify(infos)
			super(operand, div, infos)
		# opposite: () -> identique au parent
		floatify: (symbols) ->
			x = @_operand.floatify(symbols).float()
			y = @_function.calc?(x)
			new RealNumber y
		isFunctionOf: (symbol) -> @_operand.isFunctionOf(symbol)
		degre: (variable) -> if @isFunctionOf(variable) then Infinity else 0
		toClone: () -> (new FunctionNumber(@_function.alias, @_operand.toClone() )).setPlus(@_plus)
		_childAssignValueToSymbol: (liste) ->
			@_operand = @_operand._childAssignValueToSymbol(liste)
			@
		getOperand: -> @_operand
		getFunction: -> @_function.alias
		# developp: (infos=null) -> identique au parent
		signature: -> @order().compositeString({tex:false, floatNumber:true})[0]
		# L'option floatNumber fait qu'un simple number est évalué.
		# L'intérêt est d'éviter d'avoir plusieurs écriture équivalentes comme 2/5 et 0,4
		# extractFactor: -> identique au parent
		getPolynomeFactors: (variable) ->
			if @_operand.isFunctionOf(variable) then null
			else @
		derivate: (variable) ->
			if not @_operand.isFunctionOf(variable) then return new RealNumber 0
			op = @_operand.derivate variable
			if not @_plus then op.opposite()
			switch @_function.alias
				when "cos" then return op.opposite().md(FunctionNumber.sin(@_operand.toClone()),false).simplify()
				when "sin" then return op.md(FunctionNumber.cos(@_operand.toClone()),false).simplify()
				when "sqrt" then return op.md(new RealNumber(2).md(FunctionNumber.sqrt(@_operand.toClone()) ),true).simplify()
				when "ln" then return op.md(@_operand.toClone(),true).simplify()
				when "exp" then return op.md(@toClone(),false).simplify()
			new RealNumber()
		facto: (regex) ->
			if @toString().match(regex) isnt null then [new RealNumber(1), @toClone()]
			else null
		replace: (replacement,needle) ->
			(new FunctionNumber(@_function.alias, @_operand.replace(replacement,needle) )).setPlus(@_plus)
	#----------Nombres simples-------
	# Les simples ne contiennent pas de fonction ou de symboles
	class SimpleNumber extends NumberObject
		am: (operand, minus, infos=null) ->
			if operand instanceof SimpleNumber then return @amSimple(operand, minus, infos)
			super(operand, minus, infos)
		md: (operand, divide, infos=null) ->
			if operand instanceof SimpleNumber then return @mdSimple(operand, divide, infos)
			if (operand instanceof Monome) then return @toMonome().md(operand,divide,infos)
			super(operand, divide, infos)
		#isFunctionOf: (symbol) -> false Identique au parent
		isFloat: -> false
			# Les valeurs sont données sous forme de décimaux et on ne reste alors pas en valeur exacte.
		isInteger: -> false
		isReal: -> true
		isImag: -> false
		getReal: -> @
		getImag: -> new RealNumber(0)
		# méthodes spécifiques de la classe
		applyNumericFunction: (name) ->
			if not FunctionNumber.exists(name) then new RealNumber()
			else FunctionNumber.make(name,@)
		addSimple: (operand, infos=null) -> @amSimple(operand, false, infos)
		minusSimple: (operand, infos=null) -> @amSimple(operand, true, infos)
		amSimple: (operand, minus, infos=null) -> new RealNumber()
		multiplySimple: (operand, infos=null) -> @mdSimple(operand, false, infos)
		divideSimple: (operand, infos=null) -> @mdSimple(operand, true, infos)
		mdSimple: (operand, divide, infos=null) -> new RealNumber()
		isOne: (fact = 1) -> false
		sqrt: (infos=null) -> new RealNumber()
		modulecarreToNumber: () -> @floatify().modulecarreToNumber()
		# developp: (infos=null) -> identique au parent
		signature: -> "1"
		# extractFactor: () -> identique au parent
		getPolynomeFactors: (variable) -> @
		toMonome: -> new Monome(@)
		derivate: -> new RealNumber 0
		intPower: (exposant) ->

	class InftyNumber extends SimpleNumber
		constructor: (plus) ->
			if arguments.length is 1 then @_plus = (arguments[0] is true)
		compositeString: (options) ->
			if options.tex then return ["\\infty", @_plus, false, false]
			["∞", @_plus, false, false]
		simplify: (infos=null) -> @
		# opposite: () -> identique à NumberObject
		inverse: () -> new RealNumber(0)
		floatify: () -> if @_plus then new RealNumber(Number.Infinity) else new RealNumber(Number.NEGATIVE_INFINITY)
		toClone: () -> new InftyNumber(@_plus)
		isNul: () -> false
		isPositive: (orNul = true) -> @_plus
		isNegative: (orNul = true) -> not @_plus
		isNaN: () -> true
		amSimple: (operand, minus, infos=null) ->
			switch
				when operand instanceof InftyNumber
					if minus isnt (@_plus isnt operand._plus) then return new RealNumber() # +Infini - Infini = indéterminé
					else return @
				when (operand instanceof RadicalNumber) or (operand instanceof ComplexeNumber)
					if minus then operand = operand.toClone().opposite()
					return operand.amSimple(@, false, infos)
				when operand.isNaN() then return new RealNumber();
			@
		mdSimple: (operand, divide, infos=null) ->
			if operand.isNul()
				if divide then return new RealNumber() # Infini/0 : problème de signe
				else
					infos?.set("MULT_SIMPLE")
					return new RealNumber(0); # On décide que 0*inifini = 0
			if divide and (operand instanceof InftyNumber) then return new RealNumber() # Infini / infini = indéterminé
			# Pour un nombre complexe, il faut simplement laisser la classe
			# ComplexeNumber faire l'ajout sur la partie réelle
			if (operand instanceof RadicalNumber) or (operand instanceof ComplexeNumber)
				if divide then return operand.toClone().inverse().mdSimple(@,false,infos)
				else return operand.toClone().mdSimple(@,false,infos)
			# Pour n'importe quel autre nombre, multiplier  +-infini à un reel ne peut que changer le signe
			# On ne change pas le flag MULT_SIMPLE si c'est une mulitplication par 1
			if (infos isnt null) and not( (operand instanceof RealNumber) or (operand.isOne()) ) then infos?.set("MULT_SIMPLE")
			@_plus = (@_plus is operand.isPositive())
			@
		isOne: (fact = 1) -> false
		sqrt: (infos=null) ->
			if (@_plus) then return @
			new RealNumber()
		isInteger: () -> false
		isFloat: () -> false
		isReal: () -> true
		getReal: () -> @
		getImag: () -> new RealNumber(0)
		# conjugue: () -> identique à NumberObject
		compare:(b,symbols)->
			if b instanceof InftyNumber and @_plus is b._plus then return 0
			return super(b,symbols)
	class RationalNumber extends SimpleNumber
		constructor: (numerator, denominator) ->
			if numerator instanceof RealNumber then @numerator = numerator
			else @numerator = new RealNumber(numerator)
			if typeof denominator is "undefined" then @denominator = new RealNumber(1)
			else
				if denominator instanceof RealNumber then @denominator = denominator
				else @denominator = new RealNumber(denominator)
			if @denominator.isNaN() or @denominator.isNul()
				@numerator = new RealNumber()
				@denominator = new RealNumber(1)
			else if @denominator.isNegative()
				@denominator.opposite()
				@numerator.opposite()
		compositeString: (options) ->
			if options.floatNumber is true
				_num = @numerator.float()
				_den = @denominator.float()
				return [ String(Math.abs(_num)/_den), _num>=0, false, false]
			num = @numerator.compositeString options
			den = @denominator.compositeString options
			if den[0] is "1" then return num
			if options.tex then out = ["\\frac{#{num[0]}}{#{den[0]}}", num[1], false, true]
			else out = ["#{num[0]}/#{den[0]}", num[1], false, true]
			out
		simplify: (infos=null) ->
			if @isNaN() then return new RealNumber()
			if @isNul() then return new RealNumber(0)
			if @isFloat()
				infos?.set("APPROX")
				return @floatify()
			@reduction(infos)
			if @denominator.isOne() then return @numerator
			@
		opposite: () ->
			@numerator.opposite()
			@
		inverse: () ->
			if @isNaN() or @isNul() then return new RealNumber()
			temp = @denominator
			@denominator = @numerator
			@numerator = temp
			if @denominator.isNegative()
				@numerator
				@denominator
			@
		floatify: -> new RealNumber @numerator.float()/@denominator.float()
		isNul: () -> @numerator.isNul()
		isPositive: () -> @numerator.isPositive()
		isNegative: () -> @numerator.isNegative()
		signe: () -> @numerator.signe()
		isNaN: () -> @numerator.isNaN()
		amSimple: (operand, minus, infos=null) ->
			op = operand.toClone()
			if minus then op.opposite()
			if op instanceof RealNumber
				@numerator = @numerator.amSimple(op.mdSimple(@denominator, false), false)
				infos?.set("ADD_SIMPLE")
				return @
			if op instanceof RationalNumber
				new_denominator = @denominator.toClone().mdSimple(operand.denominator,false)
				new_numerator = @numerator.mdSimple(operand.denominator,false).amSimple(op.numerator.mdSimple(@denominator,false), false)
				@numerator = new_numerator
				@denominator = new_denominator;
				infos?.set("ADD_SIMPLE")
				return @
			# Sinon on passe au niveau supérieur
			op.amSimple(@, false, infos)
		mdSimple: (operand, divide, infos=null) ->
			if @isNaN() or operand.isNaN() then return new RealNumber()
			if divide and operand.isNul() then return new RealNumber()
			if operand instanceof RealNumber
				if divide
					@denominator = @denominator.mdSimple(operand,false,infos)
					if @denominator.isNegative()
						@numerator.opposite()
						@denominator.opposite()
				else @numerator = @numerator.mdSimple(operand, false, infos)
				return @
			else if operand instanceof RationalNumber
				if divide
					@numerator = @numerator.mdSimple(operand.denominator, false, infos)
					@denominator = @denominator.mdSimple(operand.numerator, false, infos)
					if @denominator.isNegative()
						@numerator.opposite()
						@denominator.opposite()
				else
					@numerator = @numerator.mdSimple(operand.numerator, false, infos)
					@denominator = @denominator.mdSimple(operand.denominator, false, infos)
				return @
			if divide then return operand.toClone().inverse().mdSimple(@, false, infos)
			operand.toClone().mdSimple(@, false, infos)
		isOne: (fact = 1) -> @numerator.float() is fact * @denominator.float()
		sqrt: (infos=null) -> @numerator.sqrt(infos).mdSimple(@denominator.sqrt(infos),true,infos).simplify(infos)
		isInteger: (strict=false) -> (not strict) and @numerator.isInteger() and @denominator.isOne()
		isFloat: () -> @numerator.isFloat() or @denominator.isFloat()
		# isReal: () -> identique au parent
		# conjugue: () -> identique au parent
		# getReal: () -> identique au parent
		# getImag: () -> identique au parent
		toClone: () -> new RationalNumber(@numerator.toClone(), @denominator.toClone())
		#-------- Fonction spécifique --------------
		isSimpleWidthI: ->
			# On peut le multiplier par i sans qu'on considère qu'il y a modif
			true
		testReduction: () -> @numerator.pgcd(@denominator) isnt 1
		reduction: (infos=null) ->
			pgcd = @numerator.pgcd(@denominator)
			if pgcd > 1
				infos?.set("RATIO_REDUCTION")
				@numerator.intDivision(pgcd)
				@denominator.intDivision(pgcd)
			return @
	class RadicalNumber extends SimpleNumber
		# Debug : erreur lors de l'inversion d'un nombre comme 1+sqrt(3)+sqrt(2) mais pas avec 2+sqrt(3)+sqrt(2)
		constructor: () ->
			@factors=[] # contient des objets {base : un_entier, value : un réel ou fraction ou infty}
			@_basesSimplified = false # indique si les racines sont simplifiées et regroupées
		compositeString: (options) ->
			if @isNul() then return ['0', true, false, false]
			if options.floatNumber is true
				_x = @floatify().float()
				return [String(_x), _x>=0, false,false]
			@order()
			strs = []
			for factor in @factors
				base = factor.base
				if base<0
					cs = factor.value.compositeString(options,"i")
					base=-base
				else cs = factor.value.compositeString(options)
				if cs[0] is "1" and (factor.base isnt 1) then cs[0] = ""
				if base isnt 1
					if options.tex then cs[0] = "#{cs[0]}\\sqrt{#{base}}"
					else cs[0] = "#{cs[0]}sqrt(#{base})"
				if cs[1] then strs.push("+")
				else strs.push("-")
				strs.push(cs[0])
			n = strs.length
			[strs[1..n-1].join(""), strs[0] is "+", strs.length>2, false]
		simplify: (infos=null) ->
			#infos?.setContext("IN_RADICAL")
			for factor, i in @factors
				@factors[i].value = factor.value.simplify(infos)
			#infos?.clearContext()
			if @isNaN() then return new RealNumber()
			if @isFloat()
				infos?.set("APPROX")
				return @floatify()
			@extractFactors(infos)
			if @isNul() then return new RealNumber(0)
			if (@factors.length is 1) and (@factors[0].base is 1) then return @factors[0].value
			@
		opposite: ->
			factor.value.opposite() for factor in @factors
			@
		inverse: (infos=null) ->
			if @isNul() then return new RealNumber()
			denominator = @toClone()
			numerator = new RealNumber(1)
			# Limitation d'une nombre maximal de boucles
			n_loops = 0
			while (denominator.factors.length>1) and (n_loops<20)
				i=0
				while denominator.factors[i].base is 1
					i++
				conjugue = denominator.toClone().conjugueFactor(i) # Changement de la fonction conjugueFactor
				numerator = numerator.mdSimple(conjugue, false, infos)
				denominator = denominator.mdSimple(conjugue, false, infos)
				n_loops++
			# Il reste un élément dans denominator
			numerator = numerator.mdSimple(denominator, false, infos)
			denominator = denominator.mdSimple(denominator, false, infos).simplify(infos)
			numerator.mdSimple(denominator, true, infos)
		fractionize: (op) ->
			if (op instanceof RealNumber) and not op.isNul()
				tests = []
				for factor in @factors
					test = factor.value.fractionize?(op)
					unless test? then return null
					tests.push test
				factor.value = tests.shift() for factor, i in @factors
				return @
			null
		floatify: ->
			total = new RealNumber(0)
			for factor in @factors
				if factor.base < 0 then total = total.amSimple((new ComplexeNumber(0,Math.sqrt(-factor.base))).mdSimple(factor.value.floatify(), false), false)
				else total = total.amSimple((new RealNumber(Math.sqrt(factor.base))).mdSimple(factor.value.floatify(), false), false)
			total
		toClone: () ->
			clone = new RadicalNumber()
			clone.addFactor(factor.base, factor.value.toClone()) for factor in @factors
			clone
		isNul: () -> @factors.length is 0
		isNaN: () ->
			for factor in @factors
				if factor.value.isNaN() then return true
			false
		# isInteger: () -> Debug : identique au parent
		isFloat: () ->
			for factor in @factors
				if factor.value.isFloat() then return true
			false
		isReal: ->
			for factor in @factors
				if factor.base<0 then return false
			true
		isImag: ->
			for factor in @factors
				if factor.base>0 then return false
			true
		getReal: () ->
			realPart = new RadicalNumber()
			for factor in @factors
				if factor.base>0 then realPart.addFactor(factor.base, factor.value.toClone())
			realPart.simplify()
		getImag: () ->
			imaginaryPart = new RadicalNumber()
			for factor in @factors
				if factor.base<0 then imaginaryPart.addFactor(factor.base, factor.value.toClone())
			imaginaryPart.simplify()
		conjugue: () ->
			for factor in @factors
				if factor.base<0 then factor.value.opposite()
			@
		amSimple: (operand, minus, infos=null) ->
			if operand instanceof RadicalNumber
				@addFactor(factor.base, factor.value.toClone(), minus, infos) for factor in operand.factors
			else @addFactor(1,operand.toClone(),minus, infos)
			@
		mdSimple: (operand, divide, infos=null) ->
			if @isNul() or operand.isNul()
				infos?.set("MULT_SIMPLE")
				return new RealNumber(0)
			if operand instanceof ComplexeNumber then operand = (new RadicalNumber()).insertFactor(1,operand, false)
			if divide then operand = operand.toClone().inverse()
			if operand instanceof RadicalNumber
				total = new RadicalNumber()
				for o_factor in operand.factors
					for t_factor in @factors
						newbase = o_factor.base*t_factor.base
						# On tient compte du fait que sqrt(-1)*sqrt(-1) != -1 * -1
						total.addFactor(newbase, o_factor.value.toClone().mdSimple(t_factor.value, false), (o_factor.base<0) and (t_factor.base<0), infos)
				return total
			# Sinon c'est un élément réel ou ratio ou infty
			for factor in @factors
				factor.value = factor.value.mdSimple(operand, false, infos)
			@
		isOne: (fact = 1) ->
			# Debug : Version très simplifiée
			(@factors.length is 1) and (@factors[0].base is 1) and (@factors[0].value.isOne(fact))
		sqrt: (infos=null) ->
			if @factors.length is 0 then return new RealNumber(0)
			# Cas où le seul facteur est en fait sur un sqrt(1), donc un nombre ordinaire
			if (@factors.length is 1) and (@factors[0].base is 1) and (@factors[0].value.isInteger())
				factor = @factors.pop()
				@addFactor(factor.value(),1)
				return @
			if @isNegative() then return new RealNumber()
			FunctionNumber.make("sqrt",@) # Debug : Vérifier cela
		# Spécifiques de RadicalNumber
		order: () ->
			@factors.sort (a,b) ->
				if a.base<=b.base then 1
				else -1
			@
		isIntegerFactors: (strict=false) ->
			# Test si touts les facteurs sont entiers
			flag = true
			for factor in @factors
				if not factor.value.isInteger(strict) then flag = false
			return flag
		isSimpleSqrt:()->
			# Il s'agit d'une racine avec un coeff unitaire
			if @factors.length isnt 1 then return false
			if @factors[0].base is 1 then return false
			if not (@factors[0].value instanceof RealNumber) then return false
			@factors[0].value.isOne()
		isSimpleWidthI: ->
			# Si c'est juste une fraction avec une racine de base >0, on peut le multiplier par i sans qu'on considère qu'il y a modif
			if @factors.length isnt 1 then return false
			if (@factors[0].base <0) or (@factors[0].base is 1) then return false
			true
		hasBase: (base) ->
			for factor in @factors
				if factor.base is base then return true
			return false
		baseList: ->
			output = []
			output.push(factor.base) for factor in @factors
			output.sort()
			output
		addFactor: (base, factor, minus, infos) ->
			if minus then factor.opposite()
			@insertFactor(base, factor, true, infos)
		extractFactors: (infos=null) ->
			# Debug : à faire
			if not @_basesSimplified
				i=0
				while i<@factors.length
					factor = @factors[i]
					extract = extractSquarePart(factor.base)
					if extract isnt 1
						infos?.set("RACINE")
						factor.base /= extract * extract
						factor.value = factor.value.mdSimple(new RealNumber(extract), false)
					j=0
					j++ while (j<i) and (@factors[j].base isnt factor.base)
					if j<i
						@factors[j].value.amSimple(factor.value,false,infos)
						@factors.splice(i,1)
					else i++
				@_basesSimplified = true
			@
		insertFactor: (base, factor, autoExtract, infos) ->
			# factor : SimpleNumber
			# base : entier
			# autoExtract : booléen
			if autoExtract and not @_basesSimplified then @extractFactors()
			if not (factor instanceof SimpleNumber) then factor = factor.floatify()
			@_floatValue = null
			if base is 0 then return @
			if autoExtract
				extract = extractSquarePart(base)
				if extract isnt 1
					base /= extract * extract
					factor.mdSimple(new RealNumber(extract), false)
					infos?.set("RACINE")
			if factor instanceof RadicalNumber
				if not autoExtract and not factor._basesSimplified then @_basesSimplified = false
				doExtract = autoExtract and not factor._basesSimplified
				if base is 1
					# Dans ce cas, on a une simple addition
					@insertFactor(sous_factor.base, sous_factor.value,doExtract, infos) for sous_factor in factor.factors
					return @
				else if base is -1
					# Dans ce cas, on a une addition avec un *i
					for sous_factor in factor.factors
						if sous_factor.base<0 then @insertFactor(-sous_factor.base, sous_factor.value.opposite(),doExtract, infos)
						else @insertFactor(-sous_factor.base, sous_factor.value,doExtract, infos)
					return @
				else
					infos?.set("APPROX")
					factor = factor.floatify()
			if not autoExtract then @_basesSimplified = false
			ajout_reel = factor.getReal()
			if not ajout_reel.isNul()
				if autoExtract then indice = @indiceOfBase(base)
				else indice = undefined
				if typeof indice is "undefined" then @factors.push({base: base, value:ajout_reel})
				else
					infos?.set("ADD_SIMPLE")
					@factors[indice].value = @factors[indice].value.amSimple(ajout_reel, false)
					if @factors[indice].value.isNul() then @factors.splice(indice,1)
			if not factor.isReal()
				ajout_imaginaire = factor.getImag()
				if (base<0) then ajout_imaginaire.opposite() # Tient compte du fait que i*i = -1
				if autoExtract then indice = @indiceOfBase(-base)
				else indice=undefined
				if typeof indice is "undefined" then @factors.push({base: -base, value:ajout_imaginaire})
				else
					infos?.set("ADD_SIMPLE")
					@factors[indice].value = @factors[indice].value.amSimple(ajout_imaginaire, false)
					if @factors[indice].value.isNul() then @factors.splice(indice,1)
			@
		conjugueFactor: (indice) ->
			if (indice>=0) and (indice<@factors.length) then @factors[indice].value.opposite()
			@
		indiceOfBase: (base) ->
			for factor,i in @factors
				if base is factor.base then return i
			undefined
		floatValue: () ->
			if @_floatValue is null then @_floatValue = @floatify()
			@_floatValue
	#----------Nombres float---------
	class FloatNumber extends SimpleNumber
		_float:false # flag passant à true quand le calcul devient approximatif
		float: (decimals) -> NaN
		approx: (decimals) -> new RealNumber()
	class RealNumber extends FloatNumber
		_value: NaN
		_float: false # flag passant à true quand le calcul devient approximatif
		constructor: (value, fl) ->
			if typeof value is "string"
				token = new TokenNumber(value)
				@_value = token.value
			else if typeof value is "number" then @_value = value
			@_float = not (isInteger(@_value)) or (fl is true)
		# méthodes héritées de Number Object
		setPlus: (plus) ->
			if plus then @_value = Math.abs(@_value)
			else @_value = - Math.abs(@_value)
			@
		signe: () -> if @_value < 0 then -1 else 1
		compositeString: (options,complement="") ->
			if @isNaN() then return ["(?)", true, false, false]
			# En javascript, un Number peut être infini
			multGroup = (complement isnt "")
			if isInfty(@_value)
				if options.tex then return ["\\infty"+complement, @_value > 0, false, multGroup]
				else return ["∞"+complement, @_value > 0, false, multGroup]
			v = Math.abs(@_value)
			if @percent
				if options.tex then str_value = "#{v*100}\\%"
				else str_value = "#{v*100}%"
				if multGroup then str_value += " "+complement
			else
				if multGroup
					if v is 1 then str_value = complement
					else str_value = v+" "+complement
				else str_value = String v
			return [ str_value.replace('.', ","), @_value >= 0, false, multGroup ]
		simplify: (infos=null) ->
			if isInfty(@_value) then return new InftyNumber(@_value > 0)
			@
		opposite: ->
			@_value *= -1
			@
		inverse: ->
			switch
				when @_value is 0
					@_value = NaN
				when isNaN(@_value) then
				when @_float
					@_value = 1/@_value
					return @
				else return new RationalNumber(1, @_value)
			@
		fractionize: (op) ->
			if (op instanceof RealNumber) and not op.isNul() then return new RationalNumber @,op.toClone()
			null
		puissance: (exposant) ->
			switch
				when typeof exposant is "number" then exp = exposant
				when exposant instanceof NumberObject then exp = exposant.floatify().float()
				else exp = NaN
			if (@_value is 0) and (exp<0) then @_value = NaN
			else @_value = Math.pow(@_value, exp)
			if not isInteger(@_value) then @_float = true
			@
		floatify: -> out = @toClone().setFloat()
		approx: (decimals) ->
			unless decimals? then return @floatify()
			new RealNumber(Number(@_value.toFixed(decimals)), true)
		float: (decimals) ->
			unless decimals? then return @_value
			Number(@_value.toFixed(decimals))
		toClone: -> new RealNumber(@_value, @_float)
		isNul: -> @_value is 0
		isPositive: -> @_value > 0
		isNegative: -> @_value < 0
		isNaN: -> isNaN(@_value)
		isInteger: -> isInteger(@_value)
		isFloat: -> @_float
		# isReal: -> true # identique à SimpleNumber
		# getReal: -> @ # identique à SimpleNumber
		# getImag: -> new RealNumber(0) # identique à SimpleNumber
		# conjugue: -> @ # identique à NumberObject
		amSimple: (operand, minus, infos=null) ->
			if @isNaN() then return @
			if operand instanceof RealNumber
				infos?.set("ADD_SIMPLE")
				if minus then @_value -= operand._value
				else @_value += operand._value
				return @
			if minus then return operand.toClone().opposite().amSimple(@, false, infos)
			operand.toClone().amSimple(@, false, infos)
		mdSimple: (operand, divide, infos=null) ->
			if @isNaN() then return @
			if not divide
				if @isOne() then return operand.toClone()
				if @isOne(-1) then return operand.toClone().opposite()
				if @isNul() then return @
			if (operand instanceof RealNumber)
				if (divide)
					if operand.isNul()
						@_value = NaN
						return @
					if @isFloat() or operand.isFloat()
						@_value /= operand._value
						infos?.set("APPROX")
						@setFloat()
						return @
					if @_value % operand._value is 0
						@_value /= operand._value
						infos?.set("DIVISION_EXACTE")
						return @
					return new RationalNumber(@,operand.toClone())
				else
					if (infos isnt null) and (@_value isnt 1) and (operand._value isnt 1)
						infos.set("MULT_SIMPLE")
					@_value *= operand._value
					return @
			if (divide) then return operand.toClone().inverse().mdSimple(@,false,infos)
			operand.toClone().mdSimple(@,false,infos)
		isOne: (fact = 1) -> (@_value == fact)
		sqrt: (infos=null) ->
			if @isNaN() then return @
			if @isFloat()
				infos?.set("APPROX")
				if @isPositive() then @_value = Math.sqrt(@_value)
				else @_value = NaN
				return @
			extract = extractSquarePart(@_value)
			if extract isnt 1 then infos?.set("RACINE")
			rad = @_value / (extract*extract)
			if rad != 1 then return (new RadicalNumber()).addFactor(rad,new RealNumber(extract))
			@_value = extract
			@
		abs: ->
			if @_value<0 then @_value *=-1
			@
		pgcd: (operand) ->
			if not(operand instanceof RealNumber) then return undefined
			if @isFloat() or operand.isFloat() then return 1
			i1 = Math.abs(@_value)
			i2 = Math.abs(operand._value)
			pgcd = 1;
			while (i1 % 2 == 0) and (i2 % 2 == 0)
				i1 /= 2
				i2 /= 2
				pgcd *= 2
			i = 3
			while i<= Math.min(i1, i2)
				while (i1 % i == 0) and (i2 % i == 0)
					i1 /= i
					i2 /= i
					pgcd *= i
				i += 2
			pgcd
		ppcm: (operand) -> @_value * operand._value / @pgcd(operand)
		intDivision: (diviseur) ->
			if typeof diviseur isnt "number" then return @
			plus = ( (@_value>=0) == (diviseur>=0) )
			if plus then signe = 1
			else signe = -1
			diviseur = Math.abs(diviseur)
			@_value = Math.abs(@_value)
			switch
				when diviseur is 0 then @_value = NaN
				when isInteger(diviseur) then @_value = (@_value - @_value % diviseur) / diviseur * signe
				else
					i=0
					while i*diviseur <= @_value
						i++
					@_value = i-1
			@
		# Méthode spécifiques aux éléments float (RealNumber et ComplexeNumber)
		isSimpleWidthI: ->
			# On peut le multiplier par i sans qu'on considère qu'il y a modif
			true
		modulecarreToNumber: -> @_value * @_value
		setFloat: ->
			@_float = true
			@
		setPercent: (percent) ->
			@percent = (percent is true)
			@
		precision: ->
			# indique le nombre de décimales du nombre
			if @_value is 0 then return 0
			p=0
			v = Math.abs(@_value)
			r = Math.floor v
			if (v-r) isnt 0
				# Il y a des chiffres après la virgule
				regex = /// ^([0-9]+)[.,]?([0-9]*)$ ///i
				m = (String v).match regex
				if m then p = - m[2].length
			return p
		string_arrondi: (puissance=0) ->
			resolution = Math.pow(10,puissance)
			val = Math.round(@_value/resolution)*resolution
			if puissance>=0 then return String(val)
			else return val.toFixed(-puissance).replace(".", ",")
	class ComplexeNumber extends SimpleNumber
		constructor: (reel, imaginaire) ->
			@_reel = new RealNumber(0)
			@_imaginaire = new RealNumber(0)
			@setValue(reel,true)
			@setValue(imaginaire,false)
		signe: () ->
			if isReal() then return @_reel.signe()
			else return undefined
		compositeString: (options) ->
			re = @_reel.compositeString options
			im = @_imaginaire.compositeString options
			if im[0] is "0" then return re
			if im[0] is "1" then im[0] = "i"
			else
				im[0] = "#{im[0]}i"
				im[3] = true
			if re[0] is "0" then return im
			if im[1] then re[0] = "#{re[0]}+#{im[0]}"
			else re[0] = "#{re[0]}-#{im[0]}"
			[re[0], re[1], true, false]
		simplify: (infos=null) ->
			@_reel = @_reel.simplify(infos);
			@_imaginaire = @_imaginaire.simplify(infos)
			if @_imaginaire.isNul() then return @_reel
			@
		opposite: () ->
			@_reel.opposite()
			@_imaginaire.opposite()
			@
		inverse: (infos=null) ->
			conjugue = @toClone().conjugue()
			module2 = @toClone().mdSimple(conjugue,false, infos).getReal()
			conjugue.mdSimple(module2,true, infos)
		fractionize: (op) ->
			if (op instanceof RealNumber) and not op.isNul()
				if @_reel.isNul() then testRe = @_reel
				else unless (testRe=@_reel.fractionize?(op))? then return null
				testIm = @_imaginaire.fractionize?(op)
				if testIm?
					@_reel = testRe
					@_imaginaire = testIm
					return @
			null
		floatify: ->
			if @isReal() then return @_reel.floatify()
			new ComplexeNumber(@_reel.floatify(), @_imaginaire.floatify())
		approx: (decimals) -> new ComplexeNumber @_reel.approx(decimals), @_imaginaire.floatify(decimals)
		float: (decimals) ->
			if (@isReal()) then @_reel.float(decimals)
			else NaN
		toClone: () -> new ComplexeNumber(@_reel, @_imaginaire)
		isNul: () -> @_reel.isNul() and @_imaginaire.isNul()
		isPositive: () -> @isReal() and @_reel.isPositive()
		isNegative: () -> @isReal() and @_reel.isNegative()
		isNaN: -> @_reel.isNaN() or @_imaginaire.isNaN()
		isInteger: (strict=false)-> @_reel.isInteger(strict) and @_imaginaire.isInteger(strict)
		isFloat: -> @_reel.isFloat() or @_imaginaire.isFloat()
		isReal: -> @_imaginaire.isNul()
		isImag: -> @_reel.isNul()
		getReal: () -> @_reel
		getImag: () -> @_imaginaire
		conjugue: () ->
			@_imaginaire.opposite()
			@
		amSimple: (operand, minus, infos=null) ->
			if operand instanceof RadicalNumber
				if @isFloat()
					infos?.set("APPROX")
					return @addSimple(operand.floatify(),minus)
				else return (new RadicalNumber()).insertFactor(1,@).amSimple(operand,minus,infos)
			@_reel = @_reel.amSimple(operand.getReal(), minus, infos)
			@_imaginaire = @_imaginaire.amSimple(operand.getImag(), minus, infos)
			@
		mdSimple: (operand, divide, infos=null) ->
			if divide then operand = operand.toClone().inverse()
			# complexe x radical => radical
			if operand instanceof RadicalNumber then return operand.mdSimple(@,false,infos)
			op_r = operand.getReal()
			op_i = operand.getImag()
			re = @_reel.toClone()
			im = @_imaginaire.toClone()
			if operand.isOne() then return @
			infos?.set("MULT_SIMPLE")
			@_reel = @_reel.mdSimple(op_r,false).amSimple(@_imaginaire.mdSimple(op_i,false), true)
			@_imaginaire = re.mdSimple(op_i,false).amSimple(im.mdSimple(op_r,false),false)
			@
		isOne: (fact = 1) -> @isReal() and @_reel.isOne(fact)
		sqrt: (infos=null) ->
			if @isReal() then return @_reel.sqrt(infos)
			new RealNumber()
		modulecarreToNumber: ()-> @_reel.modulecarreToNumber()+@_imaginaire.modulecarreToNumber()
			# Debug : Cette fonction devra être pour tous les simpleNumber
		abs: () -> new RealNumber(Math.sqrt(@modulecarreToNumber()))
		arg: (rad=true) -> Trigo.aCos(@_reel.floatify().float()/Math.sqrt(@modulecarreToNumber()),not @_imaginaire.isNegative(),rad)
		# spécifique
		isPur: ()-> @_reel.isNul() or @_imaginaire.isNul()
		setValue: (value, real) ->
			if (value instanceof NumberObject)
				# L'objet pouvant être un complexe, on s'assure qu'il n'y a qu'une partie réelle
				if not(value instanceof SimpleNumber) then value = value.floatify()
			else value = new RealNumber(value)
			notReal = not value.isReal()
			if real
				@_reel = @_reel.addSimple(value.getReal())
				if notReal then @_imaginaire = @_imaginaire.addSimple(value.getImag())
			else
				@_imaginaire = @_imaginaire.addSimple(value.getReal())
				if notReal then @_reel = @_reel.addSimple(value.getImag().opposite())
			@
		isI: -> (@_reel instanceof RealNumber) and @_reel.isNul() and (@_imaginaire instanceof RealNumber) and @_imaginaire.isOne()
		onlyRealFacts: -> @_reel.onlyRealFacts?() and @_imaginaire.onlyRealFacts?()


