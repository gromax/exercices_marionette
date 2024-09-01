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
      racine: { alias: "sqrt" }
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
        if misc.isArray(options.altFunctionTex) and (@_function.alt?) and (@_function.alias in options.altFunctionTex) then f_tex = @_function.alt
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
    fixDecimals: (decimals) ->
      @_operand.fixDecimals(decimals)
      @
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
      if not @_plus
        y = -y
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
    signature: ->
      @_operand.order()
      @compositeString({tex:false, floatNumber:true})[0]
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
