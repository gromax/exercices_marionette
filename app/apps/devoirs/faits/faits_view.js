define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/faits/faits-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/faits/faits-list-item"],
		triggers: {
			"click button.js-delete": "item:delete",
			"click": "item:show"
		},

		serializeData:function(){
			var data = _.clone(this.model.attributes);
			data.showDeleteButton = this.options.showDeleteButton;
			return data;
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

		initialize: function(options){
			if (typeof options.filter === 'function') {
				this.filter = this.options.filter;
			}
		},

		childViewOptions: function(model, index) {
			return {
				showDeleteButton: this.options.showDeleteButton,
			}
		},
	});

	var Liste = Marionette.View.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["devoirs/faits/faits-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		onRender:function(){
			this.subCollection = new CollectionView({
				collection:this.collection,
				filter:this.options.filter,
				showDeleteButton: this.options.showDeleteButton == true,
			});
			this.listenTo(this.subCollection,"childview:item:show", this.showItem);
			this.listenTo(this.subCollection,"childview:item:delete", this.deleteItem);
			this.showChildView('body', this.subCollection);
		},

		serializeData:function(){
			return {
				showDeleteButton: this.options.showDeleteButton,
			}
		},

		showItem:function(childView){
			this.trigger("item:show",childView);
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
