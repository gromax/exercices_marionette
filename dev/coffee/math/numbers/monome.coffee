  class Monome extends NumberObject
    coeff: null    # Toujours un SimpleNumber
    symbols: null  # Une table d'objet {clé = string nom de la variable : valeur = number, toujours un entier relatif}
    _order:true    # Lors des affichages, les symbols sont donnés dans l'ordre / Pas encore géré
    constructor: (coeff, symbols) ->
      # Formats possible pour symbols :
      # "x^2*y"
      # [{name:"x", power:2}, {name:"y", power:1}]
      # { name:"x", power:2 }
      if coeff instanceof SimpleNumber then @coeff=coeff
      else @coeff = new RealNumber coeff
      @symbols = {}
      switch
        when typeof symbols is "string"
          #C'est le nom d'une variable ou d'un bloc comme "x^2*y"
          symbolsList = symbols.split("*")
          for symbolItem in symbolsList
            [name,power] = symbolItem.split("^")
            power = Number power
            if Number.isNaN(power) then power=1
            @pushSymbol name,power
        when isArray(symbols)
          @pushSymbol symbolItem.name,symbolItem.power for symbolItem in symbols
        when (typeof symbols is "object") and (symbols isnt null) then @pushSymbol symbols.name, symbols.power
    pushSymbol:(name,power,cleanZero=false,infos=null)->
      if @symbols[name]?
        if infos isnt null then infos?.set("MULT_SYMBOLE")
        @symbols[name]+=power
      else @symbols[name] = power
      if cleanZero and (@symbols[name] is 0) then delete @symbols[name]
      @
    hasSymbols: -> Object.keys(@symbols).length>0
    isSymbol: (name) -> (@symbols[name] is 1) and (Object.keys(@symbols).length is 1) and (@coeff.isOne()) # Vérifie si ce monome est 1.symbol^1 (surtout pour e)
    # Fonctions de NumberObject
    setPlus: (plus) ->
      @coeff.setPlus(plus)
      @
    compositeString: (options) ->
      coeffDone = false
      numArray = []
      if options.negPowerDown then denArray = []
      if not @hasSymbols() then return @coeff.compositeString options
      multObj = false
      keys = Object.keys(@symbols).sort()
      if not @_order then keys.reverse()
      for key in keys
        power = @symbols[key]
        switch
          when options.tex and (key in grecques) then name = "\\#{key}"
          when key is "pi" then name = "π"
          else name = key
        multObj=true
        switch
          when power is 1
            multObj = false
            numArray.push name
          when options.tex and options.negPowerDown and power is -1
            denArray.push "#{name}"
          when options.tex and options.negPowerDown and power<0
            denArray.push "#{name}^{#{-power}}"
          when options.tex
            numArray.push "#{name}^{#{power}}"
          when power >=0 then numArray.push "#{name}^#{power}"
          when power is -1 and options.negPowerDown
            denArray.push "#{name}"
          when options.negPowerDown
            denArray.push "#{name}^#{-power}"
          else numArray.push "#{name}^(#{power})"
      if (keys.length>1) then multObj=true
      if (@coeff instanceof RationalNumber) and (options.floatNumber isnt true) and ((options.symbolsUp) or (options.negPowerDown))
        coeffDone = true
        if not @coeff.isOne() then multObj = true
        coeffNum = @coeff.numerator.compositeString options
        coeffPositif = coeffNum[1]
        coeffDen = @coeff.denominator.compositeString options
        if coeffNum[0] isnt "1"
          numArray.unshift coeffNum[0]
        if coeffDen[0] isnt "1"
          if denArray? then denArray.unshift coeffDen[0]
          else denArray = [ coeffDen[0] ]
      if options.tex
        numString=numArray.join(" ")
        if denArray? and denArray.length>0 then denString = denArray.join(" ")
        else denString = null
      else
        numString = numArray.join("*")
        if denArray? and denArray.length>0
          if denArray.length is 1 then denString = denArray.pop()
          else denString = "("+denArray.join("*")+")"
        else denString = null
      if numString is "" then numString = "1"
      if denString is null then outString = numString
      else
        if options.tex then outString = "\\frac{#{numString}}{#{denString}}"
        else outString = "#{numString}/#{denString}"
      if coeffDone is false
        csCoeff = @coeff.compositeString options
        if outString is "1" then return csCoeff
        coeffPositif = csCoeff[1]
        if csCoeff[0] isnt "1"
          multObj=true
          if csCoeff[2]
            # S'il y a un - il doit être entre parenthèses collés au nombre
            # de sorte qu'il y aura toujours un + devant
            if coeffPositif then s="" else s="-"
            coeffPositif = true
            if options.tex then outString = "\\left(#{s}#{csCoeff[0]}\\right)#{outString}"
            else outString = "(#{s}#{csCoeff[0]})*#{outString}"
          else
            if options.tex then outString = csCoeff[0]+outString
            else outString = csCoeff[0]+"*"+outString
      [outString,coeffPositif,false,multObj]
    fixDecimals: (decimals) ->
      @coeff.fixDecimals(decimals)
      @
    simplify: (infos=null) ->
      for key,power of @symbols
        if power is 0
          delete @symbols[key]
          infos?.set("EXPOSANT_ZERO")
      @coeff = @coeff.simplify(infos)
      if @coeff.isNul() or @coeff.isNaN() or (Object.keys(@symbols).length is 0) then return @coeff
      @
    am: (operand, minus, infos=null) ->
      if (operand instanceof Monome) and (operand.signature() is @signature())
        infos?.set("ADD_REGROUPEMENT")
        @coeff = @coeff.am(operand.coeff,minus)
        return @
      super(operand,minus,infos)
    opposite: () ->
      @coeff.opposite()
      @
    md: (operand, div, infos=null) ->
      switch
        when operand instanceof Monome
          @coeff = @coeff.md(operand.coeff,div,infos)
          if div
            @pushSymbol(key,-power,true,infos) for key,power of operand.symbols
          else
            @pushSymbol(key,power,true,infos) for key,power of operand.symbols
          if Object.keys(@symbols).length is 0 then return @coeff
          return @
        when operand instanceof SimpleNumber
          @coeff = @coeff.md(operand,div,infos)
          return @
      super(operand, div, infos)
    inverse: () ->
      @symbols[key] = -power for key, power of @symbols
      @coeff = @coeff.inverse()
      @
    puissance: (exposant) ->
      # Utilisé dans la simplification de power mais n'est qu'une réécriture
      if exposant instanceof NumberObject then exposant = exposant.floatify().float()
      if not(isInteger(exposant)) then return new RealNumber()
      if exposant is 0 then return new RealNumber(1)
      @symbols[key] *= exposant for key,power of @symbols
      @coeff = @coeff.puissance(exposant)
      @
    floatify: (symbols) ->
      out = @coeff.floatify(symbols)
      out = out.md( SymbolManager.getSymbolValue(key,symbols).floatify().puissance(power), false) for key,power of @symbols when power isnt 0
      out
    isFunctionOf: (symbol) ->
      if typeof symbol is "string"
        if (symbol is "e") or (symbol is "pi") or (symbol is "i") then false
        else (typeof @symbols[symbol] is "number") and (@symbols[symbol] isnt 0)
      else ( key for key, power of @symbols when (power isnt 0) and (key isnt "i") and (key isnt "pi") and (key isnt "e") )
    degre: (variable) -> @symbols[symbol] ? 0
    toClone: () ->
      cl = new Monome @coeff.toClone()
      cl.pushSymbol(key,power) for key,power of @symbols
      cl
    isNul: () -> @coeff.isNul()
    isOne: (factor) -> not(@hasSymbols()) and @coeff.isOne(factor)
    _childAssignValueToSymbol: (liste) ->
      for key,value of liste
        if @symbols[key]?
          if @symbols[key] isnt 1 then value = PowerNumber.make(value.toClone(), @_exposant)
          delete @symbols[key]
          switch
            when not @hasSymbols() then return value.md(@coeff,false)
            when value instanceof SimpleNumber
              @coeff = @coeff.md(value,false)
              return @
            when value instanceof Monome then return @md(value,false)
            else return MultiplyNumber.makeMult(value,@)
      @
    # developp: (infos=null) -> identique au parent
    signature: ->
      keys = Object.keys(@symbols).sort()
      s = ""
      s+= key+@symbols[key] for key in keys when (@symbols[key] isnt 0)
      if s is "" then return "1"
      s
    extractFactor: () ->
      coeff = @coeff
      @coeff = new RealNumber(1)
      coeff
    getPolynomeFactors: (variable) ->
      cl = @
      power = 0
      if @symbols[variable]?
        cl = @toClone()
        power = @symbols[variable]
        delete cl.symbols[variable]
      if not cl.hasSymbols() then cl = cl.coeff
      if power is 0 then cl
      else { monome:power, factor:cl }
    derivate: (variable) ->
      if @symbols[variable]? and (@symbols[variable] isnt 0)
        out = @toClone()
        power = @symbols[variable]
        out.coeff = out.coeff.md(new RealNumber(power),false)
        if power is 1 then return out.coeff
        out.symbols[variable] = power-1
        return out
      new RealNumber 0
    order: (normal=true) ->
      @_order = normal
      @
    replace: (replacement,needle) ->
      if @symbols[needle]?
        x = replacement.toClone()
        if @symbols[needle] isnt 1 then x = new PowerNumber(x,new RealNumber(@symbols[needle]))
        y = @toClone()
        delete y.symbols[needle]
        switch
          when y.isOne() then x
          when y.isOne(-1) then x.opposite()
          else x.md(y,false)
      else @toClone()
    getNumDen: () ->
      numSymbs = []
      denSymbs = []
      for key, value of @symbols
        if value>=0 then numSymbs.push { name:key, power:value }
        else denSymbs.push { name:key, power:-value }
      [ new Monome(@coeff, numSymbs), new Monome(1,denSymbs) ]
