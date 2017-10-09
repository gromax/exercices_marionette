define(["jst","marionette", "backbone.syphon"], function(JST,Marionette){
	var View = Marionette.View.extend({
		template: window.JST["users/edit/userpwd-form"],
		events: {
			"click button.js-submit": "submitClicked"
		},

		title:"Modifier le mot de passe",

		onRender: function(){
			if(this.options.generateTitle){
				var $title = $("<h1>", { text: this.title });
				this.$el.prepend($title);
			}
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
				$form.find(".help-inline.text-danger").each(function(){
					$(this).remove();
				});
				$form.find(".form-group.has-error").each(function(){
					$(this).removeClass("has-error");
				});
			}

			var markErrors = function(value, key){
				var $controlGroup = $view.find("#user-" + key).closest(".form-group");
				$controlGroup.addClass("has-error");
				if ($.isArray(value)) {
					value.forEach(function(el){
						var $errorEl = $("<span>", { class: "help-inline text-danger", text: el });
						$controlGroup.append($errorEl);
					});
				} else {
					var $errorEl = $("<span>", { class: "help-inline text-danger", text: value });
					$controlGroup.append($errorEl);
				}
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});

	return View;
});

