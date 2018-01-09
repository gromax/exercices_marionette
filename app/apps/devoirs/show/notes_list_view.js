define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/show/note-list-none"],
		tagName: "a",
		className: "list-group-item"
	});

	var Item = Marionette.View.extend({
		tagName: "a",
		className: "list-group-item justify-content-between",
		template: window.JST["devoirs/show/note-list-item"],

		initialize: function(options){
			this.faits = _.where(options.faits, {aUF: options.model.get("id")});
			this.exofiches = options.exofiches.where({idFiche: options.model.get("idFiche")});
		},

		serializeData: function(){
			data = _.clone(this.model.attributes);
			data.note = String(this.model.calcNote(this.exofiches, this.faits));
			if (data.note.length==1) {
				data.note = "0"+data.note;
			}
			return data;
		},

		triggers: {
			"click button.js-delete": "note:delete",
			"click button.js-actif": "note:activate",
			"click": "note:show"
		},

		flash: function(cssClass){
			var $view = this.$el;
			$view.hide().toggleClass("list-group-item-"+cssClass).fadeIn(800, function(){
				setTimeout(function(){ $view.toggleClass("list-group-item-"+cssClass) }, 500);
			});
		},

		remove: function(){
			var self = this;
			this.$el.addClass("list-group-item-warning");
			this.$el.fadeOut(function(){
				self.model.destroy();
				Marionette.View.prototype.remove.call(self);
			});
		},
	});

	var Liste = Marionette.CollectionView.extend({
		className:"list-group",
		emptyView: noView,
		childView: Item,

		initialize: function(options){
			this.exofiches = options.exofiches;
			this.faits = options.faits.toJSON();
			this.idFiche = options.idFiche;
		},

		childViewOptions: function(model, index) {
			return {
				exofiches: this.exofiches,
				faits: this.faits
			}
		},

		filter: function (child, index, collection) {
			// On affiche que les userfiches qui ont sont dans la bonne fiche
			return child.get("idFiche") == this.idFiche;
		},
	});

	return Liste;
});
