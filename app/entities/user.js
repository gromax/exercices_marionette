define(["backbone.radio"], function(Radio){
	var User = Backbone.Model.extend({
		urlRoot: "api/users",

		defaults: {
			prenom: "",
			nom: "",
			email: "",
			nomClasse: "N/A",
			rank:"Off"
		},

		parse: function(data){
			if (data.nomClasse == null)
				data.nomClasse = "N/A";
			data.nomComplet = data.nom+" "+data.prenom;
			return data;
		},

		validate: function(attrs, options){
			var errors = {};
			if (! attrs.prenom){
				errors.prenom = "Ne doit pas être vide";
			}
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
		getUserEntity: function(userId){
			var user = new User({id: userId});
			var defer = $.Deferred();
			var response = user.fetch();
			response.done(function(){
				defer.resolveWith(response,[user]);
			});
			response.fail(function(){
				defer.rejectWith(response, arguments)
			});
			return defer.promise();
		}
	};

	var channel = Radio.channel('users');
	channel.reply('user:entity', API.getUserEntity );

	return User;
});
