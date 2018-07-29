define [
	"app"
	"marionette"
	"apps/messages/list/list_view"
	"apps/messages/list/list_layout"
	"apps/messages/list/add_panel"
], (
	app,
	Marionette,
	MListView,
	MLayout,
	MAdd,
) ->
	Controller = Marionette.Object.extend {
		channelName: 'entities'
		list: (criterion) ->
			app.trigger("header:loading", true)
			channel = @getChannel()
			require ["entities/message", "entities/dataManager"], (Message) ->
				fetchingMessages = channel.request("custom:entities", ["messages"])
				$.when(fetchingMessages).done( (messages)->
					mListView = new MListView {
						collection: messages
						idUser: app.Auth.get("id")
						enableReply: not app.Auth.isEleve()
					}

					mLayout = new MLayout()

					makeAdd = (dest, idDest, closeAfter) ->
						mAdd = new MAdd {
							dest: dest
							closedMode: not closeAfter
						}

						mAdd.on "message:cancel:click", ()->
							if closeAfter then mLayout.getRegion('addRegion').empty()
							else mAdd.onMessageToggle()

						mAdd.on "message:send", (view, data) ->
							# Si le message est vide, aucune réaction
							nMessage = new Message()
							if idDest isnt false then data.idDest = idDest
							savingMessage = nMessage.save(data)
							if savingMessage
								# Pour un élève, le destinataire est forcément le prof
								# pas besoin de le préciser
								app.trigger("header:loading", true)

								$.when(savingMessage).done( ()->
									messages.add(nMessage)
									nMessageView = mListView.children.findByModel(nMessage)
									if nMessageView
										nMessageView.open()
									if closeAfter then mLayout.getRegion('addRegion').empty()
									else mAdd.onMessageToggle()
								).fail( (response)->
									switch response.status
										when 422
											view.triggerMethod("form:data:invalid", response.responseJSON.errors)
										when 401
											alert("Vous devez vous (re)connecter !")
											view.trigger("dialog:close")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/035]")
								).always( ()->
									app.trigger("header:loading", false)
								)
							else
								view.triggerMethod("form:data:invalid",nMessage.validationError)

						return mAdd


					if app.Auth.isEleve() then addView = makeAdd("Prof", false, false)
					else addView = null

					mLayout.on "render", () ->
						@showChildView 'itemsRegion', mListView
						if addView? then @showChildView 'addRegion', addView

					mListView.on "childview:exercice:show", (view) ->
						model = view.model
						app.trigger "exercice-fait:run", model.get("aUE")

					mListView.on "childview:message:show", (view) ->
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
					mListView.on "childview:message:delete", (childView,e)->
						model = childView.model
						if confirm("Supprimer le message ?")
							destroyRequest = model.destroy()
							app.trigger("header:loading", true)
							$.when(destroyRequest).done( ()->
								childView.remove()
							).fail( (response)->
								alert("Erreur. Essayez à nouveau !")
							).always( ()->
								app.trigger("header:loading", false)
							)

					if not app.Auth.isEleve()
						mListView.on "childview:message:reply", (childView,e) ->
							model = childView.model
							mLayout.showChildView 'addRegion', makeAdd(model.get("ownerName"), model.get("idOwner"), true)

					app.regions.getRegion('main').show(mLayout)
				).always( ()->
					app.trigger("header:loading", false)
				)


		show: (id) ->
			console.log "affichage du message @#{id}"
	}

	return new Controller()
