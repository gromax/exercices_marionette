define [
	"app",
	"marionette",
	"apps/messages/list/list_view"
], (
	app,
	Marionette,
	ListView
) ->
	Controller = Marionette.Object.extend {
		channelName: 'entities'
		list: (criterion) ->
			app.trigger("header:loading", true)
			channel = @getChannel()
			require ["entities/message", "entities/dataManager"], (Message) ->
				fetchingMessages = channel.request("custom:entities", ["messages"])
				$.when(fetchingMessages).done( (messages)->
					messagesView = new ListView {
						collection: messages
					}

					messagesView.on "childview:exercice:show", (view) ->
						model = view.model
						app.trigger "exercice-fait:run", model.get("aUE")

					messagesView.on "childview:message:show", (view) ->
						view.opened = not view.opened
						model = view.model
						if (not model.get("lu"))
							setLuProcessing = model.setLu()
							$.when(setLuProcessing).done( ()->
								model.set("lu",true)
								app.Auth.set("unread", app.Auth.get("unread")-1)
							).fail( (response)->
								switch response.status
									when 422
										view.triggerMethod("form:data:invalid", response.responseJSON.errors)
									when 401
										alert("Vous devez vous (re)connecter !")
										view.trigger("dialog:close")
										app.trigger("home:logout")
									else
										alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/030]")
							)
						view.render()

					app.regions.getRegion('main').show(messagesView)
				).always( ()->
					app.trigger("header:loading", false)
				)


		show: (id) ->
			console.log "affichage du message @#{id}"
	}

	return new Controller()
