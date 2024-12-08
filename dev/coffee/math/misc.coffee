# misc.coffee
# fonctions diverses

define [], () ->
    misc = {
        isInteger: (number) ->
            if (typeof number is "number") and (number is Math.round(number)) then true
            else false

        isInfty: (number) ->
            if (typeof number is "number") and ((number is Number.POSITIVE_INFINITY) or (number is Number.NEGATIVE_INFINITY)) then true
            else false

        signatures_comparaison: (a,b,order=1) ->
            a_s = a.signature()
            b_s = b.signature()
            if a_s is "1" then return -order
            if b_s is "N/A" then return -order
            if b_s is "1" then return order
            if a_s is "N/A" then return order
            if a_s >= b_s then return order
            -order

        toNumber: (value) ->
            if typeof value is "number"
                return value
            if typeof value isnt "string"
                return NaN
            value = value.replace /\,/, "."
            if (i = value.indexOf("%"))>0
                prefix = value.substring(0,i)
                if isNaN(prefix)
                    return NaN
                return (Number prefix) / 100
            if isNaN(value)
                return NaN
            return Number(value)

        isArray: Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'

        mergeObj: (objectA, objectB) ->
            # cas où on transmet un tableau en argument 1
            if misc.isArray(objectA)
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
        extractSquarePart: (value) ->
            if ((typeof value is "object") and (value.floatify)) then value = value.floatify().float()
            if not misc.isInteger(value) then return 1
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
        fixNumber: (num,decimals) -> Number(num.toFixed(decimals))

        union_arrays: (x, y) ->
            obj = {}
            obj[it] = it for it in x
            obj[it] = it for it in y
            ( obj[key] for key of obj )

        numToStr: (num,decimals) ->
            if decimals? then out = num.toFixed decimals
            else out = String num
            out.replace '.', ","
    }

    return misc