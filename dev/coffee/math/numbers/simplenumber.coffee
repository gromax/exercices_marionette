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
    isOne: (fact = 1) -> false
    # developp: (infos=null) -> identique au parent
    signature: -> "1"
    # extractFactor: () -> identique au parent

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

    sqrt: (infos=null) -> new RealNumber()
    modulecarreToNumber: () -> @floatify().modulecarreToNumber()
    getPolynomeFactors: (variable) -> @
    toMonome: -> new Monome(@)
    derivate: -> new RealNumber 0
    intPower: (exposant) ->
