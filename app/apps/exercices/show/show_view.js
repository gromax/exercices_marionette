define(["jst","marionette", "backbone.radio", "mathjax", "backbone.syphon"], function(JST, Marionette, Radio, MathJax){
	var channel = Radio.channel('exercice');

	var briqueView = Marionette.View.extend({
		tagName: "div",
		className: "card",
		getTemplate: function(){
			var type = this.model.get("type");
			switch (type) {
				case "base":
					return window.JST["exercices/common/standard-panel"];
					break;
				case "liste":
					return window.JST["exercices/common/form-panel"];
					break;
				default:
					return window.JST["exercices/common/missing-panel"]
			}
		},
		template: window.JST["exercices/common/missing-panel"],
		events:{
			"click button.js-clavier" : "onClavier",
			"click button.js-submit" : "submitClicked",
		},

		onClavier: function(e){
			e.preventDefault();
			var cible = e.currentTarget.name;
			if (cible=="aide") {
				$el = $("ul.js-liste-aide");
				if ($el.css('display') == 'none') {
					$el.slideDown("slow");
				} else {
					$el.slideUp("slow");
				}
			}
			return false;
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			channel.trigger("exercice:form:submit", data, this);
		},

		onFormDataInvalid: function(errors){
			var $view = this.$el;
			var clearFormErrors = function(){
				var $form = $view.find("form");
				$form.find(".form-control-feedback").each(function(){
					$(this).remove();
				});
				$form.find(".form-group.has-warning").each(function(){
					$(this).removeClass("has-warning");
				});
				$form.find(".form-control-warning").each(function(){
					$(this).removeClass("form-control-warning");
				});
			}

			var markErrors = function(value, key){
				var $controlGroup = $view.find("#exo-"+key).closest(".form-group");
				$controlGroup.addClass("has-warning");
				var $inp = $controlGroup.find("input")
				$inp.addClass("form-control-warning");
				if ($.isArray(value)) {
					value.forEach(function(el){
						var $errorEl = $("<div>", { class: "form-control-feedback", text: el });
						$inp.after($errorEl);
					});
				} else {
					var $errorEl = $("<div>", { class: "form-control-feedback", text: value });
					$inp.after($errorEl);
				}
			}

			clearFormErrors();
			_.each(errors, markErrors);
		},

		onRender:function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}
	});

	var ListView = Marionette.CollectionView.extend({
		childView: briqueView,
	});

	var View = Marionette.View.extend({
		template: window.JST["exercices/show/show-view"],
		regions: {
			collection: {
				el: '#collection',
			}
		},

		onRender: function() {
			var maCollection = this.model.get("briquesCollection");
			var listView = new ListView({
				collection: maCollection
			});
			this.showChildView('collection', listView);
		}
	});

	return View;
});
