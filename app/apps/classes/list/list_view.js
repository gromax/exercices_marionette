define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["classes/list/classe-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["classes/list/classe-list-item"],
		triggers: {
			"click td a.js-edit": "item:edit",
			"click button.js-delete": "item:delete",
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
	});

	var Liste = Marionette.View.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["classes/list/classe-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		onRender:function(){
			this.subCollection = new CollectionView({
				collection:this.collection
			});
			this.listenTo(this.subCollection,"childview:item:show", this.showItem);
			this.listenTo(this.subCollection,"childview:item:edit", this.editItem);
			this.listenTo(this.subCollection,"childview:item:delete", this.deleteItem);
			this.showChildView('body', this.subCollection);
		},

		showItem:function(childView){
			this.trigger("item:show",childView);
		},

		editItem:function(childView){
			this.trigger("item:edit",childView);
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
