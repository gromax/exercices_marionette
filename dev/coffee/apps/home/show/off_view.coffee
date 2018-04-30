define ["marionette","app","jst"], (Marionette,app,JST) ->
	OffPanel = Marionette.View.extend {
		template: window.JST["home/show/home-off"]
		triggers: {
			"click a.js-login": "home:login"
		},
		onHomeLogin: (e) ->
			app.trigger("home:login");

		serializeData: () ->
			{
				version: app.version
			}
	}

	return OffPanel;
