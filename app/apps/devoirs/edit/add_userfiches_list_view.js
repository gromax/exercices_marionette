define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/edit/add-userfiche-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/edit/add-userfiche-item"],
		triggers: {
			"click button.js-addDevoir": "item:add",
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.devoirCounter = this.options.devoirCounter;
			return data;
		},

		upDevoirCounter: function() {
			this.options.devoirCounter++;
		},

		flash: function(cssClass){
			this.render(); // pour mettre à jour le compteur
			var $view = this.$el;
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, function(){
				setTimeout(function(){
					$view.toggleClass("table-"+cssClass);
				}, 500);
			});
		},
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

		childViewOptions: function(model, index) {
			return {
				devoirCounter: _.where(this.options.userfiches, { idUser: model.get("id")}).length
			}
		},

		setFilterCriterion: function(filterCriterion){
			this.filterCriterion = filterCriterion.toLowerCase();
			return this;
		},

		filter: function (child, index, collection) {
			var criterion = this.filterCriterion;
			if (!child.get("isEleve")) {
				return false;
			}
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
		template: window.JST["devoirs/edit/add-userfiches-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		triggers:{
			"click a.js-sort":"sort",
		},

		onRender:function(){
			this.subCollectionView = new CollectionView({
				collection:this.collection,
				filterCriterion:this.options.filterCriterion,
				userfiches: _.where(this.options.userfiches.toJSON(), {idFiche:this.options.idFiche}),
			});
			this.listenTo(this.subCollectionView,"childview:item:add", this.addItem);
			this.showChildView('body', this.subCollectionView);
		},

		onSort:function(view,e){
			var name = $(e.currentTarget).attr("name");
			if (name) {
				if (this.collection.comparator==name) {
					console.log("reverse !");
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

		addItem:function(childview){
			this.trigger("item:add",childview);
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
