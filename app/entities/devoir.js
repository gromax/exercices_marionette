define([], function(){
	var Item = Backbone.Model.extend({
		urlRoot: "api/devoirs",

		defaults: {
			nomOwner: false,
			idOwner:"",
			nom: "",
			description: "",
			visible: false,
			actif: false,
			date:"2000-01-01"
		},

		toJSON: function(){
			return _.pick(this.attributes, 'id', 'idOwner', 'nom', 'description', 'visible', 'actif');
		},

		parse: function(data){
			if (data.id) {
				data.id = Number(data.id);
			}
			data.idOwner = Number(data.idOwner);
			data.actif = (data.actif == "1") || (data.actif==1) || (data.actif===true);
			data.visible = (data.visible == "1") || (data.visible==1) || (data.visible===true);
			return data;
		},

		validate: function(attrs, options){
			var errors = {};
			if (! attrs.nom){
				errors.nom = "Ne doit pas être vide";
			}
			else {
				if (attrs.nom.length<2){
					errors.nom = "Trop court";
				}
			}
			if(! _.isEmpty(errors)){
				return errors;
			}
		}
	});

	return Item;
});
