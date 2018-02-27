define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/run/devoir-panel"],
		serializeData:function(){
			var data = _.clone(this.model.attributes);
			// Il faut fournir actif, nomFiche et description
			if (data.nomFiche){
				// C'est un userfiche d'élève
				data.actif = data.actif && data.ficheActive;
			} else {
				// C'est une fiche dans le cadre d'un affichage prof
				data.nomFiche = data.nom;
			}
			data.profMode = (this.options.profMode == true);
			return data;
		},
	});

	return Panel;
});
