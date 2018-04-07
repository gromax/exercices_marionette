define(["marionette","app","jst", "backbone.syphon"], function(Marionette,app,JST){
	var Panel = Marionette.View.extend({
		template: window.JST["home/login/home-login"],

		events: {
			"click button.js-submit": "submitClicked",
			"click button.js-forgotten": "forgottenClicked"
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("form:submit", data);
		},

		forgottenClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("login:forgotten", data.identifiant);
		},

		onFormDataInvalid: function(errors){
			var $view = this.$el;
			var clearFormErrors = function(){
				var $form = $view.find("form");
				$form.find("div.alert").each(function(){
					$(this).remove();
				});
			}

			var $container = $view.find("#messages");
			var markErrors = function(value){
				var $errorEl;
				if (value.success) {
					$errorEl = $("<div>", { class: "alert alert-success", role:"alert", text: value.message });
				} else {
					$errorEl = $("<div>", { class: "alert alert-danger", role:"alert", text: value.message });
				}
				$container.append($errorEl);
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});

	return Panel;
});
