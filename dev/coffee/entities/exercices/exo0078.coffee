define ["utils/math","utils/help"], (mM, help) ->
    return {
        getBriques: (inputs, options) ->
            [gauche, ineqgauche, ineqdroite, droite] = @init(inputs)
            texGauche = if gauche is null then "" else gauche.tex() + mM.misc.ineqSymbolStrToTex(ineqgauche)
            texDroite = if droite is null then "" else mM.misc.ineqSymbolStrToTex(ineqdroite) + droite.tex()
            tex = texGauche + " x " + texDroite
            goodCrochets = switch
                when ineqgauche == "<" and ineqdroite =="<" then 0
                when ineqgauche == "<" and ineqdroite =="<=" then 1
                when ineqgauche == "<=" and ineqdroite =="<" then 2
                when ineqgauche == "<=" and ineqdroite =="<=" then 3
                when ineqgauche == ">" and ineqdroite ==">" then 0
                when ineqgauche == ">=" and ineqdroite ==">" then 1
                when ineqgauche == ">" and ineqdroite ==">=" then 2
                when ineqgauche == ">=" and ineqdroite ==">=" then 3
                else 0
            crochetGauche = if goodCrochets <= 1 then "]" else "["
            crochetDroite = if goodCrochets % 2 == 0 then "[" else "]"

            goodGauche = switch
                when gauche is null and ineqgauche == "<" then mM.exec ["infini", '*-']
                when gauche is null then droite
                else gauche
            
            goodDroite = switch
                when droite is null and ineqdroite == "<" then mM.exec ["infini"]
                when droite is null then gauche
                else droite

            [
                {
                    bareme:50
                    title:"Crochets"
                    items:[
                        {
                            type:"text"
                            ps:[
                                "On considère l'inéquation suivante :"
                                "$#{tex}$"
                                "Commencez par déterminer la position des crochets de l'ensemble solution"
                            ]
                        }
                        {
                            type:"radio"
                            tag:"Crochets"
                            name:"c"
                            radio:[
                                "]...;...["
                                "]...;...]"
                                "[...;...["
                                "[...;...]"
                            ]
                        }
                        {
                            type:"validation"
                            clavier:[]
                        }
                    ]
                    validations: {
                        c:"radio:4"
                    }
                    verifications: [{
                        radio:[ "]...;...[",    "]...;...]", "[...;...[", "[...;...]"]
                        name:"c"
                        tag:"Crochets"
                        good: goodCrochets
                    }]
                }
                {
                    bareme:50
                    title: "Bornes"
                    items: [
                        {
                            type:"text"
                            ps:[
                                "Indiquez les bornes à placer de part et d'autre de l'intervalle."
                            ]
                        }
                        {
                            type:"input"
                            format:[
                                { text: "$x\\in$", cols:2, class:"text-right" }
                                { text:crochetGauche, cols:1, class:"text-right h3"}
                                { name:"low", cols:3, latex:true }
                                { text:";", cols:1, class:"text-center h3"}
                                { name:"high", cols:3, latex:true }
                                { text:crochetDroite, cols:1, class:"h3"}
                            ]
                        }
                        {
                            type:"validation"
                            clavier:["infini"]
                        }
                    ]
                    validations:{
                        low:"number"
                        high:"number"
                    }
                    verifications: [
                        (pData)->
                            verLow = mM.verification.isSame(pData.low.processed, goodGauche)
                            verHigh = mM.verification.isSame(pData.high.processed, goodDroite)
                            verLow.goodMessage.text = "Borne gauche : "+verLow.goodMessage.text
                            verHigh.goodMessage.text = "Borne droite : "+verHigh.goodMessage.text
                            {
                                note: (verLow.note+verHigh.note)/2
                                add: {
                                    type: "ul"
                                    list: [{
                                        type:"normal"
                                        text: "Vous avez répondu &nbsp; $I_F=\\left#{crochetGauche}#{pData.low.processed.tex} ; #{pData.high.processed.tex}\\right#{crochetDroite}$"
                                    }].concat(verLow.errors, [verLow.goodMessage], verHigh.errors, [verHigh.goodMessage])
                                }
                            }
                    ]
                }
            ]
        init: (inputs) ->
            if inputs.e?
                [strnumbergauche, ineqgauche, ineqdroite, strnumberdoite] = inputs.e.split(';')
                gauche = if strnumbergauche == "" then null else mM.toNumber(strnumbergauche)
                droite = if strnumberdroite == "" then null else mM.toNumber(strnumberdroite)
            else
                a = (mM.exec [
                    mM.alea.number({min:1, max:30, sign:true})
                    if Math.random()>0.5 then 1 else mM.alea.number({min:2, max:10})
                    '/'
                    if Math.random()>0.8 then mM.alea.number({min:2, max:10}) else 1
                    'sqrt'
                    '*'
                ]).simplify()
                b = (mM.exec [
                    mM.alea.number({min:1, max:30, sign:true})
                    if Math.random()>0.5 then 1 else mM.alea.number({min:2, max:10})
                    '/'
                    if Math.random()>0.8 then mM.alea.number({min:2, max:10}) else 1
                    'sqrt'
                    '*'
                ]).simplify()

                [lower, greater] = if a.float() < b.float() then [a, b] else [b,a]
                eqlower = Math.random() > 0.5
                eqgreater = Math.random() > 0.5
                order = Math.random() < 0.8
                onlyone = Math.random() < 0.3
                ineqgauche = switch
                    when order and eqlower then "<="
                    when order then "<"
                    when not order and eqgreater then ">="
                    else ">"
                ineqdroite = switch
                    when order and eqgreater then "<="
                    when order then "<"
                    when not order and eqlower then ">="
                    else ">"
                [gauche, droite] = if order then [lower, greater] else [greater, lower]
                

                if onlyone
                    if Math.random() > 0.5
                        droite = null
                        ineqdroite = if order then "<" else ">"
                        inputs.e = [String gauche, ineqgauche, "", ""].join(';')
                    else
                        gauche = null
                        ineqgauche = if order then "<" else ">"
                        inputs.e = ["", "", ineqdroite, String droite].join(';')
                else
                    inputs.e = [String gauche, ineqgauche, ineqdroite, String droite].join(';')
            [gauche, ineqgauche, ineqdroite, droite]

        getExamBriques: (inputs_list,options) ->
            that = @
            fct_item = (inputs, index) ->
                [gauche, ineqgauche, ineqdroite, droite] = @init(inputs)
                texGauche = if gauche is null then "" else gauche.tex() + mM.misc.ineqSymbolStrToTex(ineqgauche)
                texDroite = if droite is null then "" else droite.tex() + mM.misc.ineqSymbolStrToTex(ineqdroite)
                tex = texGauche + " x " + texDroite
                return "$#{tex}$"

            return {
                children: [
                    {
                        type: "text",
                        children: [
                            "On donne des inéquations."
                            "Pour chacune donnez l'ensemble solution sous forme d'un intervalle."
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
                [gauche, ineqgauche, ineqdroite, droite] = @init(inputs)
                texGauche = if gauche is null then "" else gauche.tex() + mM.misc.ineqSymbolStrToTex(ineqgauche)
                texDroite = if droite is null then "" else droite.tex() + mM.misc.ineqSymbolStrToTex(ineqdroite)
                tex = texGauche + " x " + texDroite
                return "$#{tex}$"

            return {
                children: [
                    "On donne des inéquations."
                    "Pour chacune donnez l'ensemble solution sous forme d'un intervalle."
                    {
                        type: "enumerate",
                        children: _.map(inputs_list, fct_item)
                    }
                ]
            }

    }
