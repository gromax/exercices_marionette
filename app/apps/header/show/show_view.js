define(["marionette","app","jst"], function(Marionette,app,JST){
	var Headers = Marionette.View.extend({
		template: window.JST["header/show/header-navbar"],
		triggers: {
			"click a.js-home": "home:show",
			"click a.js-edit-me": "home:editme",
			"click a.js-login": "home:login",
			"click a.js-logout": "home:logout",
			"click a.js-users": "users:list",
		},

		initialize: function(options){
			var options = options || {};
			var auth = _.clone(app.Auth.attributes);

			this.isAdmin = auth.isAdmin || false;
			this.isProf = auth.isProf || false;
			this.isEleve = auth.isEleve || false;
			this.isOff = auth.isOff || false;
			this.nomComplet = auth.nomComplet || "Déconnecté";
		},

		serializeData: function(){
			return {
				isAdmin: this.isAdmin,
				isProf: this.isProf,
				isEleve: this.isEleve,
				isOff: this.isOff,
				nomComplet: this.nomComplet
			}
		},

		logChange: function(){
			this.initialize();
			this.render();
		},

		onHomeShow: function(e){
			app.trigger("home:show");
		},

		onHomeEditme: function(e){
			app.trigger("user:show",app.Auth.get("id"));
		},

		onHomeLogin: function(e){
			app.trigger("home:login");
		},

		onHomeLogout: function(e){
			app.trigger("home:logout");
		},

		onUsersList: function(e){
			app.trigger("users:list");
		},

		spin: function(set_on){
			if (set_on){
				$("span.js-spinner", this.$el).html("<i class='fa fa-spinner fa-spin'></i>");
			} else {
				$("span.js-spinner", this.$el).html("");
			}
		},
	});

	return Headers;
});
