define ["marionette","app","jst"], (Marionette,app,JST)->
	Panel = Marionette.View.extend {
		template: window.JST["home/show/home-admin"]
		triggers: {
			"click a.js-users": "users:list"
			"click a.js-classes": "classes:list"
			"click a.js-exercices": "exercices:list"
			"click a.js-devoirs": "devoirs:list"
			"click a.js-messages": "messages:list"
		}

		serializeData: ()->
			{ unread: app.Auth.get("unread") }

		onUsersList: (e) ->
			app.trigger "users:list"

		onClassesList: (e) ->
			app.trigger "classes:list"

		onExercicesList: (e) ->
			app.trigger "exercices:list"

		onDevoirsList: (e) ->
			app.trigger "devoirs:list"

		onMessagesList: (e) ->
			app.trigger "messages:list"
	}

	return Panel
