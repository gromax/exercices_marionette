define [
    'maths/constants',
    'maths/misc',
    'maths/numbers/mathobject'
], (CST, misc, MObject) ->
    class NumberObject extends MObject
        _plus: true
        @makeReal: (value) -> throw new Error('<makeReal> non implémenté. Importez RealNumber.')
        @makePlus: (a, b) -> throw new Error('<makePlus> non implémenté. Importez PlusNumber.')
        @makeMult: (a, b) -> throw new Error('<makeMult> non implémenté. Importez MultiplyNumber.')
        setPlus: (plus) ->
            @_plus = plus
            @
        signe: ->
            if @_plus then 1
            else -1
        toString: ->
            composite = @compositeString { tex:false }
            if composite[1] then out=composite[0]
            else out="-"+composite[0]
            out
        tex: (config)->
            ###
            options.tex = indique si on cherche une version tex
            les autres options ne servent que pour le cas d'un tex
            options.symbolsUp : 2/4*x s'écriera 2x/4
            options.altFunctionTex : tableau des fonctions à donner sous une forme alt
            options.negPowerDown: Mets les puissances négatives au dénominateur
            ###
            options = misc.mergeObj { tex:true }, config
            composite = @compositeString options
            if composite[1] then out=composite[0]
            else out="-"+composite[0]
            out
        compositeString : (options) -> ["?", @_plus, false, false]
        ###
        Cette fonction renvoie en morceaux les différents éléments d'un string
        On obtient donc un tableau qui renvoie :
        string => chaine sans l'éventuel premier signe (toujours donnée en premier élément)
        beginPlus => Indique que le premier signe est + (toujours présent, en 2e)
        addition => Indique si bloc addition (toujours en 3e)
        multiplication => Indique si bloc multiplication (toujours en 4e)
        L'argument permet de préciser s'il s'agit d'un retour en laTex
        ###
        simplify: (infos=null,developp=false, memeDeno=false) -> NumberObject.makeReal()
        add: (operand, infos=null) -> @am(operand, false, infos)
        minus: (operand, infos=null) -> @am(operand, true, infos)
        am: (operand, minus, infos=null) ->
            if operand.isNul() then return @
            op = operand.toClone()
            if minus then op.opposite()
            if @isNul() then return op
            NumberObject.makePlus(@, op)
        opposite: () ->
            # À noter que cette fonction renvoie toujours l'objet de départ et se contente de le modifier
            @_plus = not @_plus
            @
        mult: (operand, infos=null) -> @md(operand, false, infos)
        divide: (operand, infos=null) -> @md(operand, true, infos)
        md: (operand, divide,infos=null) ->
            if @isNul() then return NumberObject.makeReal(0)
            if operand.isNul()
              if divide then return NumberObject.makeReal()
              else return NumberObject.makeReal(0)
            op = operand.toClone()
            if divide
              if typeof (inverse = op.inverse()) isnt "undefined" then return NumberObject.makeMult(@, inverse)
              else return (NumberObject.makeMult(@))._pushDenominator(op)
            NumberObject.makeMult(@, op)
        inverse : -> undefined
        puissance : (exposant) ->
            if (exposant instanceof NumberObject) then exposant = exposant.floatify().float()
            if not misc.isInteger(exposant) then return NumberObject.makeReal()
            if exposant is 0 then return NumberObject.makeReal(1) # Suppose que 0^0 = 1
            if exposant > 10 then return NumberObject.makeReal() # Pour éviter un calcul trop long
            output = NumberObject.makeReal(1)
            for i in [1..Math.abs(exposant)]
              output = output.md(@, false)
            if exposant<0 then (NumberObject.makeReal(1)).md(output, true)
            else output
        floatify: (symbols) -> NumberObject.makeReal()
            #  Renvoie soit un RealNumber soit un ComplexeNumber
        float: () -> NaN
        isFunctionOf: (symbol) ->
            # Si on précise le string symbol, on cherche si l'objet est fonction de ce symbol
            # sinon on donne un tableau contenant tous les symbols donc le number est fonction
            if typeof symbol is "string" then false
            else []
        degre: (variable) -> 0 # degre de dépendance à un symbole donné. Pas "i"
        toClone : ->
            clone = new NumberObject()
            clone.setPlus(@_plus)
        isNul: (symbols) -> @floatify(symbols).isNul()
        isPositive: (symbols) -> @floatify(symbols).isPositive()
        isDecimal: (symbols) -> false
        isNegative: (symbols) -> @floatify(symbols).isNegative()
        isOne:(facto=1) -> @float() is facto
        isNaN: -> true
        isInteger: -> undefined  # Permet d'appeler la fonction sur tous les objets
        isFloat: -> undefined  # Permet d'appeler la fonction sur tous les objets
        isReal: (symbols) -> @floatify(symbols).isReal()  # Permet d'appeler la fonction sur tous les objets
        isImag: (symbols) -> @floatify(symbols).isImag()  # Permet d'appeler la fonction sur tous les objets
        getReal: -> NumberObject.makeReal()  # Permet d'appeler la fonction sur tous les objets
        getImag: -> NumberObject.makeReal()  # Permet d'appeler la fonction sur tous les objets
        conjugue: -> @ # certains type d'objets n'ont pas une définition appropriée de conjugue
        assignValueToSymbol: (liste) ->
            # Transforme les occurences de Symbol
            # C'est l'appel parent qui vérifie les items
            for key,value of liste
              switch
                when typeof value is "number" then liste[key] = NumberObject.makeReal(value)
                when (value instanceof NumberObject) and (value.isFunctionOf().length>0) then liste[key] = NumberObject.makeReal()
            @_childAssignValueToSymbol(liste)
        _childAssignValueToSymbol:(liste) -> @
        signature: -> "N/A"  # Permet de regrouper des termes dont la forme est semblable
        extractFactor: ->
            if @_plus then return NumberObject.makeReal(1)
            @_plus = true
            NumberObject.makeReal(-1)
        order: (normal=true) -> @ # Trie les facteurs
        derivate:(variable)->
            if @isFunctionOf(variable) then return NumberObject.makeReal()
            else return NumberObject.makeReal(0)
        applyFunction: (functionName) -> FunctionNumber.make functionName, @
        compare: (b,symbols)->
            ecart = @toClone().am(b,true);
            switch
              when ecart.isNul(symbols) then 0      # Peut fonctionner pour un complexe
              when ecart.isPositive(symbols) then 1    # Fonctionne pour +infini
              when ecart.isNegative(symbols) then -1    # Fonctionne pour -infini
              else false               # Un complexe renvoie false, de même qu'un réel de value = NaN
            # À noter qu'un nombre peut renvoyer faux aussi bien à positif qu'à négatif, s'il est NaN ou écart complexe
        distance: (b, symbols) ->
            ###
                Renvoie un float donnant la distance entre deux numberobject
                Fonctionne pour les complexes
            ###
            if not(b instanceof NumberObject) then return NaN
            d = @toClone().am(b,true).floatify(symbols).abs().float()
            if d<CST.ERROR_MIN then d = 0
            d
        equals: (b,symbols) -> @floatify(symbols).am(b.floatify(symbols),true).isNul()
        facto: (regex) -> null
        replace: (replacement,needle) ->
            # Remplaces les symboles needle par replacement
            @toClone()

    return NumberObject
