define [
	"app",
	"marionette",
	"apps/home/login/login_view",
	"apps/common/alert_view"
], (
	app,
	Marionette,
	LoginView,
	AlertView
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities"
		showLogin: ->
			that = @
			view = new LoginView({generateTitle: true, showForgotten:true})
			view.on "form:submit", (data) ->
				openingSession = app.Auth.save(data)
				if openingSession
					app.trigger("header:loading", true)
					# En cas d'échec de connexion, l'api server renvoie une erreur
					$.when(openingSession).done( (response)->
						app.trigger("home:show");
					).fail( (response)->
						if response.status is 422
							view.triggerMethod("form:data:invalid", response.responseJSON.errors);
						else
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/025]")
					).always( ()->
						app.trigger("header:loading", false)
					)
				else
					view.triggerMethod("form:data:invalid", app.Auth.validationError)

			view.on "login:forgotten", (email)->
				# Vérification de l'email
				re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if !re.test(email)
					view.triggerMethod("form:data:invalid", [{ success:false, message: "L'email n'est pas valide"}])
				else
					channel = that.getChannel()
					app.trigger("header:loading", true)
					sendingMail = channel.request("forgotten:password", email)
					sendingMail.always( ()->
						app.trigger("header:loading", false)
					).done( (response)->
						aView = new AlertView {
							title:"Email envoyé"
							type:"success"
							message:"Un message a été envoyé à l'adresse "+email+". Veuillez vérifier dans votre boîte mail et cliquer sur le lien contenu dans le mail. [Cela peut prendre plusieurs minutes...]"
							dismiss:true
						}
						app.regions.getRegion('message').show(aView)
					).fail( (response)->
						if response.status is 404
							aView = new AlertView {
								title:"Utilisateur inconnu"
								type:"warning"
								message:"Aucun utilsateur avec cet email."
								dismiss:true
							}
							app.regions.getRegion('message').show(aView)
						else
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/033]")
					)

			app.regions.getRegion('main').show(view);

		showReLogin: (options)->
			that = @
			view = new LoginView({generateTitle: false, showForgotten:false, title:"Reconnexion"})
			this.listenTo view,"dialog:closed", ()->
				options?.fail?()
			view.on "form:submit", (data) ->
				if data.identifiant is "" or data.identifiant is app.Auth.get("identifiant")
					# C'est bien la même personne qui se reconnecte
					openingSession = app.Auth.save(data)
					if openingSession
						app.trigger("header:loading", true)
						$.when(openingSession).done( (response)->
							that.stopListening()
							view.trigger("dialog:close")
							options?.done?()
						).fail( (response)->
							if response.status is 422
								view.triggerMethod("form:data:invalid", response.responseJSON.errors);
							else
								alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/025]")
						).always( ()->
							app.trigger("header:loading", false)
						)
					else
						view.triggerMethod("form:data:invalid", app.Auth.validationError)
				else
					view.triggerMethod("form:data:invalid", [{success:false, message:"C'est une reconnexion : Vous devez réutiliser le même identifiant que précedemment."}])
			app.regions.getRegion('dialog').show(view)


	}

	return new Controller()
