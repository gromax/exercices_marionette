define ["utils/math","utils/help"], (mM, help) ->
	#id:52
	#title:"Loi normale"
	#description:"Calculer des probabilités avec la loi normale."

	Controller =
		init: (inputs, options) ->
			if (typeof inputs.std is "undefined") then inputs.std = mM.alea.real { min:1, max:50 }
			std = Number inputs.std
			if (typeof inputs.mu is "undefined") then inputs.mu = mM.alea.real({min:0, max:10, coeff:std})
			mu = Number inputs.mu
			# Symbole d'inégalité à gauche
			symbs = ["","<","\\leqslant"]
			if (typeof inputs.sa is "undefined") then inputs.sa = mM.alea.real [0,1,2]
			sa = Number inputs.sa
			if sa is 0
				Xa = -1000*std+mu
				a = -101 # utile pour le calcul de b
				ens = "X"
			else
				if (typeof inputs.a is "undefined") then inputs.a = mM.alea.real({min:-100, max:80})
				a = Number inputs.a
				Xa = Math.floor(a*2*std)/100+mu
				ens = "#{mM.misc.numToStr(Xa,2)} #{symbs[sa]} X"
			if (typeof inputs.sb is "undefined")
				if sa is 0 then inputs.sb = mM.alea.real([1,2])
				else inputs.sb = mM.alea.real([0,1,2])
			sb = Number inputs.sb
			if sb is 0 then Xb = 1000*std+mu
			else
				if (typeof inputs.b is "undefined") then inputs.b = mM.alea.real({min:a+1, max:100})
				b = Number inputs.b
				Xb = Math.floor(b*2*std)/100+mu
				ens = "#{ens} #{symbs[sb]} #{mM.misc.numToStr(Xb,2)}"

			return {
				inputs: inputs
				briques: [
					{
						bareme:100
						title:"Calculs de probabilités"
						items:[
							{
								type:"text"
								rank: 1
								ps:[
									"La variable aléatoire $X$ suit la <b>loi normale</b> de moyenne $\\mu = #{mu}$ et d'écart-type $\\sigma = #{std}$."
									"<b>Remarque :</b> on note $\\mathcal{N}(#{mu};#{std})$ cette loi."
								]
							}
							{
								type:"input"
								rank: 2
								tag:"$p(#{ens})$"
								name:"pX"
								description:"Valeur à 0,01 près"
								good: mM.repartition.gaussian {min:Xa, max:Xb}, { moy:mu, std:std }
								waited: "number"
								arrondi: -2
							}
							{
								type:"validation"
								rank: 3
								clavier:["aide"]
							}
							{
								type:"aide"
								rank: 4
								list: help.proba.binomiale.calculette
							}
						]
					}
				]
			}

	return Controller
