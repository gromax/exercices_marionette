define ["marionette","app"], (Marionette,app)->

	API = {
		showHome: ->
			app.Ariane.reset []
			require ["apps/home/show/show_controller"], (showController)->
				showController.showHome()

		showLogin: ->
			if app.Auth.get("logged_in")
				require ["apps/home/show/show_controller"], (showController)->
					showController.showHome()
			else
				app.Ariane.reset [{text:"Connexion", link:"login", e:"home:login"}]
				require ["apps/home/login/login_controller"], (loginController) ->
					loginController.showLogin()

		showReLogin:(options) ->
			require ["apps/home/login/login_controller"], (loginController) ->
				loginController.showReLogin(options)

		showSignin: ->
			if app.Auth.get("logged_in")
				app.trigger("notFound")
			else
				app.Ariane.reset [{text:"Inscription", link:"rejoindre-une-classe", e:"home:signin"}]
				require ["apps/home/signin/signin_controller"], (signinController) ->
					signinController.showSignin()

		logout: ->
			if app.Auth.get("logged_in")
				closingSession = app.Auth.destroy()
				$.when(closingSession).done( (response)->
					# En cas d'échec de connexion, l'api server renvoie une erreur
					# Le delete n'occasione pas de raffraichissement des données
					# Il faut donc le faire manuellement
					app.Auth.refresh(response.logged)
					require ["apps/home/show/show_controller"], (showController) ->
						showController.showHome()
				).fail( (response)->
					alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/024]");
				)

		forgotten: (key)->
			if app.Auth.get("logged_in")
				app.trigger("notFound")
			else
				app.Ariane.reset [{text:"Réinitialisation de mot de passe"}]
				app.trigger("header:loading", true)
				require ["apps/home/show/show_controller"], (showController)->
					fetching = app.Auth.getWithForgottenKey(key)
					$.when(fetching).done( ()->
						showController.showLogOnForgottenKey(true)
					).fail( (response)->
						if response.status is 401
							showController.showLogOnForgottenKey(false)
						else
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/034]")
					).always( ()->
						app.trigger("header:loading", false)
					)
		casloginfailed: ->
			if app.Auth.get("logged_in")
				app.trigger("notFound")
			else
				app.Ariane.reset [{text:"Échec d'identification par l'ENT"}]
				app.trigger("header:loading", true)
				require ["apps/home/show/show_controller"], (showController)->
					showController.casloginfailed()
					app.trigger("header:loading", false)
	}

	app.on "home:show", ()->
		app.navigate("home")
		API.showHome()

	app.on "home:login", ()->
		app.navigate("login")
		API.showLogin()

	app.on "home:relogin", (options)->
		API.showReLogin(options)

	app.on "home:signin", ()->
		app.navigate("rejoindre-une-classe")
		API.showSignin()

	app.on "home:logout", ()->
		API.logout()
		app.trigger("home:show")

	Router = Marionette.AppRouter.extend {
		controller: API,
		appRoutes: {
			"" : "showHome"
			"home" : "showHome"
			"login" : "showLogin"
			"logout" : "logout"
			"rejoindre-une-classe": "showSignin"
			"forgotten::key": "forgotten"
			"casloginfailed": "casloginfailed"
		}
	}

	new Router()

	return

