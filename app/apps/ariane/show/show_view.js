define(["marionette","app","jst"], function(Marionette,app,JST){

	var noView = Marionette.View.extend({
		tagName: "li",
		className: "breadcrumb-item active",
		template: window.JST["ariane/show/show-noview"],
	});

	var Item = Marionette.View.extend({
		tagName: "li",

		className: function(){
			if (this.model.get("active")) {
				return "breadcrumb-item"
			} else {
				// Ça peut paraître bizarre, mais c'est quand il n'y a pas de lien
				// et que c'est inactif qu'il faut mettre la classe active avec bootstrap breadcrumb
				return "breadcrumb-item active"
			}
		},

		initialize:function(){
			this.listenTo(this.model,"change:active",function(){ this.render();});
		},

		template: window.JST["ariane/show/show-item"],
		triggers: {
			"click" : "ariane:navigate"
		},

		onArianeNavigate: function(){
			var active = this.model.get("active");
			var event_name = this.model.get("e");
			var data = this.model.get("data");
			if (active && event_name) {
				app.trigger.apply(app,_.flatten([event_name,data]));
			}
		}
	});

	var CollectionView = Marionette.CollectionView.extend({
		tagName:"ol",
		className: "breadcrumb",
		childView:Item,
		emptyView:noView,
	});

	var ArianeView = Marionette.View.extend({
		tagName: "nav",
		template: window.JST["ariane/show/show-list"],
		regions:{
			body:{
				el:'ol',
				replaceElement:true
			}
		},

		onRender:function(){
			this.subCollection = new CollectionView({
				collection:this.collection
			});
			this.showChildView('body', this.subCollection);
		},

	});


	return ArianeView;
});
