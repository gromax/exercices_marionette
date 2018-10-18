define ["marionette","app"], (Marionette,app) ->
	API = {
		classesList: ->
			auth = app.Auth
			forProf = ->
				app.Ariane.reset [{ text:"Classes", e:"classes:list", link:"classes"}]
				require ["apps/classes/list/list_controller"], (Controller) ->
					Controller.list()

			todo = auth.mapItem {
				"Admin": forProf
				"Prof": forProf
				"Eleve": -> app.trigger("notFound")
				"def": -> app.trigger("home:login")
			}
			todo()

		classeShow: (id) ->
			auth = app.Auth
			forProf = ->
				app.Ariane.reset [{ text:"Classes", e:"classes:list", link:"classes"}]
				require ["apps/classes/show/show_controller"], (Controller) ->
					Controller.show(id)

			todo = auth.mapItem {
				"Admin": forProf
				"Prof": forProf
				"Eleve": -> app.trigger("notFound")
				"def": -> app.trigger("home:login")
			}
			todo()

		classeEdit: (id) ->
			auth = app.Auth
			forProf = ->
				app.Ariane.reset [{ text:"Classes", e:"classes:list", link:"classes"}]
				require ["apps/classes/edit/edit_controller"], (Controller) ->
					Controller.edit(id)

			todo = auth.mapItem {
				"Admin": forProf
				"Prof": forProf
				"Eleve": -> app.trigger("notFound")
				"def": -> app.trigger("home:login")
			}
			todo()

		classeProf: (id) ->
			auth = app.Auth
			forAdmin = ->
				app.Ariane.reset [{ text:"Classes", e:"classes:list", link:"classes"}]
				require ["apps/classes/list/list_controller"], (Controller) ->
					Controller.list_prof(id)

			todo = auth.mapItem {
				"Admin": forAdmin
				"Prof": -> app.trigger("notFound")
				"Eleve": -> app.trigger("notFound")
				"def": -> app.trigger("home:login")
			}
			todo()
	}

	app.on "classes:list", () ->
		app.navigate("classes")
		API.classesList()

	app.on "classe:show", (id) ->
		app.navigate("classe:" + id)
		API.classeShow(id)

	app.on "classe:edit", (id) ->
		app.navigate("classe:" + id + "/edit")
		API.classeEdit(id)

	app.on "classes:prof", (id) ->
		app.navigate("classes/prof:" + id)
		API.classeProf(id)

# Router

	Router = Marionette.AppRouter.extend {
		controller: API
		appRoutes: {
			"classes/prof::id": "classeProf"
			"classes": "classesList"
			"classe::id": "classeShow"
			"classe::id/edit": "classeEdit"
		}
	}

	new Router()

	return
