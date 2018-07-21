define [
	"app",
	"marionette",
	"apps/common/loading_view",
	"apps/common/list_layout",
	"apps/exercices/list/list_panel",
	"apps/exercices/list/list_view"
], (
	app,
	Marionette,
	LoadingView,
	Layout,
	Panel,
	ListView
) ->
	Controller = Marionette.Object.extend {
		channelName: "entities"
		list: (criterion) ->
			criterion = criterion ? ""
			loadingView = new LoadingView()
			app.regions.getRegion('main').show(loadingView)

			layout = new Layout()
			panel = new Panel({filterCriterion:criterion})

			channel = @getChannel()

			require ["entities/exercices"], () ->
				collection = channel.request("exercices:entities")
				listView = new ListView {
					collection: collection
					filterCriterion: criterion
				}

				panel.on "exercices:filter", (filterCriterion) ->
					listView.triggerMethod("set:filter:criterion", filterCriterion, { preventRender:false })
					app.trigger("exercices:filter", filterCriterion)

				layout.on "render", () ->
					layout.getRegion('panelRegion').show(panel)
					layout.getRegion('itemsRegion').show(listView)

				listView.on "childview:exercice:show", (childView, args) ->
					model = childView.model
					app.trigger("exercice:show", model.get("id"))

				app.regions.getRegion('main').show(layout)
	}

	return new Controller()
