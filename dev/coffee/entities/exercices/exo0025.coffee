define ["utils/math","utils/help"], (mM, help) ->
#	id:25
#	title:"Loi binomiale : Intervalle de fluctuation"
#	description:"Calculer un intervalle de fluctuation."
#	keyWords:["probabilités","binomiale","Intervalle de fluctuation","Première"]

# debug : tex à faire

	return {
		init: (inputs,options) ->
			if (typeof inputs.n is "undefined") then n = inputs.n = mM.alea.real {min:20, max:100}
			else n = Number inputs.n
			if (typeof inputs.p is "undefined") then p = inputs.p = mM.alea.real({min:1, max:19})
			else p = Number inputs.p
			if (typeof inputs.nf is "undefined") then nf = inputs.nf = Math.min Xhigh+mM.alea.real({min:-2, max:2}), n
			else nf = Number inputs.nf
			{Xlow,Xhigh} = mM.intervalle_fluctuation.binomial(n,p/100)
			# Tableau pour l'étape 2
			Xdeb = Math.max(Xlow-mM.alea.real({min:1, max:3}),0)
			Xfin = Math.min(Xlow+mM.alea.real({min:1, max:3}),Xhigh)
			Xdeb2 = Math.max(Xhigh-mM.alea.real({min:1, max:3}),Xlow)
			Xfin2 = Math.min(Xhigh+mM.alea.real({min:1, max:3}),n)
			if Xdeb2<=Xfin then k_values = [Xdeb..Xfin2]
			else k_values = [Xdeb..Xfin].concat [Xdeb2..Xfin2]
			p_values = ( numToStr( mM.repartition.binomial(n,p/100,k),3 ) for k in k_values)
			flow=Xlow/n
			fhigh=Xhigh/n
			IF = mM.ensemble.intervalle "[", fixNumber(flow,2), fixNumber(fhigh,2), "]"

			[
				p
				n
				nf
				Xlow
				Xhigh
				k_values
				p_values
				IF
			]

		getBriques: (inputs, options) ->
			[p, n, nf, Xlow, Xhigh, k_values, p_values, IF] = @init(inputs,options)

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"Une usine fabrique des tuyaux en caoutchouc."
								"Le fabriquant affirme que #{p} % des tuyaux sont poreux. On prélève #{n} tuyaux dans la production."
								"On obtient #{nf} tuyaux poreux."
								"Donnez les résultats des calculs suivants :"
							]
						}
						{
							type:"input"
							rank: 2
							tag:"$E(X)=$"
							name:"esp"
							description:"Espérance à 0,01 près"
							good:n*p/100
							waited:"number"
							arrondi:-2
						}
						{
							type:"input"
							rank: 3
							tag:"$\\sigma(X)$"
							name:"std"
							description:"Écart-type à 0,001 près"
							good:Math.sqrt(n*p*(100-p))/100
							waited:"number"
							arrondi:-2
						}
						{
							type:"text"
							rank: 4
							ps:[
								"On cherche les bornes de l'intervalle de fluctuation."
								"Pour cela on va chercher &nbsp; $a$, c'est à dire la valeur de &nbsp; $k$ &nbsp; pour laquelle &nbsp; $P(X\\leqslant k)$ &nbsp; dépasse strictement &nbsp; $0,025=2,5\\,\\%$, et &nbsp; $b$, c'est à dire la valeur de &nbsp; $k$ &nbsp; pour laquelle &nbsp; $P(X\\leqslant k)$ &nbsp; dépasse ou atteint $0,975=97,5\\,\\%$."
								"On sait que &nbsp; $a$ &nbsp; doit être proche de &nbsp; $E(X)-2\\sigma(X)$ &nbsp; et que &nbsp; $b$ &nbsp; doit être proche de &nbsp; $E(X)+2\\sigma(X)$"
								"On donne le tableau suivant (pour faire gagner du temps car les valeurs du tableau peuvent être obtenues avec une calculatrice)"
							]
						}
						{
							type: "tableau"
							rank: 5
							entetes: false
							lignes: [
								_.flatten(["$x_i$", k_values])
								_.flatten(["$y_i$", p_values])
							]
						}
						{
							type:"input"
							rank: 4
							tag:"$a$"
							name:"a"
							description:"Borne inférieure"
							good:Xlow
							waited:"number"
						}
						{
							type:"input"
							rank: 5
							tag:"$b$"
							name:"b"
							description:"Borne supérieure"
							good:Xhigh
							waited:"number"
						}
						{
							type:"input"
							rank: 6
							tag:"$I_F$"
							name:"IF"
							description:"Intervalle de fluctuation à 0,01 près"
							good:IF
							waited:"ensemble"
							tolerance:0.005
						}


						{
							type:"text"
							rank: 7
							ps:[
								"On a obtenu #{nf} tuyaux poreux."
								"Faut-il accepter ou rejeter l'affirmation du fabriquant ?"
							]
						}
						{
							type:"radio"
							rank: 8
							tag:"Décision"
							name:"d"
							radio:[
								"Accepter"
								"Refuser"
							]
							good: if (nf>=Xlow) and (nf<=Xhigh) then 0 else 1
						}
						{
							type:"validation"
							rank: 9
							clavier:["aide"]
						}
						{
							type:"aide"
							rank: 10
							list: [
								"Épreuve élémentaire : Prélever un tuyau ; succès : Le tuyau est poreux ; probabilité du succès : &nbsp; $p=#{p}\\,\\%$"
								"L'expérience est répétée &nbsp; $n=#{n}$ &nbsp; fois de façon indépendante (production assez importante)."
								"$X$ &nbsp; est le nombre de succès (tuyaux poreux). On peut donc dire que &nbsp; $X$ &nbsp; suit une loi binomiale &nbsp; $\\mathcal{B}(#{n} ; #{p}\\,\\%)$."
								"L'espérance est la valeur attendue. Si on a un fréquence &nbsp; $p\\,\\%$ &nbsp; de tuyaux poreux dans la production, si on prélève &nbsp; $n$ &nbsp; tuyaux, on s'attend à obtenir &nbsp; $E(X)=n\\times p$ &nbsp; tuyaux poreux en moyenne."
								"Naturellement, le nombre de tuyau réellement obtenu dans un prélèvement va varier aléatoirement. Pour un résultat donné, pour savoir s'il est loin ou proche de la valeur attendue, on utilise l'écart-type qui se cacule : &nbsp; $\\sigma(X)=\\sqrt{np(1-p)}$. Jusqu'à &nbsp; $2\\sigma$, on est assez proche de la valeur espérée. Au-delà de &nbsp; $2\\sigma$, on est loin."
							].concat(help.proba.binomiale.IF_1)
						}


					]
				}
			]


	}
