define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/edit/exam-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/edit/exam-list-item"],
		triggers: {
			"click button.js-delete": "item:delete",
			"click button.js-edit": "item:edit",
			"click button.js-lock": "item:lock",
			"click": "item:show"
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
		}

	});

	var CollectionView = Marionette.CollectionView.extend({
		tagName:'tbody',
		childView:Item,
		emptyView:noView,

		filter: function (child, index, collection) {
			// On affiche que les exofiches qui ont sont dans la bonne fiche
			return child.get("idFiche") == this.options.idFiche;
		},
	});

	var Liste = Marionette.View.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["devoirs/edit/exam-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		onRender:function(){
			this.subCollection = new CollectionView({
				collection:this.collection,
				idFiche: Number(this.options.idFiche)
			});
			this.listenTo(this.subCollection,"childview:item:show", this.showItem);
			this.listenTo(this.subCollection,"childview:item:edit", this.editItem);
			this.listenTo(this.subCollection,"childview:item:delete", this.deleteItem);
			this.listenTo(this.subCollection,"childview:item:lock", this.setLock);
			this.showChildView('body', this.subCollection);
		},

		showItem:function(childView){
			this.trigger("item:show",childView);
		},

		editItem:function(childView){
			this.trigger("item:edit",childView);
		},

		setLock:function(childView){
			this.trigger("item:lock",childView);
		},

		deleteItem:function(childView){
			this.trigger("item:delete",childView);
		},

		flash: function(itemModel){
			var newItemView = this.subCollection.children.findByModel(itemModel);
			// check whether the new user view is displayed (it could be
			// invisible due to the current filter criterion)
			if(newItemView){
				newItemView.flash("success");
			}
		},
	});

	return Liste;
});
