define ["utils/math","utils/help"], (mM, help) ->
#  id:55
#  title:"Calculer une intégrale"
#  description:"Calculer l'intégrale d'une fonction."
#  keyWords:["Analyse", "fonction", "Primitive", "Intégrale", "Terminale"]

  return {
    init: (inputs, options) ->
      optA = Number options.a.value
      if (typeof inputs.a is "undefined")
        if optA == 1
          a = 0
        else
          a = mM.alea.real { min:-3, max:3 }
        inputs.a = String a
      else
        a = Number inputs.a
      if (typeof inputs.b is "undefined")
        b = mM.alea.real { min:a+1, max:8 }
        inputs.b = String b
      else
        b = Number inputs.b
      a = mM.toNumber a
      b = mM.toNumber b

      poly = false
      if typeof inputs.variable is "undefined"
        variable = mM.alea.in ["t", "x"]
        inputs.variable = variable
      else
        variable = inputs.variable

      parameters = {}
      if typeof inputs.poly isnt "undefined"
        poly = mM.polynome.make inputs.poly
        fctTex = poly.derivate().tex({variable:variable})
        solution = mM.exec([poly.calc(b), poly.calc(a), "-"], { simplify:true })

      else
        if typeof inputs.coeffs isnt "undefined"
          coeffs = [Number c for c in inputs.coeffs.split(";")]
        else if optA == 1
          signe = mM.alea.in [1,-1]
          K = mM.alea.real { min:1, max:100 }
          lden = (mM.alea.real { min:2, max:20 })*signe
          coeffs = [K,lden]
          inputs.coeffs = coeffs.join(";")
        else
          degre = 2
          coeffs = [ ]
          coeffs.push mM.alea.real({ min:-7, max:7 }) for i in [0..degre]
          inputs.coeffs = coeffs.join(";")

        # calcul solution
        if optA == 1
          [K, lden] = coeffs
          fct = mM.exec [K, variable, 1, lden, "/", "*", "exp", "*"], {simplify:true}
          fctTex = fct.tex()
          solution = mM.exec [K, lden, "*", b, lden, "/", "exp", a, lden, "/", "exp", "-", "*"], {simplify:true}
          sFact = mM.exec [K, lden, "*"]
          sb = mM.exec [b, lden, "/", "exp", "*"], {simplify:true}
          sa = mM.exec [a, lden, "/", "exp", "*"], {simplify:true}
          solution = mM.exec [sFact, sb, sa, "-", "*"]
          parameters.formes = "DISTRIBUTION"
        else
          poly = mM.polynome.make { coeffs:coeffs }
          fctTex = poly.tex({variable:variable})
          primCoeffs = (mM.toNumber {numerator:c, denominator:i+1} for c,i in coeffs)
          primCoeffs.unshift(mM.toNumber 0)
          primPoly = mM.polynome.make { coeffs:primCoeffs }
          solution = mM.exec([primPoly.calc(b), primPoly.calc(a), "-"], { simplify:true })

      [
        fctTex
        a
        b
        solution.simplify()
        variable
        parameters
      ]


    getBriques: (inputs,options) ->
      [fctTex, a, b, integrale, variable, parameters] = @init(inputs, options)
      #console.log integrale
      [
        {
          bareme: 100
          items: [
            {
              type:"text"
              ps:[
                "Calculez l'intégrale : &nbsp; $\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fctTex}\\right)\\:\\text{d}#{variable}$"
                "Remarque : Ces intégrales peuvent être négatives."
              ]
            }
            {
              type: "input"
              format: [
                { text: "$\\mathcal{I}=$", cols:2, class:"text-right" }
                { latex: true, cols:10, name:"I"}
              ]
            }
            {
              type: "validation"
              clavier: ["pow", "sqrt"]
            }
          ]
          validations:{
            I:"number"
          }
          verifications:[
            {
              name:"I"
              tag: "$\\mathcal{I}$"
              good: integrale
              parameters: parameters
            }
          ]
        }
      ]

    getExamBriques: (inputs_list,options) ->
      that = @
      fct_item = (inputs, index) ->
        [fctTex, a, b, integrale, variable] = that.init(inputs,options)
        return "$\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fctTex}\\right)\\:\\text{d}#{variable}$"

      return {
        children: [
          {
            type: "text",
            children: [
              "Calculez les intégrales suivantes."
              "Remarque : Ces intégrales peuvent être négatives."
            ]
          }
          {
            type: "enumerate",
            refresh:true
            enumi:"1",
            children: _.map(inputs_list, fct_item)
          }
        ]
      }

    getTex: (inputs_list, options) ->
      that = @
      fct_item = (inputs, index) ->
        [fctTex, a, b, integrale, variable] = that.init(inputs,options)
        return "$\\displaystyle \\mathcal{I} = \\int_{#{a.tex()}}^{#{b.tex()}} \\left(#{fctTex})}\\right)\\:\\text{d}#{variable}$"

      return {
        children: [
          "Calculez les intégrales suivantes."
          "\\textit{Ces intégrales peuvent être négatives.}"
          {
            type: "enumerate",
            children: _.map(inputs_list, fct_item)
          }
        ]
      }

  }
