exercices - version de développement avec Marionette.js
==
Installation (Ubuntu)
-

* Télécharger la base de données
* Modifier le fichier de config
* Si ce n'est déjà fait, installer "sudo apt-get install nodejs-legacy npm" si ce n'est déjà fait. "node -v" et "npm -v" pour vérifier le bon fonctionnement
* Si ce n'est déjà fait, installer Bower : "npm install –g bower" et "bower -h" pour vérifier
* "bower install" pour installer les dépendances indiquées dans bower.json
* "npm install" pour installer les dépendances indiquées dans package.json
* compiler avec "grunt coffee" et "grunt jst"

Dépendances pas gérées
-
Le dossier vendor2 contient des dépendances que je n'ai pas su mettre avec bower.json :
* spin.jquery.js
* spin.js

Il faut télécharger à la main dans vendor :
* mathquill-0.10.1
* font-awesome-4.7.0
* bootstrap 4 ?

Dans css, j'ai déplacé :
* animate.css



Problème
-
* Dans bootstrap.js, il y a un require popper.js qui ne passe pas car je ne peux pas mettre popper.js dans le require_main, le js ne passe pas. Donc il faut modifier le bootstrap.js et mettre popper au lieu de popper.js

Exercices à faire
-
* Calculs d'intégrale
* Calculs de X tels qu'on a une proba (6,7 page 288 du livre)
* Graphiquement std et moyenne sur un graphique en batons / id avec une loi normale
* somme termes suite géométrique
* produit scalaire avec normes et angle
* produit scalaire, déterminer un angle
* produit scalaire dans un rectangle
* produit scalaire : côté dans un quadrilatère en utilisant sin A/a
* produit scalaire : coordonnées à déterminer pour avoir u.v = 0

