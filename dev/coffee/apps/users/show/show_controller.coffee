define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/users/show/show_view",
	"apps/common/missing_item_view"
], (
	app,
	Marionette,
	AlertView,
	ShowView,
	MissingView
)->
	Controller = Marionette.Object.extend {
		channelName: "entities"
		showUser: (id, isMe) ->
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
							app.Ariane.add { text:"Mon compte", e:"user:show", data:id, link:"user:"+id}
						else
							app.Ariane.add { text:user.get("nomComplet"), e:"user:show", data:id, link:"user:"+id}

						view = new ShowView {
							model: user
						}
						view.on "user:edit", (user)->
							app.trigger("user:edit", user.get("id"))

						view.on "user:editPwd", (user)->
							app.trigger("user:editPwd", user.get("id"))

					else
						if isMe
							app.Ariane.add({ text:"Mon compte", e:"user:show", data:id, link:"user:#{id}"})
						else
							app.Ariane.add({ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:#{id}"})
						view = new MissingView({ message:"Cet utilisateur n'existe pas !"});
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
	}

	return new Controller()
