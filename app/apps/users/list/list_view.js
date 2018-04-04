define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["users/list/user-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["users/list/user-list-item"],
		triggers: {
			"click td a.js-edit": "item:edit",
			"click td a.js-editPwd": "item:editPwd",
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
				//self.model.destroy();
				self.trigger("model:destroy", this.model);
				Marionette.View.prototype.remove.call(self);
			});
		}

	});

	var CollectionView = Marionette.CollectionView.extend({
		tagName:'tbody',
		childView:Item,
		emptyView:noView,
		filterCriterion:null,

		initialize:function(){
			if (this.options.filterCriterion) {
				this.setFilterCriterion(this.options.filterCriterion);
			}
		},

		setFilterCriterion: function(filterCriterion){
			this.filterCriterion = filterCriterion.toLowerCase();
			return this;
		},

		filter: function (child, index, collection) {
			var criterion = this.filterCriterion;
			if( (criterion=="")
				|| criterion == null
				|| child.get("prenom").toLowerCase().indexOf(criterion) !== -1
				|| child.get("nom").toLowerCase().indexOf(criterion) !== -1
				|| child.get("nomClasse").toLowerCase().indexOf(criterion) !== -1){
				return true;
			}
			return false;
		}
	});

	var Liste = Marionette.View.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["users/list/user-list"],
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
				collection:this.collection,
				filterCriterion:this.options.filterCriterion
			});
			this.listenTo(this.subCollectionView,"childview:item:show", this.showItem);
			this.listenTo(this.subCollectionView,"childview:item:edit", this.editItem);
			this.listenTo(this.subCollectionView,"childview:item:editPwd", this.editItemPwd);
			this.listenTo(this.subCollectionView,"childview:item:delete", this.deleteItem);
			this.showChildView('body', this.subCollectionView);
		},

		showItem:function(childView){
			this.trigger("item:show",childView);
		},

		editItem:function(childView){
			this.trigger("item:edit",childView);
		},

		editItemPwd:function(childView){
			this.trigger("item:editPwd",childView);
		},

		deleteItem:function(childView){
			this.trigger("item:delete",childView);
		},

		flash: function(itemModel){
			var newItemView = this.subCollectionView.children.findByModel(itemModel);
			// check whether the new user view is displayed (it could be
			// invisible due to the current filter criterion)
			if(newItemView){
				newItemView.flash("success");
			}
		},

		onSetFilterCriterion: function(criterion, options){
			this.subCollectionView.setFilterCriterion(criterion);
			options = options || {};
			if (!options.preventRender) {
				this.subCollectionView.render();
			}
		}
	});

	return Liste;
});
