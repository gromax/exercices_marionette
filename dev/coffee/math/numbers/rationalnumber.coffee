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
    compositeString: (options, complement=false) ->
      if options.floatNumber is true
        _num = @numerator.float()
        _den = @denominator.float()
        if complement
          return [ String(Math.abs(_num)/_den)+" "+complement, _num>=0, false, true]
        else
          return [ String(Math.abs(_num)/_den)+" "+complement, _num>=0, false, true]
      num = @numerator.compositeString options
      den = @denominator.compositeString options
      if den[0] is "1" then out = num
      else
        if options.tex then out = ["\\frac{#{num[0]}}{#{den[0]}}", num[1], false, true]
        else out = ["#{num[0]}/#{den[0]}", num[1], false, true]
      if complement
        out[0] = out[0]+" "+complement
        out[3] = true
      out
    fixDecimals: (decimals) ->
      @numerator.fixDecimals(decimals)
      @denominator.fixDecimals(decimals)
      @
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
    isDecimal: () ->
      d = @denominator._value
      while d % 5 == 0
          d = d/5
      while d % 2 == 0
          d = d/2
      d == 1
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
