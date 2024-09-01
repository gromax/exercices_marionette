  class RealNumber extends FloatNumber
    _value: NaN
    _float: false # flag passant à true quand le calcul devient approximatif
    constructor: (value, fl) ->
      if typeof value is "string"
        token = new TokenNumber(value)
        @_value = token.value
      else if typeof value is "number" then @_value = value
      @_float = not (misc.isInteger(@_value)) or (fl is true)
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
      if misc.isInfty(@_value)
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
    fixDecimals: (decimals) ->
      if not isNaN(@_value) then @_value = Number(@_value.toFixed(decimals))
      @
    simplify: (infos=null) ->
      if misc.isInfty(@_value) then return new InftyNumber(@_value > 0)
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
      if not misc.isInteger(@_value) then @_float = true
      @
    floatify: -> @toClone().setFloat()
    approx: (decimals) ->
      unless decimals? then return @floatify()
      new RealNumber(Number(@_value.toFixed(decimals)), true)
    float: (decimals) ->
      unless decimals? then return @_value
      Number(@_value.toFixed(decimals))
    toClone: -> new RealNumber(@_value, @_float)
    isNul: -> @_value is 0
    isPositive: -> @_value > 0
    isDecimal: -> true
    isNegative: -> @_value < 0
    isNaN: -> isNaN(@_value)
    isInteger: -> misc.isInteger(@_value)
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
      extract = misc.extractSquarePart(@_value)
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
        when misc.isInteger(diviseur) then @_value = (@_value - @_value % diviseur) / diviseur * signe
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

  NumberObject.makeReal = (value) -> new RealNumber(value)
