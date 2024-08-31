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
    fixDecimals: (decimals) ->
      @_reel.fixDecimals(decimals)
      @_imaginaire.fixDecimals(decimals)
      @
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
