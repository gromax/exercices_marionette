define(["backbone.radio"], function(Radio){
	var Classe = Backbone.Model.extend({
		urlRoot: "api/classes",

		defaults: {
			nomOwner: "",
			idOwner:"",
			nom: "",
			description: "",
			ouverte: false,
			pwd:"",
			date:"2000-01-01"
		},

		parse: function(data) {
			if( typeof data.ouverte == "string" ) {
				data.ouverte = (Number(data.ouverte)==1);
			}
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

	var API = {
		getClasseEntity: function(classeId){
			var classe = new Classe({id: classeId});
			var defer = $.Deferred();
			var response = classe.fetch();
			response.done(function(){
				defer.resolveWith(response,[classe]);
			});
			response.fail(function(){
				defer.rejectWith(response, arguments)
			});
			return defer.promise();
		}
	};

	var channel = Radio.channel('entities');
	channel.reply('classe:entity', API.getClasseEntity );

	return Classe;
});
