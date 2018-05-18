define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/list_layout",
	"apps/users/list/list_panel",
	"apps/users/list/list_view",
	"apps/users/new/new_view",
	"apps/users/edit/edit_view",
	"apps/users/edit/editpwd_view"
], (
	app,
	Marionette,
	AlertView,
	Layout,
	Panel,
	UsersView,
	NewView,
	EditView,
	EditPwdView
) ->
	Controller = Marionette.Object.extend {
		channelName: 'entities'

		listUsers: (criterion)->
			criterion = criterion ? ""
			app.trigger("header:loading", true)
			usersListLayout = new Layout()
			usersListPanel = new Panel({filterCriterion:criterion})
			channel = @getChannel()

			require ["entities/user","entities/dataManager"], (User)->
				fetchingUsers = channel.request("custom:entities", ["users"])
				$.when(fetchingUsers).done( (users)->
					usersListView = new UsersView {
						collection: users
						filterCriterion: criterion
					}

					usersListPanel.on "users:filter", (filterCriterion)->
						usersListView.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false })
						app.trigger("users:filter", filterCriterion)

					usersListLayout.on "render", ()->
						usersListLayout.getRegion('panelRegion').show(usersListPanel)
						usersListLayout.getRegion('itemsRegion').show(usersListView)

					usersListPanel.on "user:new", ()->
						newUser = new User()
						view = new NewView {
							model: newUser
						}

						view.on "form:submit", (data)->
							# Dans ce qui suit, le handler error sert s'il y a un problème avec la requête
							# Mais la fonction renvoie false directement si le save n'est pas permis pour ne pas vérifier des conditions comme un terme vide
							savingUser = newUser.save(data)
							if savingUser
								$.when(savingUser).done( ()->
									users.add(newUser)
									view.trigger("dialog:close")
									newUserView = usersListView.children.findByModel(newUser)
									# check whether the new user view is displayed (it could be
									# invisible due to the current filter criterion)
									if newUserView
										newUserView.flash("success")
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
							else
								view.triggerMethod("form:data:invalid",newUser.validationError)

						app.regions.getRegion('dialog').show(view)

					usersListView.on "item:show", (childView, args)->
						model = childView.model
						app.trigger("user:show", model.get("id"))

					usersListView.on "item:edit", (childView, args)->
						model = childView.model
						view = new EditView {
							model:model
						}

						view.on "form:submit", (data)->
							updatingUser = model.save(data)
							app.trigger("header:loading", true)
							if updatingUser
								$.when(updatingUser).done( ()->
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
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/031]")
								).always( ()->
									app.trigger("header:loading", false)
								)
							else
								@triggerMethod("form:data:invalid", model.validationError)

						app.regions.getRegion('dialog').show(view)

					usersListView.on "item:editPwd", (childView, args)->
						model = childView.model
						view = new EditPwdView {
							model:model
						}

						view.on "form:submit", (data)->
							if data.pwd isnt data.pwdConfirm
								view.triggerMethod("form:data:invalid", { pwdConfirm:"Les mots de passe sont différents."})
							else
								updatingUser = model.save(_.omit(data,"pwdConfirm"))
								app.trigger("header:loading", true)
								if updatingUser
									$.when(updatingUser).done( ()->
										# Supprimer pwd de user
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
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/032]")
									).always( ()->
										app.trigger("header:loading", false)
									)
								else
									@triggerMethod("form:data:invalid", model.validationError)

						app.regions.getRegion('dialog').show(view)

					usersListView.on "item:delete", (childView,e)->
						model = childView.model
						idUser = model.get("id")
						if confirm("Supprimer le compte de « #{model.get('nomComplet')} » ?")
							destroyRequest = model.destroy()
							app.trigger("header:loading", true)
							$.when(destroyRequest).done( ()->
								childView.remove()
								channel.request("user:destroy:update", idUser)
							).fail( (response)->
								alert("Erreur. Essayez à nouveau !")
							).always( ()->
								app.trigger("header:loading", false)
							)

					usersListView.on "item:forgotten", (childView,e)->
						model = childView.model
						email = model.get("email")
						if confirm("Envoyer un mail de réinitialisation à « #{model.get('nomComplet')} » ?")
							app.trigger("header:loading", true)
							sendingMail = channel.request("forgotten:password", email)
							sendingMail.always( ()->
								app.trigger("header:loading", false)
							).done( (response)->
								childView.flash("success")
							).fail( (response)->
								alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/034]")
							)

					app.regions.getRegion('main').show(usersListLayout)
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
