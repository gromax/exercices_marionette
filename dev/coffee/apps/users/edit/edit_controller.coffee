define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/users/edit/edit_view",
	"apps/users/edit/editpwd_view"
], (
	app,
	Marionette,
	AlertView,
	MissingView,
	EditView,
	EditPwdView
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities"

		editUser: (id, isMe)->
			app.trigger("header:loading", true)
			channel = @getChannel()
			require ["entities/dataManager"], ()->
				if isMe
					fetchingUser = channel.request("user:me")
				else
					fetchingUser = channel.request("user:entity", id)
				$.when(fetchingUser).done( (user)->
					if user isnt undefined
						if isMe
							app.Ariane.add [
								{ text:"Mon compte", e:"user:show", data:user.get("id"), link:"user:"+user.get("id") }
								{ text:"Modification", e:"user:edit", data:user.get("id"), link:"user:"+user.get("id")+"/edit" }
							]
						else
							app.Ariane.add [
								{ text:user.get("nomComplet"), e:"user:show", data:user.get("id"), link:"user:"+user.get("id") }
								{ text:"Modification", e:"user:edit", data:user.get("id"), link:"user:"+user.get("id")+"/edit" }
							]

						view = new EditView {
							model: user
							generateTitle: true
						}

						view.on "form:submit", (data) ->
							app.trigger("header:loading", true)
							updatingUser = user.save(data)
							if updatingUser
								$.when(updatingUser).done( ()->
									if isMe
										app.Auth.set(data) # met à jour nom, prénom et pref
									app.trigger("user:show", user.get("id"));
								).fail( (response)->
									switch response.status
										when 422
											view.triggerMethod("form:data:invalid", response.responseJSON.errors)
										when 401
											alert("Vous devez vous (re)connecter !")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/028]")
								).always( ()->
									app.trigger("header:loading", false)
								)
							else
								view.triggerMethod("form:data:invalid", user.validationError)
					else
						if isMe
							app.Ariane.add [
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification", e:"user:edit", data:id, link:"user:"+id+"/edit" }
							]
						else
							app.Ariane.add [
								{ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification", e:"user:edit", data:id, link:"user:"+id+"/edit" }
							]

						view = new MissingView({message:"Cet utilisateur n'existe pas !"});
					app.regions.getRegion('main').show(view)
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
		editUserPwd: (id, isMe)->
			app.trigger("header:loading", true)
			channel = @getChannel()

			require ["entities/dataManager"], ()->
				if isMe
					fetchingUser = channel.request("user:me")
				else
					fetchingUser = channel.request("user:entity", id)
				$.when(fetchingUser).done( (user)->
					if user isnt undefined
						if isMe
							app.Ariane.add [
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]
						else
							app.Ariane.add [
								{ text:user.get("nomComplet"), e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]
						view = new EditPwdView {
							model: user
							generateTitle: true
						}

						view.on "form:submit", (data)->
							if data.pwd isnt data.pwdConfirm
								view.triggerMethod("form:data:invalid", { pwdConfirm:"Les mots de passe sont différents."})
							else
								app.trigger("header:loading", true)
								updatingUser = user.save(_.omit(data,"pwdConfirm"))
								if updatingUser
									$.when(updatingUser).done( ()->
										# Là il faudrait enlever le pwd de user
										app.trigger("user:show", user.get("id"))
									).fail( (response)->
										switch response.status
											when 422
												view.triggerMethod("form:data:invalid", response.responseJSON.errors)
											when  401
												alert("Vous devez vous (re)connecter !")
												app.trigger("home:logout")
											else
												alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/029]")
									).always( ()->
										app.trigger("header:loading", false)
									)
								else
									view.triggerMethod("form:data:invalid", user.validationError)
					else
						if isMe
							app.Ariane.add [
								{ text:"Mon compte", e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]
						else
							app.Ariane.add [
								{ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:"+id }
								{ text:"Modification du mot de passe", e:"user:editPwd", data:id, link:"user:"+id+"/password" }
							]
						view = new ExosManager.UsersApp.Show.MissingUser();
					app.regions.getRegion('main').show(view);
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				);
	}

	return new Controller()
