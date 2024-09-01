  class SymbolManager
    # Simple conteneur pour créer les objets symboles
    # et pour contenir les valeurs
    @symbolsValueList: {}
    @alias:false
    @setAlias:(alias) ->
      if (typeof alias isnt "object") or (alias is null) then @alias = false
      else @alias = alias
    @checkAlias: (name) ->
      if @alias is false then return false
      for key, value of @alias
        if name in value then return key
      false
    @makeSymbol: (name) ->
      # Le but de cette méthode est de créer directement le bon type d'objet
      a = name
      if (s=SymbolManager.checkAlias(name)) isnt false then name = s
      switch
        when name is "ℝ" then (new Ensemble()).inverse()
        when (name is "π") or (name is "pi") then @pi()
        when name is "∅" then new Ensemble()
        when (name is "∞") or (name is "infini") or (name is "infty") then new InftyNumber()
        when name is "i" then new ComplexeNumber(0,1)
        when name is "" then new RealNumber()
        else new Monome(1, { name:name, power:1 })
    @pi: -> new Monome(1, { name:"pi", power:1 })
    @setSymbolsValue: (symbols) ->
      # Liste de symbols { key:value }
      for key, value of symbols
        switch
          when typeof value is "number" then @symbolsValueList[key] = new RealNumber(value)
          when (value instanceof NumberObject) and (value.isFunctionOf().length is 0) then @symbolsValueList[key] = value # On autorise pas de dépendance de symbole à symbole
          else @symbolsValueList[key] = new RealNumber()
    @getSymbolValue: (symbolName,symbols) ->
      v1=symbols?[symbolName]
      v2=@symbolsValueList[symbolName]
      switch
        when symbolName is "e" then return new RealNumber(Math.E)
        when symbolName is "pi" then return new RealNumber(Math.PI)
        when typeof v1 is "number" then new RealNumber v1
        when (v1 instanceof NumberObject) and not(v1.isFunctionOf(symbolName)) then v1
        when typeof v2 is "number" then new RealNumber v2
        when (v2 instanceof NumberObject) and not(v2.isFunctionOf(symbolName)) then v2
        else new RealNumber()