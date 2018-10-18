define ["jst","marionette"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["users/list/user-list-panel"]

		triggers: {
			"click button.js-new": "user:new"
		}

		events: {
			"submit #filter-form": "filterUsers"
		}

		ui: {
			criterion: "input.js-filter-criterion"
		},

		serializeData: ()->
			{
				filterCriterion: @options.filterCriterion or ""
				showAddButton: @options.showAddButton is true
			}

		filterUsers: (e)->
			e.preventDefault();
			criterion = @ui.criterion.val()
			@trigger("users:filter", criterion);

		onSetFilterCriterion: (criterion)->
			@ui.criterion.val(criterion)
	}

	return Panel
