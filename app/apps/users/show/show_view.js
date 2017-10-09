define(["jst","marionette"], function(JST,Marionette){
	var view = Marionette.View.extend({
		template: window.JST["users/show/show-user"],
		events: {
			"click a.js-edit": "editClicked",
			"click a.js-editPwd": "editPwdClicked"
		},

		editClicked: function(e){
			e.preventDefault();
			this.trigger("user:edit", this.model);
		},

		editPwdClicked: function(e){
			e.preventDefault();
			this.trigger("user:editPwd", this.model);
		}

	});

	return view;
});
