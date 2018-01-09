define(["jst","marionette"], function(JST,Marionette){
	var noView = Marionette.View.extend({
		template:  window.JST["devoirs/show/add-eleve-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var Item = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["devoirs/show/add-eleve-list-item"],
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
		template: window.JST["devoirs/show/add-eleve-list"],
		regions:{
			body:{
				el:'tbody',
				replaceElement:true
			}
		},

		onRender:function(){
			this.subCollection = new CollectionView({
				collection:this.collection,
				filterCriterion:this.options.filterCriterion,
				userfiches: _.where(this.options.userfiches.toJSON(), {idFiche:this.options.idFiche}),
			});
			this.listenTo(this.subCollection,"childview:item:add", this.addItem);
			this.showChildView('body', this.subCollection);
		},

		addItem:function(childView){
			this.trigger("item:add",childView);
		},

		flash: function(itemModel){
			var newItemView = this.subCollection.children.findByModel(itemModel);
			// check whether the new user view is displayed (it could be
			// invisible due to the current filter criterion)
			if(newItemView){
				newItemView.flash("success");
			}
		},

		onSetFilterCriterion: function(criterion, options){
			this.subCollection.setFilterCriterion(criterion);
			options = options || {};
			if (!options.preventRender) {
				this.subCollection.render();
			}
		}
	});

	return Liste;
});
