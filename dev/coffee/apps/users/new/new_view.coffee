define ["app","apps/users/common/user_form_view"], (app,FormView) ->
	if app.Auth?.get("isRoot")
		ranks=2
	else
		ranks=1

	NewView = FormView.extend {
		title: "Nouvel Utilisateur"
		showPWD: true
		ranks:ranks
	}

	return NewView
