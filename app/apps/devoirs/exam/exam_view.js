define(["jst","marionette", "mathjax", "backbone.syphon"], function(JST, Marionette, MathJax){
	var ExerciceView = Marionette.View.extend({
		template: window.JST["devoirs/exam/exercice-panel"],

		triggers:{
			"click button.js-refresh":"item:refresh"
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.locked = this.options.locked;
			return data;
		},

		refresh_view: function(){
			this.render();
			this.$el.find(".card").each(function(){ MathJax.Hub.Queue(["Typeset",MathJax.Hub,this]); });
		},
	});

	var ListExerciceView = Marionette.CollectionView.extend({
		childView: ExerciceView,
		childViewOptions: function(model, index) {
			return {
				itemIndex: index,
				locked: this.options.locked,
			}
		}
	});

	var TexView = Marionette.View.extend({
		className:"card",
		template: window.JST["devoirs/exam/tex-view"],
		serializeData: function(){
			return {
				tex: this.options.tex,
			}
		},

		triggers: {
			"click button.js-close-tex": "tex:close",
		}
	});

	var View = Marionette.View.extend({
		template: window.JST["devoirs/exam/exam-view"],
		regions: {
			collection: {
				el: '#exam-collection',
			},
			pied: {
				el: '#exam-pied',
			},
			tex: {
				el: '#exam-tex',
			}
		},

		triggers: {
			"click button.js-lock": "exam:lock",
			"click button.js-tex": "exam:button:tex",
		},

		onRender: function() {
			var collection = this.options.collection;
			this.listView = new ListExerciceView({
				collection: collection,
				locked: this.options.locked,
			});
			this.listenTo(this.listView, "childview:item:refresh", this.refreshItem);
			this.showChildView('collection', this.listView);
			this.$el.find(".card").each(function(){ MathJax.Hub.Queue(["Typeset",MathJax.Hub,this]); });
		},

		refreshItem:function(childview,e){
			var index = Number($(e.currentTarget).attr("index"));
			this.trigger("item:refresh",childview, childview.options.itemIndex, index);
		},

		serializeData: function(){
			return {
				nom: this.options.nom,
				locked: this.options.locked,
			};
		},

		showTex:function(tex){
			var texView = new TexView({ tex: tex });
			this.showChildView("tex", texView);
			this.listenTo(texView, "tex:close", function(_texView){
				this.getRegion('tex').empty();
			});
		},
	});

	return View;
});
