define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["home/show/devoirs-list-eleve-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: function(){
			return this.model.get("actif") ? "list-group-item" : "list-group-item list-group-item-danger";
		},

		template: window.JST["home/show/devoirs-list-eleve-item"],

		initialize: function(options){
			this.faits = _.where(options.faits, {aUF: options.model.get("id")});
			this.exofiches = options.exofiches.where({idFiche: options.model.get("idFiche")});
		},

		serializeData: function(){
			data = _.clone(this.model.attributes);
			data.note = this.model.calcNote(this.exofiches, this.faits);
			if (_.has(data,"ficheActive")) {
				data.actif = data.actif && data.ficheActive;
			}
			return data;
		},

		triggers: {
			"click": "devoir:show"
		},
	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,

		initialize:function(options){
			this.exofiches = options.exofiches; // le calcul de la note a besoin de la propriété calculNote du modèle exofiche
			this.faits = options.faits.toJSON(); // Le calcul de la note n'a pas besoin des propriétés de models
		},

		childViewOptions: function(model, index) {
			return {
				exofiches: this.exofiches,
				faits: this.faits
			}
		}
	});

	return Liste;
});
