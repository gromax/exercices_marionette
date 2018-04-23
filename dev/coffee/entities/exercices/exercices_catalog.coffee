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
				title: "Équation du second degré"
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
				title: "Équation somme et produit"
				description: "On connaît la somme et le produit de deux nombres, il faut calculer ces nombres."
				keyWords : ["Analyse","Trinome","Équation","Racines","Première"]
				options: {}
			}
			{
				id:12
				filename:"exo0013"
				title: "Tracer la courbe d'une fonction affine"
				description: "L'expression d'une fonction affine étant donnée, il faut tracer sa courbe dans un repère."
				keyWords : ["Analyse","Fonction","Courbe","Affine","Seconde"]
				options: {}
				fixedSettings: { affine:true }
			}
			{
				id:13
				filename:"exo0013"
				title: "Tracer une droite dont on connaît l'équation réduite"
				description: "On donne l'équation réduite d'une droite. Il faut tracer cette droite."
				keyWords : ["Géométrie","Droite","Équation","Seconde"]
				options: {}
				fixedSettings: { affine:false }
			}
			{
				id:14
				filename:"exo0015"
				title:"Associer droites et fonctions affines"
				description:"On donne cinq fonctions affines et cinq droites. Il faut associer chaque fonction affine avec la droite qui la représente."
				keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
				options: {
					n:{ tag:"Nombre de courbes" , options:["3", "4", "5", "6", "7"] }
				}
				fixedSettings: { affine:true }
			}
			{
				id:15
				filename:"exo0015"
				title:"Associer droites et équations réduites"
				description:"On donne des équations réduites et des droites. Il faut associer chaque équation avec la droite qui la représente."
				keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
				options: {
					n:{ tag:"Nombre de courbes" , options:["3", "4", "5", "6", "7"] }
				}
				fixedSettings: { affine:false }
			}
			{
				id:16
				filename:"exo0016"
				title:"Associer courbes et fonctions du second degré"
				description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer la parabole qui la représente."
				keyWords:["Analyse","Fonction","Courbe","Second degré","Seconde"]
				options:{}
			}
			{
				id:17
				filename:"exo0017"
				title:"Associer courbes et fonctions du second degré"
				description:"Cinq paraboles sont données. On propose cinq fonctions du second degré dont on ne connait que le discriminant et le coefficient du terme de second degré. À chaque fonction, il faut attribuer la parabole qui la représente."
				keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
				options:{}
			}
			{
				id:18
				filename:"exo0018"
				title:"Tracer la courbe d'une fonction $x\\mapsto |ax+b|$"
				description:"On donne l'expression d'une fonction affine avec une valeur absolue. Il faut tracer sa courbe représentative."
				keyWords:["Analyse","Fonction","Courbe","Affine","Seconde"]
				options:{}
			}
			{
				id:19
				filename: "exo0019"
				title:"Inéquation du second degré"
				description:"Il faut résoudre une inéquation du second degré."
				keyWords:["Analyse","Trinome","Équation","Racines","Première"]
				options: {}
			}
			{
				id:20
				filename: "exo0020"
				title:"Moyenne et écart-type"
				description:"Une série statistique est donnée. Il faut calculer sa moyenne et son écart-type."
				keyWords:["Statistiques","Moyenne","Écart-type","Première"]
				options: {}
			}
			{
				id:21
				filename: "exo0021"
				title:"Médiane et quartiles"
				description:"Une série statistique est donnée. Il faut calculer le premier quartile, la médiane et le troisième quartile."
				keyWords:["Statistiques","Médiane","Quartile","Seconde"]
				options: {}
			}
			{
				id:22
				filename: "exo0022"
				title:"Développer une expression"
				description:"Une expression est donnée, il faut la développer."
				keyWords:["Algèbre", "fonction"]
				options: {
					a:{
						tag:"Difficulté",
						options:["Alea", "Facile", "Facile avec fraction", "Moyen", "Moyen avec fraction"]
					}
				}
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
				id:24
				filename: "exo0024"
				title:"Loi binomiale"
				description:"Calculer des probabilités avec la loi binomiale."
				keyWords:["probabilités","binomiale","Première"]
				options: {}
			}
			{
				id:25
				filename: "exo0025"
				title:"Loi binomiale : Intervalle de fluctuation"
				description:"Calculer un intervalle de fluctuation."
				keyWords:["probabilités","binomiale","Intervalle de fluctuation","Première"]
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
				id:27
				filename: "exo0027"
				title: "Calculs avec les complexes"
				description: "Faire les calculs de base avec les complexes."
				keyWords:["Géométrie", "Complexe", "Première"]
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
				id:29
				filename: "exo0029"
				title:"Équation du premier degré"
				description:"Résoudre une équation du premier degré."
				keyWords:["Affine","Algèbre","Équation","Seconde"]
				options: {}
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
				id:32
				filename: "exo0032"
				title: "Mesure principale d'un angle"
				description: "La mesure d'un angle est donnée en radians. Il faut donner sa mesure principale."
				keyWords:["Géométrie", "Trigonométrie", "Seconde"]
				options: {}
			}
			{
				id:33
				filename: "exo0033"
				title:"Équation modulo $2\\pi$"
				description:"Résoudre une équation portant sur des mesures angulaires en radians, avec un terme $2k\\pi$."
				keyWords:["Trigonométrie","Algèbre","Équation","Première"]
				options: {}
			}
			{
				id:34
				filename: "exo0034"
				title:"Équation de type $\\cos x = \\cos \\alpha$"
				description:"Résoudre une équation de la forme $\\cos x = \\cos \\alpha$ $\\sin x = \\sin \\alpha$."
				keyWords:["Trigonométrie","Algèbre","Équation","Première"]
				options: {}
			}
			{
				id:35
				filename: "exo0035"
				title:"Équation de type $\\cos (a\\cdot x+b) = \\cos \\alpha$"
				description:"Résoudre une équation de la forme $\\cos x = \\cos \\alpha$ $\\sin x = \\sin \\alpha$."
				keyWords:["Trigonométrie","Algèbre","Équation","Première"]
				options: {}
			}

			{
				id:36
				filename: "exo0036"
				title:"Placer des points sur le cercle trigonométrique"
				description:"Placer sur le cercle trigonométrique le point correspondant à une mesure donnée en radians."
				keyWords:["Trigonométrie", "Première", "Radians", "Seconde"]
				options: {}
			}
			{
				id:37
				filename: "exo0037"
				title:"Dérivée d'une fonction trigonométrique"
				description:"Dériver une fonction de la forme &nbsp; $f(t)=A\\sin(\\omega t+\\varphi)$."
				keyWords:["Dérivation","Trigonométrie","Première"]
				options: {}
			}
			{
				id:38
				filename: "exo0038"
				title: "Choix de la meilleure forme"
				description: "Une fonction du second degré est donnée sous différentes formes. Vous devez utiliser la plus appropriée meilleure pour répondre à différentes questions."
				keyWords:["Analyse", "Second degré", "Seconde"]
				options: {}
			}
			{
				id:39
				filename: "exo0039"
				title:"Associer tableaux de variations et fonctions du second degré"
				description:"Cinq paraboles et cinq fonctions du second degré sont données. À chaque fonction, il faut attribuer le tableau qui lui correspond."
				keyWords:["Analyse","Fonction","Tableau de variation", "Forme canonique", "Second degré","Seconde"]
				options: {}
			}
			{
				id:40
				filename: "exo0040"
				title:"Somme de fractions"
				description:"Ajouter des fractions et simplifier le résultat."
				keyWords:["Calcul","Collège","Fraction"]
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
				id:42
				filename: "exo0042"
				title: "Termes d'une suite récurrente"
				description: "Calculer les termes d'une suite donnée par récurence."
				keyWords:["Analyse", "Suite", "Première"]
				options: {}
			}
			{
				id:43
				filename: "exo0043"
				title: "Suites et intérêts composés"
				description: "On donne le rendement annuel d'un placement. On cherche à savoir au bout de combien de temps on aura doublé le capital initial."
				keyWords:["Analyse", "Suite", "Première"]
				options: {}
			}
			{
				id:44
				filename: "exo0044"
				title: "De la forme algébrique à la forme trigonométrique"
				description: "On vous donne un nombre complexe sous sa forme algébrique. vous devez trouver sa forme trigonométrique, c'est à dire son module et son argument."
				keyWords:["Géométrie", "Complexe", "Première"]
				options: {}
			}
			{
				id:45
				filename: "exo0045"
				title: "De la forme trigonométrique à la forme algébrique"
				description: "On vous donne un nombre complexe sous sa forme trigonométrique. vous devez trouver sa forme algébrique."
				keyWords:["Géométrie", "Complexe", "Première"]
			}
			{
				id:46
				filename: "exo0046"
				title: "Calcul d'un angle avec les complexes"
				description: "Trois points A,B et C sont donnés. Il faut trouver l'angle $\\widehat{BAC}$."
				keyWords:["Géométrie", "Complexe", "Première"]
				options: {}
			}
			{
				id:47
				filename: "exo0047"
				title: "Calcul de l'aire d'un parallélogramme avec les complexes"
				description: "Quatre points A, B, D sont donnés. On sait que $ABCD$ est un parallélogramme. Il faut trouver l'aire de $ABCD$."
				keyWords:["Géométrie", "Complexe", "Première"]
				options: {}
			}
			{
				id:48
				filename: "exo0048"
				title: "Reconnaître les courbes fonction / dérivée ou fonction / primitive"
				description: "On donne la courbe d'une fonction $f$ et la courbe de sa dérivée $f'$ (ou de sa primitive $F$), il faut reconnaître quelle courbe correspond à $f$ et quelle courbe correspond à $f'$ (ou $F$)."
				keyWords:["Analyse", "Déerivation", "Première", "Primitive", "Terminale"]
				options: {
					a:{ tag:"Dérivée ou Primitive" , options:["Dérivée", "Primitive"] }
				}
			}
			{
				id:49
				filename: "exo0049"
				title:"Donnez la primitive d'une fonction"
				description:"Une fonction polynome est donnée, il faut donner sa primitive."
				keyWords:["Analyse", "fonction", "Primitive", "Terminale"]
				options: {}
			}
			{
				id:50
				filename: "exo0050"
				title:"Ajustement par la méthode des moindres carrés"
				description:"On vous donne une série statistique à deux variables $(x;y)$. Vous devez déterminer un ajustement de $y$ en $x$ par la méthode des moindres carrés."
				keyWords:["Statistiques","Ajustement","carré","TSTL","BTS"]
				options: {
					a:{ tag:"Coordonnées du point moyen" , options:["Non", "Oui"] }
					b:{ tag:"Changement de variable" , options:["Non", "Oui"] }
					c:{ tag:"Calcul d'interpolation" , options:["Non", "Oui"] }
				}
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
			{
				id:54
				filename: "exo0054"
				title: "Équations différentielles du premier ordre"
				description: "Résoudre des équations différentielles du premier ordre, avec coefficients constant et second membre."
				keyWords: ["exponentielle","équation","TSTL","BTS"]
				options: {
					a:{ tag:"second membre" , options:["u' exp(-b/a.t)+Y", "u' exp(-b/a.t)", "Y", "u' exp(-b/a.t) OU Y"]}
				}
			}
			{
				id:55
				filename: "exo0055"
				title:"Calculer une intégrale"
				description:"Calculer l'intégrale d'une fonction polynôme."
				keyWords:["Analyse", "fonction", "Primitive", "Intégrale", "Terminale"]
				options: {}
			}
			{
				id:56
				filename: "exo0056"
				title:"Intervalle de fluctuation asymptotique"
				description:"Dans le cadre de l'approximation d'une loi Binomiale par une loi Normale, calculer un intervalle de fluctuation asymptotique et prendre une décision."
				keyWords:["probabilités","binomiale","normale", "Intervalle de fluctuation","TSTL"]
				options: {}
			}
			{
				id:57
				filename: "exo0057"
				title:"Aire sous une courbe"
				description:"La courbe d'une fonction est donnée. Il faut déterminer l'aire sous la courbe."
				keyWords:["Intégrale","Analyse","Primitive", "TSTL"]
				options: {}
			}
		]
		get: (id) ->
			idExo = Number id
			(exo for exo in @list when exo.id is idExo)[0]
		all: -> @list

	return Catalog
