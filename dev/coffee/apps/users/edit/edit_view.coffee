define ["apps/users/common/user_form_view"], (FormView) ->
	EditView = FormView.extend {
		showPref:true
		initialize: ->
			@title = "Modifier #{@model.get('prenom')} #{@model.get('nom')}";

		onRender: ->
			if @options.generateTitle
				$title = $("<h1>", { text: @title })
				@$el.prepend($title)

	}
	return EditView
