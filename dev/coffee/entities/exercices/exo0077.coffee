define ["utils/math","utils/help"], (mM, help) ->
    return {
        getBriques: (inputs, options) ->
            expression = @init(inputs)
            expression_tex = expression.tex()
            simple = expression.simplify()
            simple_str = String simple
            reponse = switch
                when 'π' in simple_str then 4
                when simple_str.indexOf('sqrt') != -1 then 4
                when simple.isInteger() and simple.isPositive() then 0
                when simple.isInteger() then 1
                when simple.isDecimal() then 2
                else 3
            [
                {
                    bareme:100
                    title:"Ensemble"
                    items:[
                        {
                            type:"text"
                            ps:[
                                "Déterminez le plus petit ensemble de nombre contenant $#{expression_tex}$"
                            ]
                        }
                        {
                            type:"radio"
                            tag:"Ensemble"
                            name:"e"
                            radio:[
                                "$\\mathbb{N}$"
                                "$\\mathbb{Z}$"
                                "$\\mathbb{D}$"
                                "$\\mathbb{Q}$"
                                "$\\mathbb{R}$"
                            ]
                        }
                        {
                            type:"validation"
                            clavier:[]
                        }
                    ]
                    validations: {
                        e:"radio:5"
                    }
                    verifications: [{
                        radio:[ "$\\mathbb{N}$",    "$\\mathbb{Z}$", "$\\mathbb{D}$", "$\\mathbb{Q}$", "$\\mathbb{R}$" ]
                        name:"e"
                        tag:"Ensemble"
                        good: reponse
                    }]
                }
            ]
        init: (inputs) ->
            if inputs.e?
                expression = mM.parse inputs.e, {simplify:false}
            else
                # proba d'un signe moins
                sign = Math.random() > 0.5
                aleadeno = Math.random()
                denominator = switch
                    when aleadeno < 0.3 then 1
                    when aleadeno < 0.5 then [5,10,25,50,100,125,200,250,500,625,1000]
                    else {min:1, max:1000}
                n = mM.alea.number({
                    numerator:{min:1, max:10000, sign:sign}
                    denominator:denominator
                })
                if Math.random() > 0.9
                    n = n.floatify()
                npi = [n]
                alearacine = Math.random()
                x = mM.alea.real {min:2, max:10}
                if alearacine > 0.85
                    npi.push mM.toNumber(x)
                else if alearacine > 0.7
                    npi.push mM.toNumber(x*x)
                if alearacine > 0.7
                    npi.push 'sqrt'
                    npi.push '*'
                if Math.random()>0.97
                    npi.push 'pi'
                    npi.push '*'
                expression = mM.exec npi
                inputs.e = String expression
            expression


        getExamBriques: (inputs_list,options) ->
            that = @
            fct_item = (inputs, index) ->
                expression = that.init(inputs,options)
                return "$#{expression.tex()}$$"

            return {
                children: [
                    {
                        type: "text",
                        children: [
                            "On donne des nombres réels."
                            "Vous devez donner pour chacun l'ensemble le plus petit les contenant parmi $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{D}$, $\\mathbb{Q}$ et $\\mathbb{R}$."
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
                expression = that.init(inputs,options)
                return "$#{expression.tex()}$"

            return {
                children: [
                    "On donne des nombres réels."
                    "Pour chacun vous devez donner l'ensemble le plus petit le contenant parmi $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{D}$, $\\mathbb{Q}$ et $\\mathbb{R}$."
                    {
                        type: "enumerate",
                        children: _.map(inputs_list, fct_item)
                    }
                ]
            }

    }
