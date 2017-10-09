define(["backbone.radio"], function(Radio){

	var Session = Backbone.Model.extend({
		urlRoot: "api/session",
		initialize: function () {
			var that = this;
			// Hook into jquery
			// Use withCredentials to send the server cookies
			// The server must allow this through response headers
			$.ajaxPrefilter(function( options, originalOptions, jqXHR) {
				options.xhrFields = {
					withCredentials: true
				};
			});
		},

		validate: function(attrs, options){
			var errors = {};
			if (! attrs.identifiant){
				errors.identifiant = "L'email ne doit pas être vide";
			}
			if (! attrs.pwd){
				errors.pwd = "Le mot de passe ne doit pas être vide";
			}

			if(! _.isEmpty(errors)){
				return errors;
			}
		},

		parse: function(data){
			if (data.logged) {
				var logged = data.logged;
			} else {
				var logged = data;
			}
			if (!logged.nomClasse )
				logged.nomClasse = "N/A";
			logged.isRoot = (logged.rank == "Root");
			logged.isAdmin = (logged.rank == "Root") || (logged.rank == "Admin");
			logged.isProf = (logged.rank == "Prof");
			logged.isEleve = (logged.rank == "Élève");
			logged.logged_in = (logged.rank !="Off");
			if (logged.logged_in) {
				logged.nomComplet = logged.prenom+" "+logged.nom;
			} else {
				logged.nomComplet = "";
			}
			logged.isOff = !logged.logged_in;
			return logged;
		},

		refresh: function(data) {
			this.set(this.parse(data));
		},

		getAuth: function(callback) {
			// getAuth is wrapped around our router
			// before we start any routers let us see if the user is valid
			this.fetch({
				success: callback
			});
		}
	});

	var API = {
		getSession: function(callback){
			Auth = new Session();
			Auth.on("destroy", function(){
				this.unset("id");
			});
			Auth.getAuth(callback);
			return Auth;
		}
	};

	var channel = Radio.channel('session');
	channel.reply('session:entity', API.getSession );

	return ; // Pas nécessaire de retourner l'objet Session
});
