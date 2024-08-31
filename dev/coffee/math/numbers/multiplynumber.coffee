  class MultiplyNumber extends NumberObject
    constructor: ->
      @_signature = null
      @numerator = []
      @denominator = []
      for operand in arguments
        if operand instanceof NumberObject then @numerator.push(operand)
      @_absorbSousMults(true)
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
      (new MultiplyNumber)._pushNumerator(ops...)
    @makeDiv: (op1,op2) ->
      # Utile pour l'utilisation depuis les tokens afin de créer l'objet adequat
      if (fractionized = op1.fractionize?(op2))? then return fractionized
      return (new MultiplyNumber())._pushNumerator(op1)._pushDenominator(op2)
    compositeString: (options) ->
      num = @_compositeString_special(@numerator, options)
      if @denominator.length is 0 then return num
      den = @_compositeString_special(@denominator, options)
      if options.tex          # format tex
        if num[2] and not num[1]  # groupe additif et signe -
          num[0] = "-"+num[0]   # Dans ce cas on ajoute le - devant le premier élément
          num[1] = true
        if den[2] and not den[1]  # Même chose pour le dénominateur
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
    fixDecimals: (decimals) ->
      op.fixDecimals(decimals) for op in @numerator
      op.fixDecimals(decimals) for op in @denominator
      @
    simplify: (infos=null,developp=false, memeDeno=false) ->
      @_signature = null
      for operand, i in @numerator
        if developp then operand = operand.developp(infos)
        @numerator[i] = operand.simplify(infos,developp,memeDeno)
      for operand, i in @denominator
        if developp then operand = operand.developp(infos)
        @denominator[i] = operand.simplify(infos,developp,memeDeno)
      @_absorbSousMults(true)
      @_absorbSousMults(false)
      @_contractNumbersAndSymbols(infos)
      if developp then @_developp_special(true,infos,true,memeDeno)
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
      if (operand instanceof SimpleNumber) or (operand instanceof Monome) then @_contractNumbersAndSymbols(infos)
      @
    inverse: ->
      @_signature = null
      temp = @numerator
      @numerator = @denominator
      @denominator = temp
      @_contractNumbersAndSymbols()
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
        clone._pushNumerator(operand.toClone())
      for operand in @denominator
        clone._pushDenominator(operand.toClone())
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
      @_developp_special(true,infos,false,false)
      if @denominator.length isnt 0 then @_developp_special(false,infos,false,false)
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
        clone._pushNumerator(operand.replace(replacement,needle))
      for operand in @denominator
        clone._pushDenominator(operand.replace(replacement,needle))
      clone
    getNumDen: -> [ new MultiplyNumber(@numerator...), new MultiplyNumber(@denominator...) ]

    # méthodes spécifiques
    _pushNumerator: ->
      @_signature = null
      for operand in arguments
        if operand instanceof NumberObject then @numerator.push(operand)
      @
    _pushDenominator: ->
      @_signature = null
      for operand in arguments
        if operand instanceof NumberObject then @denominator.push(operand)
      @_absorbSousMults(false)
      @
    _absorbSousMults: (up, widthInverse = true) ->
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
    _contractNumbersAndSymbols : (infos=null) ->
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
    _developp_special: (up, infos,simplify,memeDeno) ->
      # up indique si on développe en haut ou en bas
      # Pour développer il faut au moins un plus, on commence par le chercher
      operPlus = null
      if up then operands = @numerator else operands = @denominator
      for operand,i in operands
        operands[i] = operand.developp(infos)
      @_absorbSousMults(up) # pourrait être requis par le développement d'une puissance
      i=0
      while (i<operands.length) and (operPlus is null)
        if (operands[i] instanceof PlusNumber) then operPlus = operands[i]
        else i++
      if operPlus isnt null
        while operand = operands.shift()
          if operand isnt operPlus
            operPlus._developpingMult(operand)
            infos?.set("DISTRIBUTION")
            actionDone = true;
        # si simplify est true, on repasse un coup de simplify sur operPlus
        if simplify then operPlus = operPlus.simplify(infos,false,memeDeno)
        operands.push(operPlus)
      @
    _compositeString_special: (operands, options) ->
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
