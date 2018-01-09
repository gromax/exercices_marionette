define [], () ->
	Catalog =
		list : [
			{
				id:1
				filename:"exo0001"
				title:"Équation de droite"
				description:"Déterminer l'équation d'une droite passant par deux points."
				keyWords:["Géométrie", "Droite", "Équation", "Seconde"]
				options:{}
			}
			{
				id:2
				filename:"exo0002"
				title: "Milieu d'un segment"
				description: "Calculer les coordonnées du milieu d'un segment."
				keyWords: ["Géométrie", "Repère", "Seconde"]
				options:{}
			}
			{
				id:3
				filename:"exo0003"
				title:"Symétrique d'un point"
				description:"Calculer les coordonnées du symétrique d'un point par rapport à un autre point."
				keyWords : ["Géométrie", "Repère", "Seconde"]
				options:{}
			}
			{
				id:4
				filename:"exo0004"
				title:"Quatrième point d'un parallélogramme."
				description:"Connaissant trois points, calculer les coordonnées d'un quatrième point pour former un parallélogramme. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
				keyWords : ["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]
				options: {
					a:{
						tag:"Complexes"
						options:["non", "oui"]
					}
				}
			}
			{
				id:5
				filename:"exo0005"
				title:"Distance entre deux points."
				description:"Dans un repère orthonormé, calculer la distance entre deux points. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
				keyWords : ["Géométrie", "Repère", "Seconde", "Complexes", "1STL"]
				options: {
					a: {
						tag:"complexes"
						options:["non", "oui"]
					}
				}
			}
			{
				id:6
				filename:"exo0006"
				title: "Placer des points dans un repère"
				description:"Connaissant leurs coordonnées, placer des points dans un repère. L'exercice existe aussi dans une variante où les coordonnées sont données sous forme complexe."
				keyWords : ["Géométrie", "Repère", "Complexes", "Seconde", "1STL"]
				options: {
					a: {
						tag:"complexes"
						options: ["non", "oui"]
					}
				}
			}
			{
				id:7
				filename:"exo0007"
				title: "Image et antécédent avec un tableau de valeurs"
				description: "Un tableau de valeur d'une fonction est donné. Il faut déterminer une image et un antécédent."
				keyWords : ["Fonctions","Antécédent","Image","Seconde"]
				options: {}
			}
			{
				id:8
				filename:"exo0008"
				title: "Image et antécédent avec une courbe"
				description: "La courbe d'une fonction étant donnée, il faut déterminer un antécédent et une image."
				keyWords : ["Fonctions","Antécédent","Image","Seconde"]
				options: {}
			}
			{
				id:9
				filename:"exo0009"
				title: "Expression d'une fonction affine"
				description: "On connaît deux valeurs d'une fonction affine. Il faut en déduire l'expression de la fonction."
				keyWords : ["Analyse","Fonction","Expression","Affine","Seconde"]
				options: {}
			}
			{
				id:10
				filename:"exo0010"
				title: "*Équation du second degré"
				description: "Résoudre une équation du second degré."
				keyWords : ["Analyse","Trinome","Équation","Racines","Première"]
				options: {
					d: {
						tag: "Résoudre dans"
						options: ["Réels", "Complexes"]
					}
				}
			}
			{
				id:11
				filename:"exo0011"
				title: "*Équation somme et produit"
				description: "On connaît la somme et le produit de deux nombres, il faut calculer ces nombres."
				keyWords : ["Analyse","Trinome","Équation","Racines","Première"]
				options: {}
			}
			{
				id:12
				filename:"exo0012"
				title: "*Tracer la courbe d'une fonction affine"
				description: "L'expression d'une fonction affine étant donnée, il faut tracer sa courbe dans un repère."
				keyWords : ["Analyse","Fonction","Courbe","Affine","Seconde"]
				options: {}
			}
			{
				id:13
				filename:"exo0013"
				title: "Tracer une droite dont on connaît l'équation réduite"
				description: "On donne l'équation réduite d'une droite. Il faut tracer cette droite."
				keyWords : ["Géométrie","Droite","Équation","Seconde"]
				options: {}
			}
			{
				id:14
				filename:"exo0014"
				title:"Associer droites et fonctions affines"
				description:"On donne cinq fonctions affines et cinq droites. Il faut associer chaque fonction affine avec la droite qui la représente."
				keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
				options: {}
			}
			{
				id:23
				filename: "exo0023"
				title:"Équation de la tangente à une courbe"
				description:"Pour $x$ donné, on donne $f(x)$ et $f'(x)$. Il faut en déduire l'équation de la tangente à la courbe à l'abscisse $x$."
				keyWords:["Dérivation","Tangente","Équation","Première"]
				options: {}
			}
			{
				id:26
				filename: "exo0026"
				title: "Coordonnées d'un vecteur"
				description: "Calculer les coordonnées du vecteur entre deux points."
				keyWords:["Géométrie", "Repère", "Vecteur", "Seconde"]
				options: {}
			}
			{
				id:28
				filename: "exo0028"
				title:"Dériver une fonction"
				description:"Une fonction polynome est donnée, il faut la dériver."
				keyWords:["Analyse", "fonction", "Dérivation", "Première"]
				options: {
					a: {
						tag:"Avec ln ou exp"
						options:["Sans", "ln(x)", "ln(ax+b)", "exp(x)", "exp(ax)"]
					}
					d: {
						tag:"Degré max du polynôme"
						options:[0, 1, 2, 3, 4, 5]
					}
					e: {
						tag:"Tangente"
						options:["non", "oui"]
					}
				}
			}
			{
				id:30
				filename: "exo0030"
				title: "Suites et termes général et récurrence"
				description: "On donne l'expression de suites et il faut l'associer à la forme donnée par récurence."
				keyWords:["Analyse", "Suite", "Première"]
				options: {}
			}
			{
				id:31
				filename: "exo0031"
				title: "Conversion entre degré et radians"
				description: "Transformer une mesure en degrés en une mesure en radians et réciproquement."
				keyWords:["Géométrie", "Trigonométrie", "Seconde"]
				options: {}
			}
			{
				id:41
				filename: "exo0041"
				title: "Termes d'une suite explicite"
				description: "Calculer les termes d'une suite donnée explicitement."
				keyWords:["Analyse", "Suite", "Première"]
				options: {}
			}
			{
				id:51
				filename:"exo0051"
				title: "Loi uniforme"
				description:"Calculer des probabilités avec la loi uniforme."
				keyWords:["probabilités","uniforme","TSTL"]
				options: {
					a:{ tag:"Calcul $E(X)$" , options:["Oui", "Non"] }
					b:{ tag:"Calcul $\\sigma(X)$" , options:["Oui", "Non"] }
				}
			}
			{
				id:52
				filename:"exo0052"
				title: "Loi normale"
				description: "Calculer des probabilités avec la loi normale."
				keyWords : ["probabilités","normale","TSTL"]
				options: {}
			}
			{
				id:53
				filename:"exo0053"
				title: "Équations avec logarithme et exponentielle"
				description: "Résoudre des équations contenant des logarithmes et des exponentielles."
				keyWords:["logarithme","exponentielle","équation","TSTL"]
				options: {
					a:{ tag:"ln ou exp" , options:["ln()", "exp()", "e^()"]}
					b:{ tag:"équation", options:["f(ax+b)=f(cx+d)","a.f(x)+b = c.f(x)+d","a.f²(x)+...=0,","c.f(ax+b)+d=...","a.f²(ax+b)+...=0"]}
				}
			}
		]
		get: (id) ->
			idExo = Number id
			(exo for exo in @list when exo.id is idExo)[0]
		all: -> @list

	return Catalog
