  class PlusNumber extends NumberObject
    constructor: ->
      @operands = []
      for operand in arguments
        if operand instanceof PlusNumber and operand._plus
          @operands.push(sous_operand) for sous_operand in operand.operands
        else
          if operand instanceof NumberObject then @operands.push operand
    @makePlus: (ops) ->
      if ops.length is 0 then return new RealNumber(0)
      if ops.length is 1 then return ops[0]
      if (ops.length is 2) and ops[1].isImag() and ops[0].isReal()
        return ops[0].am ops[1], false
      new PlusNumber ops...
    compositeString: (options) ->
      n = @operands.length
      if n is 0 then return ['0', true, false, false]
      cs_start = @operands[0].compositeString options
      if n is 1
        cs_start[1] = (cs_start[1] == @_plus)
        return cs_start
      str = cs_start[0]
      for oper in @operands[1..n]
        cs = oper.compositeString options;
        if cs[1] then str += "+"+cs[0]
        else str += "-"+cs[0];
      if @_plus then return [str, cs_start[1], true, false]
      if not cs_start[1] then str = '-'+str
      if options.tex then str = "\\left(#{str}\\right)"
      else str = "(#{str})"
      [str, false, false, false]
    fixDecimals: (decimals) ->
      item.fixDecimals(decimals) for item in @operands
      @
    simplify: (infos=null,developp=false,memeDeno=false)->
      for operand, i in @operands
        if not @_plus then operand.opposite()
        @operands[i] = operand.simplify(infos,developp,memeDeno)
      @_plus = true
      @_absorb_sousAdd()
      i=0
      while i<@operands.length
        sign_i = @operands[i].signature()
        if sign_i isnt "N/A"
          j=i+1
          while j<@operands.length
            sign_j = @operands[j].signature()
            if sign_i is sign_j
              if sign_i is "1" then @operands[i] = @operands[i].amSimple(@operands[j], false, infos)
              else
                @operands[i] = @operands[i].md(@operands[i].extractFactor().amSimple(@operands[j].extractFactor(),false), false)
                infos?.set("ADD_REGROUPEMENT")
              @operands.splice(j,1)
            else j++
        if @operands[i].isNul() then @operands.splice(i,1)
        else i++
      if (memeDeno is true) and (@operands.length>1)
        # Il faut chercher les dénominateurs et tout mettre sur un même dénominateur
        dens = new RealNumber 1
        for i in [0..@operands.length-1]
          s = @operands.shift()
          if s.getNumDen
            [num, den] = s.getNumDen()
            @operands = ( op.md(den,false).simplify() for op in @operands )
            @operands.push num
            dens = dens.md(den,false)
          else
            @operands.push s
        dens = dens.simplify()
        out = @developp().simplify(null,false,false)
        if (dens instanceof RealNumber) and (dens.isOne()) then return out
        else return out.md(dens,true)
      if @operands.length is 0 then return new RealNumber(0)
      if @operands.length is 1 then return @operands[0]
      @
    am: (operand, minus, infos=null) ->
      if minus then @operands.push(operand.toClone().opposite())
      else @operands.push(operand.toClone())
      @
    opposite: ->
      @_plus = not @_plus
      @
    order: (normal=true) ->
      op.order(normal) for op in @operands
      if normal then @operands.sort (a,b) -> misc.signatures_comparaison(a,b,1)
      else @operands.sort (a,b) -> misc.signatures_comparaison(a,b,-1)
      @
    # md: (operand, divide, infos=null) -> identique au parent
    floatify : (symbols) ->
      total = new RealNumber(0)
      for operand in @operands
        total = total.addSimple(operand.floatify(symbols))
      if not @_plus then total.opposite()
      total
    isFunctionOf: (symbol) ->
      if typeof symbol is "string"
        for operand in @operands
          if operand.isFunctionOf(symbol) then return true
        false
      else
        out = []
        for operand in @operands
          sym = operand.isFunctionOf()
          out = misc.union_arrays out, sym
        out
    degre: (variable) -> Math.max (operand.degre(variable) for operand in @operands)...
    toClone: ->
      clone = new PlusNumber()
      for operand in @operands
        clone.push(operand.toClone())
      clone.setPlus(@_plus)
    conjugue: ->
      operand.conjugue() for operand in @operands
      @
    _childAssignValueToSymbol: (liste) ->
      @operands[i]=operand._childAssignValueToSymbol(liste) for operand,i in @operands
      @
    developp: (infos=null) ->
      for operand,i in @operands
        if not @_plus then operand.opposite()
        @operands[i] = operand.developp(infos)
      @_plus = true
      @_absorb_sousAdd()
      @
    #signature: -> identique au parent
    #extractFactor: -> identique au parent
    getPolynomeFactors: (variable) ->
      # utilisé pour créer l'arborescence nécessaire pour créer un objet polynome
      output = { add:( op.getPolynomeFactors(variable) for op in @operands ) }
      if @_plus then output
      else { mult:[-1, output] }
    derivate: (variable) ->
      der = new PlusNumber()
      der.setPlus(@_plus)
      der.push nb.derivate(variable) for nb in @operands
      der
    # spécifiques de la classe
    push: ->
      for operand in arguments
        if operand instanceof PlusNumber and operand._plus
          @operands.push(sub_operand) for sub_operand in operand.operands
        else if operand instanceof NumberObject then @operands.push(operand)
      @
    facto:(regex) ->
      out = []
      factor = null
      for op in @operands
        f = op.facto(regex)
        if f is null then return null
        if factor is null then factor = f[1]
        out.push f[0]
      if factor is null then return null
      [@constructor.makePlus(out), factor]
    replace: (replacement,needle) ->
      # Remplaces les symboles needle par replacement
      clone = new PlusNumber()
      clone.push(operand.replace(replacement,needle)) for operand in @operands
      clone.setPlus(@_plus)

    # Fonctions privées
    _developpingMult: (operand) ->
      if operand instanceof PlusNumber
        new_operands = []
        plus_produit = (@_plus == operand._plus)
        for plus1_operand in @operands
          for plus2_operand in operand.operands
            new_operands.push(plus1_operand.toClone().md(plus2_operand,false))
        if not plus_produit
          for plus_operand in new_operands
            operand.opposite()
        @operands = new_operands
      else
        for plus_operand, i in @operands
          @operands[i] = plus_operand.md(operand,false)
          if not @_plus then @operands[i].opposite()
      @_plus = true
      @
    _absorb_sousAdd: ->
      for operand, i in @operands
        if (operand instanceof PlusNumber) and operand._plus
          @operands[i..i]=operand.operands
      @

  NumberObject.makePlus = (a,b) -> new PlusNumber(a, b)