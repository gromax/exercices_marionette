define(["app","apps/users/common/user_form_view"], function(app,FormView){
	if ((app.Auth) && (app.Auth.get("isRoot"))){
		var ranks=2;
	} else {
		var ranks=1;
	}

	var NewView = FormView.extend({
		title: "Nouvel Utilisateur",
		showPWD: true,
		ranks:ranks
	});

	return NewView;
});
