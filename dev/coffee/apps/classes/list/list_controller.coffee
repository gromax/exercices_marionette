define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/list_layout",
	"apps/classes/list/list_panel",
	"apps/classes/list/list_view",
	"apps/classes/new/new_view",
	"apps/classes/edit/edit_view"
], (
	app,
	Marionette,
	AlertView,
	Layout,
	Panel,
	ListView,
	NewView,
	EditView
) ->

	Controller = Marionette.Object.extend {
		channelName: 'entities',

		list: ->
			app.trigger("header:loading", true)
			listItemsLayout = new Layout()
			listItemsPanel = new Panel()
			channel = @getChannel()

			require ["entities/classe", "entities/dataManager"], (Classe)->
				fetching = channel.request("classes:entities")
				$.when(fetching).done( (items)->
					listItemsView = new ListView {
						collection: items
					}

					listItemsLayout.on "render", ()->
						listItemsLayout.getRegion('panelRegion').show(listItemsPanel)
						listItemsLayout.getRegion('itemsRegion').show(listItemsView)

					listItemsPanel.on "classe:new", ()->
						newItem = new Classe()
						view = new NewView {
							model: newItem
						}

						view.on "form:submit", (data)->
							savingItem = newItem.save(data)
							if savingItem
								$.when(savingItem).done( ()->
									items.add(newItem);
									view.trigger("dialog:close");
									listItemsView.flash(newItem);
								).fail( (response)->
									switch response.status
										when 422
											view.triggerMethod("form:data:invalid", response.responseJSON.errors)
										when 401
											alert("Vous devez vous (re)connecter !")
											view.trigger("dialog:close")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/002]")
								)
							else
								view.triggerMethod("form:data:invalid",newItem.validationError)

						app.regions.getRegion('dialog').show(view)

					listItemsView.on "item:show", (childView, args)->
						model = childView.model
						app.trigger("classe:show", model.get("id"))

					listItemsView.on "item:edit", (childView, args)->
						model = childView.model
						view = new EditView {
							model:model
						}

						view.on "form:submit", (data)->
							updatingItem = model.save(data)
							if updatingItem
								$.when(updatingItem).done( ()->
									childView.render()
									view.trigger("dialog:close")
									childView.flash("success")
								).fail( (response)->
									switch response.status
										when 422
											view.triggerMethod("form:data:invalid", response.responseJSON.errors)
										when 401
											alert("Vous devez vous (re)connecter !")
											view.trigger("dialog:close")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/003]")
								)
							else
								@triggerMethod("form:data:invalid", model.validationError)

						app.regions.getRegion('dialog').show(view);

					listItemsView.on "item:delete", (childView,e)->
						childView.remove()

					app.regions.getRegion('main').show(listItemsLayout)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)
	}

	return new Controller()
