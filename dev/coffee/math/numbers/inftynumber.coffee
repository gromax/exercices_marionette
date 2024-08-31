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
