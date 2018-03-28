define ["utils/math","utils/help"], (mM, help) ->
#	id:20
#	title:"Moyenne et écart-type"
#	description:"Une série statistique est donnée. Il faut calculer sa moyenne et son écart-type."
#	keyWords:["Statistiques","Moyenne","Écart-type","Première"]

# debug : tex à faire

	return {
		init: (inputs, options) ->
			if (typeof inputs.table is "undefined")
				resolution = mM.alea.real [0.5, 1, 5, 10]
				std = mM.alea.real({min:100, max:200})/100*resolution
				moy = mM.alea.real({min:4, max:10})*std
				min = quantifyNumber(moy,resolution) - 5*resolution
				max = quantifyNumber(moy,resolution) + 5*resolution
				N = mM.alea.real({min:50, max:200})
				table = ( mM.alea.real { gaussian: { moy:moy, std:std, min:min, max:max, delta:resolution} } for i in [1..N] )
				serie = new SerieStat( table )
				serie.countEffectifs()
				inputs.table = serie.storeInString()
			else
				serie = new SerieStat(inputs.table)
			serie

		getBriques: (inputs, options) ->
			serie = @init(inputs, options)
			serie_stringArray = serie.toStringArray()

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							rank: 1
							ps:[
								"On considère la série statistique donnée par le tableau suivant."
								"Donnez l'effectif total, la moyenne et l'écart-type de cette série."
								"Vous arrondirez à 0,1 près."
							]
						}
						{
							type: "tableau"
							rank: 2
							entetes: false
							lignes: [
								_.flatten(["Valeurs", (item.value for item in serie_stringArray) ])
								_.flatten(["Effectifs", (item.effectif for item in serie_stringArray) ])
							]
						}
						{
							type: "input"
							rank: 3
							waited: "number"
							name:"N"
							tag:"$N$"
							description: "Effectif total"
							good: serie.N()
						}
						{
							type: "input"
							rank: 4
							waited: "number"
							name:"m"
							tag:"$\\overline{x}$"
							description: "Moyenne"
							good: serie.moyenne()
							arrondi: -1
						}
						{
							type: "input"
							rank: 5
							waited: "number"
							name:"std"
							tag:"$\\sigma$"
							description: "Écart-type"
							good: serie.std()
							arrondi: -1
						}
						{
							type: "validation"
							rank: 7
							clavier: ["aide"]
						}
						{
							type: "aide"
							rank: 8
							list: help.stats.N.concat(help.stats.moyenne, help.stats.ecart_type)
						}
					]
				}
			]
	}
