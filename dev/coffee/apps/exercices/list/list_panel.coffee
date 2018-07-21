define ["jst","marionette"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["exercices/list/exercice-list-panel"]

		events: {
			"submit #filter-form": "filterExercices"
		}

		ui: {
			criterion: "input.js-filter-criterion"
		}

		serializeData: () ->
			{
				filterCriterion: this.options.filterCriterion ? ""
			}

		changeFilterExercices: (e) ->
			e.preventDefault()
			criterion = this.$(".js-filter-criterion").val()
			if criterion.length>3
				this.trigger("exercices:filter", criterion)

		filterExercices: (e) ->
			e.preventDefault()
			criterion = this.$(".js-filter-criterion").val()
			this.trigger("exercices:filter", criterion)

		onSetFilterCriterion: (criterion) ->
			@ui.criterion.val(criterion)
	}

	return Panel
