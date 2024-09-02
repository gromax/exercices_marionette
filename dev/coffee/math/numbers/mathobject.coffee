  class MObject
        simplify: (infos=null) -> @
        fixDecimals: (decimals) -> @ # fonction destinée à parcourir récurisvement les objets et à nettoyer dans les valeurs numériques d'évenutuels résultats d'un calcul
        # comme 0.1 + 0.1 + 0.1 qui ne donne pas 0.3
        # l'objet est modifié, on retourne l'objet pour permettre le chaînage
        toString: -> "?"
        tex: -> "?"
        toClone: -> new MObject()
        getPolynomeFactors: (variable) -> null
        developp: (infos=null) -> @
        derivate: (variable) -> new MObject()
