
  grecques = ["alpha", "beta", "delta", "psi", "pi", "theta", "phi", "xi", "rho", "epsilon", "omega", "nu", "mu", "gamma", "Alpha", "Beta", "Delta", "Psi", "Pi", "Theta", "Phi", "Xi", "Rho", "Epsilon", "Omega", "Nu", "Mu", "Gamma"]
  DECIMAL_SEPARATOR = ','
  DECIMAL_MAX_PRECISION = 10
  SOLVE_MAX_PRECISION = 12
  ERROR_MIN = 0.000000000001



  isInteger = (number) ->
    if (typeof number is "number") and (number is Math.round(number)) then true
    else false
  isInfty = (number) ->
    if (typeof number is "number") and ((number is Number.POSITIVE_INFINITY) or (number is Number.NEGATIVE_INFINITY)) then true
    else false
  signatures_comparaison= (a,b,order=1) ->
    a_s = a.signature()
    b_s = b.signature()
    if a_s is "1" then return -order
    if b_s is "N/A" then return -order
    if b_s is "1" then return order
    if a_s is "N/A" then return order
    if a_s >= b_s then return order
    -order
  isArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'
  mergeObj = (objectA, objectB) ->
    # cas où on transmet un tableau en argument 1
    if isArray(objectA)
      out = {}
      while obj = objectA.shift()
        if (typeof obj is "object") and (obj isnt null)
          out[key] = val for key, val of obj
      return out
    else
      # objectB overrides objectA
      if (typeof objectA isnt "object") or (objectB is null) then objectA = {}
      if (typeof objectB isnt "object") or (objectB is null) then return objectA
      objectA[key] = val for key, val of objectB
      if arguments.length>2
        i=2
        while i<arguments.length
          o = arguments[i]
          if (typeof o is "object") and (o isnt null)
            objectA[key] = val for key, val of o
          i++
      return objectA
  extractSquarePart = (value) ->
    if value instanceof NumberObject then value = value.floatify().float()
    if not isInteger(value) then return 1
    if value is 0 then return 0
    value = Math.abs(value)
    extract = 1
    while value % 4 is 0
      extract*=2
      value /= 4
    i=3
    j=9
    while j<=value
      while value % j is 0
        value /= j
        extract *= i
      j += 4*i+4
      i += 2
    extract
  fixNumber = (num,decimals) -> Number(num.toFixed(decimals))

  union_arrays = (x, y) ->
    obj = {}
    obj[it] = it for it in x
    obj[it] = it for it in y
    ( obj[key] for key of obj )

  numToStr = (num,decimals) ->
    if decimals? then out = num.toFixed decimals
    else out = String num
    out.replace '.', ","
