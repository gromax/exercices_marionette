define(["jst","marionette", "mathjax"], function(JST,Marionette, MathJax){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/run/exercice-list-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: "list-group-item list-group-item-action",
		getTemplate: function(){
			if (this.options.profMode==true){
				return window.JST["devoirs/run/exercice-list-item-prof"];
			} else {
				return window.JST["devoirs/run/exercice-list-item"];
			}
		},

		initialize: function(options){
			this.faits = _.where(options.faits, {aEF: options.model.get("id")});
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.note = this.model.calcNote(this.faits);
			data.n_faits = this.faits.length;
			data.numero = this.options.numero;
			data.showFaitsButton = this.options.showFaitsButton;
			return data;
		},

		onRender: function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		triggers: {
			"click": "exofiche:run",
			"click a.js-faits": "exofiche:saved-list:show",
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
				faits: this.faits,
				numero: index+1,
				profMode: this.options.profMode == true,
				showFaitsButton: this.options.showFaitsButton == true // bouton élève pour accéder aux exercices faits
			}
		}
	});

	return Liste;
});
