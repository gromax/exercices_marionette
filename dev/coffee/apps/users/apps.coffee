define ["marionette","app"], (Marionette,app)->

	API = {
		listUsers: (criterion) ->
			auth = app.Auth;
			forProf = () ->
				app.Ariane.reset([{ text:"Utilisateurs", e:"users:list", link:"users"}]);
				require ["apps/users/list/list_controller"], (listController) ->
					listController.listUsers(criterion)

			todo = auth.mapItem {
				"Admin": forProf
				"Prof": forProf
				"Eleve": () -> app.trigger("notFound")
				"def": () -> app.trigger("home:login")
			}

			todo()

		showUser: (id) ->
			auth = app.Auth
			if auth.get("id") is id
				app.Ariane.reset []
				require ["apps/users/show/show_controller"], (showController) ->
					showController.showUser(id, true)
			else if auth.isAdmin() or auth.isProf()
				app.Ariane.reset [{ text:"Utilisateurs", e:"users:list", link:"users"}]
				require ["apps/users/show/show_controller"], (showController) ->
					showController.showUser(id, false)
			else
				app.trigger("notFound")

		editUser: (id) ->
			auth = app.Auth
			if auth.get("id") is id
				app.Ariane.reset []
				require ["apps/users/edit/edit_controller"], (editController) ->
					editController.editUser(id, true)
			else if  auth.isAdmin() or auth.isProf()
				app.Ariane.reset [{ text:"Utilisateurs", e:"users:list", link:"users"}]
				require ["apps/users/edit/edit_controller"], (editController) ->
					editController.editUser(id, false)
			else
				app.trigger("notFound")

		editUserPwd: (id) ->
			auth = app.Auth
			id = id ? auth.get("id")
			if auth.get("id") is id
				app.Ariane.reset []
				require ["apps/users/edit/edit_controller"], (editController) ->
					editController.editUserPwd(id, true)
			else if auth.isAdmin() or auth.isProf()
				app.Ariane.reset [{ text:"Utilisateurs", e:"users:list", link:"users"}]
				require ["apps/users/edit/edit_controller"], (editController) ->
					editController.editUserPwd(id, false)
			else
				app.trigger("notFound")
	}

	app.on "users:list", () ->
		app.navigate("users")
		API.listUsers()

	app.on "users:filter", (criterion) ->
		if criterion
			app.navigate "users/filter/criterion:#{criterion}"
		else
			app.navigate "users"

	app.on "user:show", (id) ->
		app.navigate "user:#{id}"
		API.showUser id

	app.on "user:edit", (id) ->
		app.navigate "user:#{id}/edit"
		API.editUser id

	app.on "user:editPwd", (id) ->
		app.navigate "user:#{id}/password"
		API.editUserPwd id

# Router

	Router = Marionette.AppRouter.extend {
		controller: API
		appRoutes: {
			"users(/filter/criterion::criterion)": "listUsers"
			"user::id": "showUser"
			"user::id/edit": "editUser"
			"user::id/password": "editUserPwd"
		}
	}

	return new Router()
