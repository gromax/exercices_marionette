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
    fixDecimals: (decimals) ->
      op.value.fixDecimals(decimals) for op in @factors
      @
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
          extract = misc.extractSquarePart(factor.base)
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
        extract = misc.extractSquarePart(base)
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
