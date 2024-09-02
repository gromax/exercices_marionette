# Notes de travail sur les objets maths

## MathObject
* simplify: (infos=null) -> @
* fixDecimals: (decimals) -> @
    fonction destinée à parcourir récurisvement les objets et à nettoyer dans les valeurs numériques d'évenutuels résultats d'un calcul lié au problème des float
* toString: -> "?"
* tex: -> "?"
* toClone: -> new MObject()
* getPolynomeFactors: (variable) -> null
* developp: (infos=null) -> @
* derivate: (variable) -> new MObject()

## NumberObject

hérite de MathObject

## redéfinit

* simplify -> NumberObject ... à définir selon cas
* toString: -> string,  utilise compositeString
* tex(config): -> string,  utilise compositeString
* toClone: -> NumberObject, copie de l'objet courant, à définir selon cas
* derivate: (variable) -> NumberObject
    RealNumber(0) si pas de dépendance sinon dépend du cas

## spécifique

* _plus: bool
* setPlus: -> this, attribue _plus
* signe: -> bool, renvoie l'état de _plus
* compositeString(options): -> Array[string, bool, bool, bool],
    string: la chaine sans l'éventuel premier signe
    bool: premier signe est +
    bool: est un bloc additif, pour savoir s'il faut mettre des ()
    bool: est bloc multiplicatif, pour des cas de ()
* add(operand, infos) -> NumberObject, pointe vers am
* minus: (operand, infos) -> NumberObject, pointe vers am
* am(operand, minus:bool, infos) -> NumberObject.
    Analyse les cas symple (this ou op nul...)
    Crée un objet PlusNumber par défaut
    modifie operand
* opposite: -> this, change _plus
* mult(operand, infos) => pointe vers md
* divide(operand, infos) => pointe vers md
* md(operand, divide, infos)
* inverse ... à définir
* puissance(exoposant) pour un exposant entier et <10
* floatify: (symbols) -> RealNumber, à définir selon cas
* float: -> Number = NaN, à définir selon cas
* isFunctionOf: (symbol)  -> string ou Array(string)
    En l'absence de symbol, renvoie la liste des symboles dont l'objet est fonction
    à définir selon cas
* degre: (variable) -> Number, 0 par défaut, degré de dépendance d'un symbole donné, pas i
* isNul: (symbols) -> bool. Exploite floatify donc RealNumber
* isPositive: (symbols) -> bool. idem
* isNegative(symbols) -> bool. idem
* isOne(facto=1) -> bool, utilise float()
* isNaN: -> bool, true par défaut, à définir selon cas
* isInteger: -> bool, undefined par défaut, à définir selon cas
* isFloat: -> bool, undefined par défaut, à définir selon cas
* isReal: (symbols) -> bool, exploite floatify donc RealNumber ou ComplexNumber
* isImag: (symbols) -> bool, idem
* getReal: -> RealNumber, à définir
* getImag: -> RealNumber, idem
* conjugue: -> this, à définir
* assignValueToSymbol: (liste:object) ->
    liste: {key: value}
    transforme les value Number en RealNumber
    si un value dépend de symbole, remplace par un RealNumber invalide
    appelle la fonction enfant _childAssignValueToSymbol
* _childAssignValueToSymbol: (liste) -> NumberObject, this par défaut, à définir selon cas
* signature: -> string, "N/A" par défaut, à définir selon cas
    sert à identifier des blocs pour factorisation
* extractFactor: -> RealNumber, extrait un facteur réel d'un bloc pour factorisation
    par défaut extrait le -1 de @_plus
* order: (normal=true) -> this, trie es facteurs
* applyFunction: (functionName:string) -> NumberObject
    Dépendant de FunctionNumber
* compare: (b:NumberObject, symbols) -> Number
    0 pour this == b
    1 pour this > b
    -1 pour this < b
    false si comparaison pas faisable (symbols manquants ou complexe)
    exploite les méthodes isNul, isPositive, isNegative
* distance: (b:NumberObject, symbols) -> Number
    renvoie la valeur absolue de this - b (module si complexe)
    si < CST.ERROR_MIN, mis à 0
* equals: (b:NumberObject, symbols) -> bool
    renvoie true si le float de this - b vaut 0
* facto: (regex) -> null, ???
* replace: (replacement, needle) -> ???

## SimpleNumber

hérite de NumberObject

### redéfinit
* am
* md
* isFloat: -> false
* isInteger: -> false
* getReal: -> this
* getImag: -> RealNumber(0)
* isOne(fact=1) -> false par défaut, à définir (ne sert un peu à rien...)
* developp, hérité de MObject
* signature: -> "1"
* getPolynomeFactors, hérité de MObject


### Nouveautés
* applyNumericFunction(name) -> NumberObject
  On ne voit pas l'intérêt vis à vis de applyFunction !
* addSimple(operand, infos)
* minusSimple(operand, infos)
* amSimple(operand, minus, info) -> à définir
* multiplySimple(operand, infos)
* divideSimple(operand, infos)
* mdSimple(operand, divide, infos) -> à définir
* sqrt:(infos) -> à définir
* modulecarreToNumber() -> floatify puis module au carré
* toMonome: -> new Monome(this)
* intPower: (exposant) -> undefined

## FloatNumber

hérite de SimpleNumber

### redéfinit

* float: (decimals) -> NaN

### spécifique

* _float:bool
* approx: (decimals) -> new RealNumber()

## RealNumber

hérite de FloatNumber


