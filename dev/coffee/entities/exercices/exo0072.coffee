define ["utils/math","utils/help"], (mM, help) ->

	return {
		init: (inputs, degMax=3) ->
			if typeof inputs.fct is "undefined"
				fct = mM.alea.poly { degre:{min:2, max:degMax }, coeffDom:[1,2,3], values:{ min:-10, max:10} }
			else
				fct = mM.parse(inputs.fct)
			if typeof inputs.a is "undefined"
				a = mM.alea.real {min:-10, max:10}
			else
				a = Number inputs.a
			if typeof inputs.h is "undefined"
				h = mM.alea.in [0.1, 0.5, 1, 2, 5]
			else
				h = Number inputs.h
			poly = mM.polynome.make fct
			ao = mM.toNumber(a)
			aho = mM.exec [a, h, "+"], {}
			fa = poly.calc(ao)
			fah = poly.calc(aho)
			m = mM.exec [fah, fa, "-", h, "/"], { simplify:true}
			hSymb = mM.exec ["Symbol:h"], {}
			ahsymb = mM.exec [a, hSymb, "+"], {}
			polyh = poly.calc(ahsymb).developp().simplify()
			mhGood = mM.exec [polyh, fa, "-", hSymb, "/"], { developp:true, simplify:true }
			der = mM.assignValueToSymbol(mhGood, {h:0})
			[
				a
				h
				fct
				m
				polyh
				mhGood
				der
			]

		getBriques: (inputs, options) ->
			dOpt = Number(options.d?.value ? 0) is 1
			if dOpt then degMax = 2 else degMax = 3
			[a, h, fct, m, polyh, mhGood, der] = @init(inputs, degMax)
			str_h = mM.misc.numToStr(h)
			list = [
				{
					bareme:100
					items:[
						{
							type: "text"
							ps: [
								"On considère une fonction &nbsp; $f$ &nbsp; définie par :"
								"$f(x)=#{fct.tex()}$."
								"Donnez &nbsp; $m$, le taux d'accroissement de &nbsp; $f$ &nbsp; entre &nbsp; $a$ &nbsp; et &nbsp; $a+h$."
								"On prendra &nbsp; $a = #{a}$ &nbsp; et &nbsp; $h = #{str_h}$."
								"Arrondissez à 0,001 près."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$m =$", cols:3, class:"text-right" }
								{ name:"m", cols:5, description: "Taux d'accroissement" }
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: ["Le taux d'accroissement est &nbsp; $m=\\frac{f(a+h) - f(a)}{h}$ &nbsp; avec dans cet exemple &nbsp; $a=#{a}$ &nbsp; et &nbsp; $h=#{str_h}$."]
						}
					]
					validations:{
						m:"number"
					}
					verifications:[
						{
							name:"m"
							tag:"m"
							good:m
							parameters: {
								arrondi:-3
							}
						}
					]
				}
			]

			if dOpt
				list.push {
					bareme:100
					title: "Calcul de $f(a+h)$"
					items:[
						{
							type:"text"
							ps: [
								"Gardez la même valeur &nbsp; $a=#{a}$, mais maintenant considérons &nbsp; $h$ &nbsp; quelconque."
								"Donnez l'expression de &nbsp; $f(a+h)$."
								]
						}
						{
							type: "input"
							format: [
								{ text:"$f(a+h) =$", cols:3, class:"text-right" }
								{ name:"fah", cols:7, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["pow"]
						}
					]
					validations:{
						fah:"number"
					}
					verifications:[
						{
							name:"fah"
							tag:"$f(a+h)$"
							good:polyh
						}
					]
				}
				list.push {
					bareme:100
					title: "Taux d'accroissement pour h quelconque"
					items:[
						{
							type:"text"
							ps: [
								"En utilisant le calcul que vous venez de faire, calculez le taux d'accroissement pour &nbsp; $h$ &nbsp; quelconque."
								"Simplifiez en considérant que &nbsp; $h \\neq 0$."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$m =$", cols:3, class:"text-right" }
								{ name:"mh", cols:7, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["pow", "aide"]
						}
						{
							type: "aide"
							list: ["Le taux d'accroissement est toujours &nbsp; $m=\\frac{f(a+h) - f(a)}{h}$ &nbsp; mais cette fois &nbsp; $h$ &nbsp; est inconnu. Il ne doit plus rester de terme sans &nbsp; $h$ &nbsp; au numérateur de sorte que la simplification est toujours possible."]
						}
					]
					validations:{
						mh:"number"
					}
					verifications:[
						{
							name:"mh"
							tag:"$m$"
							good:mhGood
						}
					]
				}
				list.push {
					bareme:50
					title: "Nombre dérivée"
					items:[
						{
							type:"text"
							ps: [
								"En utilisant le résultat précédent, dites vers quelle valeur s'approche &nbsp; m &nbsp; quand &nbsp; $h\\to 0$."
							]
						}
						{
							type: "input"
							format: [
								{ text:"$m \\to$", cols:3, class:"text-right" }
								{ name:"der", cols:5, latex:true }
							]
						}
						{
							type: "validation"
							clavier: ["aide"]
						}
						{
							type: "aide"
							list: ["Il suffit de considérer &nbsp; $h &nbsp; si petit qu'on peut aussi bien faire comme si c'était 0 (sauf que ce n'est pas vraiment 0...)"]
						}
					]
					validations:{
						der:"number"
					}
					verifications:[
						{
							name:"der"
							tag:"$m \\to$"
							good:der
						}
					]
				}
			return list



		getExamBriques: (inputs_list,options) ->
			that = @
			fct_item = (inputs, index) ->
				[a, h, fct, m, polyh,mhGood, der] = that.init(inputs,options)
				namef = "f_#{index}"
				str_h = mM.misc.numToStr(h)
				return "$#{namef}(x) = #{fct.tex()}$ &nbsp; avec &nbsp; $a = #{a}$ &nbsp; et &nbsp; $h = #{str_h}$."

			dOpt = Number(options.d?.value ? 0) is 1

			if dOpt
				return {
					children: [
						{
							type: "text",
							children: [
								"On considère des fonctions et des valeurs de &nbsp; $a$ &nbsp; et &nbsp; $h$."
								"Dans chaque cas :"
							]
						}
						{
							type: "enumerate",
							enumi:"a",
							children: [
								"Donnez le taux d'accroissement de la fonction entre &nbsp; $a$ &nbsp; et &nbsp; $a+h$, arrondissez à 0,001 près."
								"Pour &nbsp; $h$ &nbsp; quelconque, calculez &nbsp; $f(a+h)$, puis le taux d'accroissement de la fonction entre &nbsp; $a$ &nbsp; et &nbsp; $a+h$."
								"Déterminez ce taux pour &nbsp; $h\\to 0$."
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
			else
				return {
					children: [
						{
							type: "text",
							children: [
								"On considère des fonctions et des valeurs de &nbsp; $a$ &nbsp; et &nbsp; $h$."
								"Dans chaque cas, donnez le taux d'accroissement de la fonction entre &nbsp; $a$ &nbsp; et &nbsp; $a+h$."
								"Arrondissez à 0,001 près."
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
				[a, h, fct, m, polyh,mhGood, der] = that.init(inputs,options)
				namef = "f_#{index}"
				str_h = mM.misc.numToStr(h)
				return "$#{namef}(x) = #{fct.tex()}$ avec $a = #{a}$ et $h = #{str_h}$."

			dOpt = Number(options.d?.value ? 0) is 1

			if dOpt
				return {
					children: [
						"On considère des fonctions et des valeurs de $a$ et $h$."
						"Dans chaque cas :"
						{
							type: "enumerate",
							enumi:"a",
							children: [
								"Donnez le taux d'accroissement de la fonction entre $a$ et $a+h$, arrondissez à 0,001 près."
								"Pour $h$ quelconque, calculez $f(a+h)$, puis le taux d'accroissement de la fonction entre $a$ et $a+h$."
								"Déterminez ce taux pour $h\\to 0$."
							]
						}
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}
			else
				return {
					children: [
						"On considère des fonctions et des valeurs de $a$ et $h$."
						"Dans chaque cas, donnez le taux d'accroissement de la fonction entre $a$ et $a+h$."
						"Arrondissez à 0,001 près."
						{
							type: "enumerate",
							children: _.map(inputs_list, fct_item)
						}
					]
				}


	}
