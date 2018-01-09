define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/run/exercice-list-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: "list-group-item",
		template: window.JST["devoirs/run/exercice-list-item"],

		initialize: function(options){
			this.faits = _.where(options.faits, {aEF: options.model.get("id")});
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.note = this.model.calcNote(this.faits);
			data.n_faits = this.faits.length;
			return data;
		},

		triggers: {
			"click": "exofiche:run"
		},

	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,

		initialize: function(options){
			this.userfiche = options.userfiche;
			this.faits = _.where(options.faits.toJSON(), {aUF:this.userfiche.get("id")});
			this.idFiche = this.userfiche.get("idFiche");
		},

		filter: function (child, index, collection) {
			// On affiche que les exofiches qui ont sont dans la bonne fiche
			return child.get("idFiche") == this.idFiche;
		},

		childViewOptions: function(model, index) {
			return {
				faits: this.faits
			}
		}
	});

	return Liste;
});
