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
    fixDecimals: (decimals) ->
      @_base.fixDecimals(decimals)
      @_exposant.fixDecimals(decimals)
      @
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
      else misc.union_arrays @_base.isFunctionOf(), @_exposant.isFunctionOf()
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
