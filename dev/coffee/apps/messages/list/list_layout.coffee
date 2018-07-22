define ["jst","marionette"], (JST,Marionette) ->
	Layout = Marionette.View.extend {
		template: window.JST["messages/list/list-layout"]
		regions: {
			addRegion: "#add-region"
			itemsRegion: "#items-region"
		}
	}

	return Layout
