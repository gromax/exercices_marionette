define(["jst", "marionette", "mathjax"], function(JST, Marionette, Mathjax){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/edit/exofiche-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: "list-group-item list-group-item-action",
		getTemplate: function(){
			if (this.options.editMode) {
				return window.JST["devoirs/edit/exofiche-item-edit"];
			} else {
				return window.JST["devoirs/edit/exofiche-item"];
			}
		},

		events:{
			"click button.js-submit": "submitClicked",
		},

		triggers: {
			"click button.js-edit": "exercice:edit",
			"click button.js-delete": "exercice:delete",
			"click button.js-cancel": "exercice:cancel",
			"click button.js-test" : "exercice:test"
		},

		flash: function(cssClass){
			var $view = this.$el;
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, function(){
				setTimeout(function(){ $view.toggleClass("table-"+cssClass) }, 500);
			});
		},

		remove: function(){
			var self = this;
			this.$el.fadeOut(function(){
				self.model.destroy();
				Marionette.View.prototype.remove.call(self);
			});
		},

		goToEdit: function(){
			this.options.editMode = true;
			this.render();
		},

		goToShow: function(){
			this.options.editMode = false;
			this.render();
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			var output = {};
			var options = {};
			_.each(data,function(value, key, list){
				if (key.indexOf("option_") == 0) {
					var new_key = key.substr(7);
					options[new_key] = value;
				} else {
					output[key] = value;
				}
			});
			output.options = options;
			this.trigger("form:submit", this, output);
		},

		onFormDataInvalid: function(errors){
			// debug : à faire
			alert("erreur");
			console.log(errors);
		},

		onRender: function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,

		initialize: function(options){
			this.idFiche = options.idFiche;
		},

		filter: function (child, index, collection) {
			// On affiche que les exofiches qui ont sont dans la bonne fiche
			return child.get("idFiche") == this.idFiche;
		},

	});

	return Liste;
});
