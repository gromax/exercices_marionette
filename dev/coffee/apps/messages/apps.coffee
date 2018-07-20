define ["marionette","app"], (Marionette,app)->

	API = {
		list: (criterion) ->
			auth = app.Auth;
			if auth.isOff()
				app.trigger("home:login")
			else
				app.Ariane.reset([{ text:"Messages", e:"messages:list", link:"messages"}]);
				require ["apps/messages/controller"], (controller) ->
					controller.list criterion

		show: (id) ->
			auth = app.Auth
			if auth.isOff()
				app.trigger("home:login")
			else
				app.Ariane.reset [{ text:"Messages", e:"messages:list", link:"messages"}]
				require ["apps/messages/controller"], (controller) ->
					controller.show id
	}

	app.on "messages:list", () ->
		app.navigate("messages")
		API.list()

	app.on "messages:filter", (criterion) ->
		if criterion
			app.navigate "messages/filter/criterion:#{criterion}"
		else
			app.navigate "messages"

	app.on "message:show", (id) ->
		app.navigate "message:#{id}"
		API.showUser id

# Router

	Router = Marionette.AppRouter.extend {
		controller: API
		appRoutes: {
			"messages(/filter/criterion::criterion)": "list"
			"message::id": "show"
		}
	}

	return new Router()
