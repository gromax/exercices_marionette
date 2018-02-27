define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/edit/userfiche-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/edit/userfiche-item"],

		initialize: function(options){
			this.faits = _.where(options.faits, {aUF: options.model.get("id")});
			this.exofiches = options.exofiches.where({idFiche: options.model.get("idFiche")});
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			var note = this.model.calcNote(this.exofiches, this.faits)
			this.model.set("_note",note);
			data.note = String(note);
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
			this.$el.fadeOut(function(){
				self.model.destroy();
				Marionette.View.prototype.remove.call(self);
			});
		},
	});

	var CollectionView = Marionette.CollectionView.extend({
		tagName:'tbody',
		childView:Item,
		emptyView:noView,

		childViewOptions: function(model, index) {
			return {
				exofiches: this.options.exofiches,
				faits: this.options.faits
			}
		},

		filter: function (child, index, collection) {
			// On affiche que les userfiches qui ont sont dans la bonne fiche
			return child.get("idFiche") == this.options.idFiche;
		},

	});

	var Liste = Marionette.View.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["devoirs/edit/userfiches-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		triggers:{
			"click a.js-sort":"sort",
		},

		onSort:function(view,e){
			var name = $(e.currentTarget).attr("name");
			if (name) {
				if (this.collection.comparator==name) {
					this.collection.comparator = function(a,b){
						if (a.get(name)>b.get(name)) {
							return -1;
						} else {
							return 1;
						}
					}
				} else {
					this.collection.comparator=name;
				}
				this.collection.sort();
			}
		},

		onRender:function(){
			this.subCollectionView = new CollectionView({
				collection: this.collection,
				exofiches: this.options.exofiches,
				faits: this.options.faits.toJSON(),
				idFiche: this.options.idFiche,
			});
			this.listenTo(this.subCollectionView,"childview:note:delete", this.deleteItem);
			this.listenTo(this.subCollectionView,"childview:note:activate", this.activateItem);
			this.listenTo(this.subCollectionView,"childview:note:show", this.showItem);
			this.showChildView('body', this.subCollectionView);
		},

		showItem:function(childView){
			this.trigger("note:show",childView);
		},

		deleteItem:function(childView){
			this.trigger("note:delete",childView);
		},

		activateItem:function(childView){
			this.trigger("note:activate",childView);
		},

	});

	return Liste;
});
