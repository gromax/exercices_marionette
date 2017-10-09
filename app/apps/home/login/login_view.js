define(["marionette","app","jst", "backbone.syphon"], function(Marionette,app,JST){
	var Panel = Marionette.View.extend({
		template: window.JST["home/login/home-login"],

		events: {
			"click button.js-submit": "submitClicked"
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("form:submit", data);
		},

		onFormDataInvalid: function(errors){
			var $view = this.$el;
			var clearFormErrors = function(){
				var $form = $view.find("form");
				$form.find("div.alert.alert-danger").each(function(){
					$(this).remove();
				});
				$form.find(".input-group.has-error").each(function(){
					$(this).removeClass("has-error");
				});
			}

			var markErrors = function(value, key){
				var $controlGroup = $view.find("#user-" + key).parent();
				$controlGroup.addClass("has-error");
				var $errorEl = $("<div>", { class: "alert alert-danger", role:"alert", text: value });
				$controlGroup.after($errorEl);
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});

	return Panel;
});
