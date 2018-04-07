define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/list/devoir-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/list/devoir-list-item"],
		triggers: {
			"click button.js-delete": "item:delete",
			"click button.js-actif": "item:setActivity",
			"click button.js-visible": "item:setVisibility",
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
				self.trigger("model:destroy", this.model);
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
		template: window.JST["devoirs/list/devoir-list"],
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
			this.subCollection = new CollectionView({
				collection:this.collection
			});
			this.listenTo(this.subCollection,"childview:item:show", this.showItem);
			this.listenTo(this.subCollection,"childview:item:delete", this.deleteItem);
			this.listenTo(this.subCollection,"childview:item:setVisibility", this.setVisibility);
			this.listenTo(this.subCollection,"childview:item:setActivity", this.setActivity);
			this.showChildView('body', this.subCollection);
		},

		showItem:function(childView){
			this.trigger("item:show",childView);
		},

		setVisibility:function(childView){
			this.trigger("item:setAttribute",childView, "visible");
		},

		setActivity:function(childView){
			this.trigger("item:setAttribute",childView, "actif");
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
