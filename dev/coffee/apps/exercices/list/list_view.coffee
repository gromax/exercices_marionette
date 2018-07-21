define [
	"jst",
	"marionette",
	"mathjax"
], (
	JST,
	Marionette,
	MathJax
) ->
	noView = Marionette.View.extend {
		template:  window.JST["exercices/list/exercice-list-none"]
		tagName: "a"
		className: "list-group-item"
	}

	Item = Marionette.View.extend {
		tagName: "a",
		className: "list-group-item"
		template: window.JST["exercices/list/exercice-list-item"]

		triggers: {
			"click": "exercice:show"
		}

		onRender: () ->
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]])
	}

	Liste = Marionette.CollectionView.extend {
		className:"list-group"
		emptyView: noView
		childView: Item

		initialize: () ->
			if @options.filterCriterion?
				@setFilterCriterion(@options.filterCriterion)

		setFilterCriterion: (filterCriterion, options) ->
			@filterCriterion = filterCriterion.toLowerCase()
			return @

		onSetFilterCriterion: (filterCriterion,options) ->
			@setFilterCriterion(filterCriterion)
			options = options ? {}
			if not options.preventRender
				@render()

		filter: (child, index, collection) ->
			criterion = @filterCriterion
			if (criterion is "") or criterion is null or child.get("title").toLowerCase().indexOf(criterion) isnt -1 or child.get("description").toLowerCase().indexOf(criterion) isnt -1 or child.get("keyWords").join(";").toLowerCase().indexOf(criterion) isnt -1
				return true
			return false
	}

	return Liste;
