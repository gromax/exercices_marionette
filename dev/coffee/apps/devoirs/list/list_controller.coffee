define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/list_layout",
	"apps/devoirs/list/list_panel",
	"apps/devoirs/list/list_view",
	"apps/devoirs/edit/edit_fiche_view"
], (
	app,
	Marionette,
	AlertView,
	Layout,
	Panel,
	ListView,
	ShowView
) ->

	Controller = Marionette.Object.extend {
		channelName: 'entities'

		list: ->
			app.trigger("header:loading", true)
			listItemsLayout = new Layout()
			listItemsPanel = new Panel({ showInactifs: app.settings.showDevoirsInactifs is true })
			channel = @getChannel()

			require ["entities/devoir", "entities/dataManager"], (Item) ->
				fetching = channel.request("custom:entities",["fiches"])
				$.when(fetching).done( (fiches)->
					listItemsView = new ListView { collection: fiches, showInactifs: app.settings.showDevoirsInactifs is true }

					listItemsLayout.on "render", ()->
						listItemsLayout.getRegion('panelRegion').show(listItemsPanel)
						listItemsLayout.getRegion('itemsRegion').show(listItemsView)

					listItemsPanel.on "devoir:new", ()->
						newItem = new Item();
						view = new ShowView({
							model: newItem
							editMode: true
						})

						view.on "form:submit", (data) ->
							savingItem = newItem.save(data)
							if savingItem
								app.trigger("header:loading", true)
								$.when(savingItem).done( ()->
									newItem.set("nomOwner", app.Auth.get("nom")) # L'api ne renvoie pas le nom du créateur qui est forcément le connecté
									fiches.add(newItem)
									view.trigger("dialog:close")
									listItemsView.flash(newItem)
								).fail( (response)->
									switch response.status
										when 422
											view.triggerMethod("form:data:invalid", response.responseJSON.errors)
										when 401
											alert("Vous devez vous (re)connecter !")
											view.trigger("dialog:close")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/020]")
								).always( ()->
									app.trigger("header:loading", false)
								)
							else
								view.triggerMethod("form:data:invalid",newItem.validationError)

						app.regions.getRegion('dialog').show(view)

					listItemsPanel.on "devoir:toggle:showInactifs", ()->
						showInactifs = app.settings.showDevoirsInactifs is true
						showInactifs = app.settings.showDevoirsInactifs = not showInactifs
						listItemsPanel.options.showInactifs = showInactifs
						listItemsPanel.render()
						listItemsView.setShowInactifs showInactifs

					listItemsView.on "item:show", (childView, args)->
						model = childView.model
						app.trigger("devoir:show", model.get("id"))

					listItemsView.on "item:setAttribute", (childView, attr_name)->
						# attr_name sera soit visible soit actif
						model = childView.model
						attr_value = model.get(attr_name)
						model.set(attr_name, !attr_value)
						updatingItem = model.save()
						if updatingItem
							app.trigger("header:loading", true)
							$.when(updatingItem).done( ()->
								childView.render()
								childView.flash("success")
							).fail( (response)->
								if response.status is 401
									alert("Vous devez vous (re)connecter !")
									app.trigger("home:logout")
								else
									alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/021]")
							).always( ()->
								app.trigger("header:loading", false)
							)
						else
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/022]")

					listItemsView.on "item:delete", (childView,e) ->
						model = childView.model
						idFiche = model.get("id")
						if confirm("Supprimer le devoir « #{model.get('nom')} » ?")
							destroyRequest = model.destroy()
							app.trigger("header:loading", true)
							$.when(destroyRequest).done( ()->
								childView.remove()
								channel.request("fiche:destroy:update", idFiche)
							).fail( (response)->
								alert("Erreur. Essayez à nouveau !")
							).always( ()->
								app.trigger("header:loading", false)
							)

					app.regions.getRegion('main').show(listItemsLayout)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)
	}

	return new Controller()
