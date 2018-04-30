define ["marionette","app","jst"], (Marionette,app,JST)->
	Headers = Marionette.View.extend {
		template: window.JST["header/show/header-navbar"]
		triggers: {
			"click a.js-home": "home:show"
			"click a.js-edit-me": "home:editme"
			"click a.js-login": "home:login"
			"click a.js-logout": "home:logout"
			"click a.js-users": "users:list"
		}

		initialize: (options) ->
			options = options ? {};
			auth = _.clone(app.Auth.attributes)

			@isAdmin = auth.isAdmin ? false;
			@isProf = auth.isProf ? false;
			@isEleve = auth.isEleve ? false;
			@isOff = auth.isOff ? false;
			@nomComplet = auth.nomComplet ? "Déconnecté";

		serializeData: () ->
			{
				isAdmin: @isAdmin
				isProf: @isProf
				isEleve: @isEleve
				isOff: @isOff
				nomComplet: @nomComplet
				version: app.version
			}

		logChange: () ->
			@initialize()
			@render()

		onHomeShow: (e) ->
			app.trigger("home:show")

		onHomeEditme: (e) ->
			app.trigger("user:show",app.Auth.get("id"))

		onHomeLogin: (e) ->
			app.trigger("home:login")

		onHomeLogout: (e) ->
			app.trigger("home:logout")

		onUsersList: (e) ->
			app.trigger("users:list")

		spin: (set_on) ->
			if (set_on)
				$("span.js-spinner", @$el).html("<i class='fa fa-spinner fa-spin'></i>")
			else
				$("span.js-spinner", @$el).html("")
	}

	return Headers
