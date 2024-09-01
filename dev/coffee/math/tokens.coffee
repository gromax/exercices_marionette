
  #----------Tokens---------
  class TokenObject
    getPriority: -> 0
    acceptOperOnLeft: -> false
    operateOnLeft: -> false
    acceptOperOnRight: -> false
    operateOnRight: -> false
    execute: (stack) -> new MObject()
  class TokenNumber extends TokenObject
    constructor: (str) ->
      @value = Number(misc.toNumber(str).toFixed(CST.DECIMAL_MAX_PRECISION))
      @percent = "%" in str
    toString: -> @value
    @getRegex: -> '\\d+[.,]?\\d*(E-?\\d+)?%?'
    acceptOperOnLeft: -> true
    acceptOperOnRight: -> true
    execute: (stack) ->
      out = new RealNumber @value
      if @percent then out.setPercent true
      out
  class TokenVariable extends TokenObject
    constructor: (@name) ->
    toString: -> @name
    @getRegex: () -> "[#∞πa-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*" # les chiffres sont-ils souhaitables ?
    acceptOperOnLeft: -> true
    acceptOperOnRight: -> true
    execute: (stack) -> SymbolManager.makeSymbol @name
  class TokenOperator extends TokenObject
    operand1: null
    operand2: null
    constructor: (@opType) ->
      if @opType is "cdot" then @opType = "*"
    toString: -> @opType
    @getRegex: () -> "[\\+\\-\\/\\^÷;]|cdot"
    setOpposite: ->
      @opType = "0-"
      @
    getPriority: ->
      switch
        when @opType is "^" then 9
        when @opType is "0-" then 8
        when (@opType is "*") or (@opType is "/") or (@opType is "÷") then 7
        when (@opType is "+") or (@opType is "-") then 6
        else 1
    acceptOperOnLeft: -> @opType is "0-"
    operateOnLeft: -> @opType isnt "0-"
    operateOnRight: -> true
    execute: (stack) ->
      if @opType is "0-"
        stack.pop()?.opposite?()
      else
        @operand2 = stack.pop() ? new MObject()
        @operand1 = stack.pop() ? new MObject()
        switch
          when @opType is "+" then PlusNumber.makePlus( [@operand1, @operand2] )
          when @opType is "-" then PlusNumber.makePlus( [@operand1, @operand2?.opposite?()] )
          when @opType is "*" then MultiplyNumber.makeMult( [@operand1, @operand2] )
          when @opType is "/" then MultiplyNumber.makeDiv( @operand1, @operand2 )
          when @opType is "÷" then MultiplyNumber.makeDiv( @operand1, @operand2 )
          when @opType is "^" then PowerNumber.make( @operand1, @operand2 )
          when @opType is ";" then new Collection(";", [@operand1, @operand2] )
          else new RealNumber()
  class TokenFunction extends TokenObject
    operand: null
    # Debug : Le name semble limité deux fois de suite
    constructor: (@name) ->
    toString: -> @name
    @getRegex: -> "sqrt|racine|cos|sin|ln|exp|frac"
    getPriority: -> 10
    acceptOperOnLeft: -> true
    operateOnRight: -> true
    execute: (stack) ->
      if @name is "frac"
        col = stack.pop()
        if col instanceof Collection
          ops = col.getOperands()
          if ops.length is 2
            return MultiplyNumber.makeDiv( ops[0], ops[1] )
        new RealNumber()
      else FunctionNumber.make(@name, stack.pop())

  class TokenParenthesis extends TokenObject
    constructor: (token) ->
      @type = token
      @ouvrant = @type is "(" or @type is "{"
    toString: -> @type
    @getRegex: -> "[\\(\\{\\}\\)]"
    acceptOperOnLeft: -> @ouvrant
    acceptOperOnRight: -> not @ouvrant
    isOpeningParenthesis: -> @ouvrant
    isClosingParenthesis: -> not @ouvrant
