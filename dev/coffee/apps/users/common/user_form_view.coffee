define ["jst","apps/common/item_form_view"], (JST,FormView) ->
	View = FormView.extend {
		itemMarkup:"user"
		template: window.JST["users/common/user-form"]

		serializeData: () ->
			data = _.clone(@model.attributes)
			data.showPWD = @showPWD or false
			data.showPref = @showPref or false
			data.ranks = @ranks or false
			return data
	}

	return View
