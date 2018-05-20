define ["jst","marionette"], (JST,Marionette)->
	view = Marionette.View.extend {
		template: window.JST["users/show/show-user"]
		events: {
			"click a.js-edit": "editClicked"
			"click a.js-editPwd": "editPwdClicked"
		}

		editClicked: (e)->
			e.preventDefault()
			@trigger("user:edit", @model)

		editPwdClicked: (e)->
			e.preventDefault();
			@trigger("user:editPwd", @model)

	}

	return view
