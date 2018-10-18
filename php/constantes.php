<?php
	define("PATH_TO_MEEKRODB", "./php/meekrodb/db.class.php");
	define("PATH_TO_CLASS", "./php/class");

	// Chemin du dossier
	define("BDD_CONFIG","./config/bddConfig.php");

	// Utilisateurs
	define("PSEUDO_MIN_SIZE", 6);
	define("PSEUDO_MAX_SIZE", 20);

	// Classes
	define("NOMCLASSE_MIN_SIZE", 3);
	define("NOMCLASSE_MAX_SIZE", 20);

	// mails
	define("PSEUDO_FROM","Exercices de maths");
	define("EMAIL_FROM","exercices@goupill.fr");
	define("PATH_TO_SITE","http://exercices.goupill.fr");
	define("NOM_SITE","Exercices de maths sur goupill.fr");
	define("SMTP_PASSWORD","zwdHpjudYfv3CbEbt8Aa");
	define("SMTP_USER","exercices@goupill.fr");
	define("SMTP_HOST","mail.goupill.fr");
	define("SMTP_PORT",465);

	// cas
	define("PATH_TO_AUTH", "http://exercices.goupill.fr/api/auth");
	define("PATH_TO_ENT_CAS","https://ent.iledefrance.fr/cas/login?service=http://exercices.goupill.fr/api/auth");
	define("PATH_TO_ENT_CAS_VALIDATE","https://ent.iledefrance.fr/cas/serviceValidate");
	define("CAS_MAIL_DOMAIN","ent.iledefrance.fr");

	// Calcul de notes
	//define("POIDS_GEO", 0.8);
	define("N_EXO_SUP", 5); // Nombre d'exercices encore pris en compte au-delà de la quantité à faire

	// debug
	define("DEBUG",true);
	define("DEBUG_TEMPLATES",true);
	define("BDD_DEBUG_ON",true);
	define("SAVE_CLASSES_IN_SESSION",true);




?>
