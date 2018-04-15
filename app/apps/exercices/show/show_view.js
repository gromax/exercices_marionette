define([
	"jst",
	"marionette",
	"mathjax",
	"mathquill",
	"backbone.syphon"
], function(
	JST,
	Marionette,
	MathJax
){
	var BriqueItemView = Marionette.View.extend({
		className: "card-body",
		template: window.JST["exercices/common/brique-item"],
		triggers:{
			"focusin input": "form:input:focusin",
		},

		onFormDataInvalid: function(data){
			var model = this.model;
			var name = model.get("name");
			if (name) {
				// On retire un éventuel message d'erreur antérieur
				this.$el.find(".js-validation-error").each(function(){
					$(this).remove();
				});

				var validation_item = data[name]
				if (validation_item && validation_item.error) {
					// Il y a une erreur qu'il faut afficher
					this.$el.addClass("bg-danger text-white");
					this.$el.append("<small class='js-validation-error'><i class='fa fa-exclamation-triangle'></i> "+validation_item.error+"</small>");
				} else {
					// Pas d'erreur, on efface l'éventuel formatage erreur
					this.$el.removeClass("bg-danger text-white");
				}
			}
		},

		onRender: function(){
			var fcts = this.model.get("renderingFunctions");
			var that = this;
			if (fcts) {
				_.each(fcts, function(item){ item(that.$el); });
			}
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		remove: function(){
			this.model.destroy();
			Marionette.View.prototype.remove.call(this);
		},

		execPost: function(fct){
			fct();
		},
	});

	var InputItemView = Marionette.View.extend({
		className: "card-body",
		template: window.JST["exercices/common/input"],
		triggers:{
			"focusin input": "form:input:focusin",
			"focusin textarea": "form:input:focusin"
		},

		onFormDataInvalid: function(data){
			var model = this.model;
			var name = model.get("name");
			if (name) {
				// On retire un éventuel message d'erreur antérieur
				this.$el.find(".js-validation-error").each(function(){
					$(this).remove();
				});

				var validation_item = data[name]
				if (validation_item && validation_item.error) {
					// Il y a une erreur qu'il faut afficher
					this.$el.addClass("bg-danger text-white");
					this.$el.append("<small class='js-validation-error'><i class='fa fa-exclamation-triangle'></i> "+validation_item.error+"</small>");
				} else {
					// Pas d'erreur, on efface l'éventuel formatage erreur
					this.$el.removeClass("bg-danger text-white");
				}
			}
		},

		onRender: function(){
			var that = this;
			var format = this.model.get("format");
			if (format){
				var fctMQ = function(item){
					if (item.latex && item.name){
						var $answerSpan = $("#mq-exo-"+item.name,that.$el);
						var mathField = window.MQ.MathField($answerSpan[0], {
							spaceBehavesLikeTab: true,
							autoCommands: 'pi theta sqrt',
							autoOperatorNames: 'sin cos',
							handlers: {
								edit: function() { // useful event handlers
									if (mathField){ // Pas défini à l'initialisation
										$("#exo-"+name).val(mathField.latex());
									}
								},
								enter: function() {
									that.trigger("form:submit");
								}
							}
						});
						return [item.name, mathField];
					} else {
						return false;
					}
				}
				this.mathFields = _.object(_.compact(_.map(format,fctMQ)));
			}
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		remove: function(){
			this.model.destroy();
			Marionette.View.prototype.remove.call(this);
		},

		execPost: function(fct){
			fct();
		},
	});

	var ColorChoiceItemView = Marionette.View.extend({
		className: "card-body",
		template: window.JST["exercices/common/color-choice-item"],
		triggers:{
			"click a.list-group-item-action":"choice:click:item",
		},

		onRender: function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		onFormDataInvalid: function(data){
			// Normalement, la seule erreur est qu'on n'a pas tout coché
			var model = this.model;
			var name = model.get("name");
			if (name) {
				// On retire un éventuel message d'erreur antérieur
				this.$el.find(".js-validation-error").each(function(){
					$(this).remove();
				});

				var validation_item = data[name]
				if (validation_item && validation_item.error) {
					// Il y a une erreur qu'il faut afficher
					this.$el.append("<small class='js-validation-error text-danger'><i class='fa fa-exclamation-triangle'></i> "+validation_item.error+"</small>");
				}
			}
		},

		remove: function(){
			this.model.destroy();
			Marionette.View.prototype.remove.call(this);
		},

		onChoiceClickItem: function(view, e){
			var $el = $(e.currentTarget);
			var maxValue = this.model.get("maxValue")
			if (maxValue) {
				nVal = maxValue+1
			} else {
				var nVal = this.model.get("list").length
			}
			var $inp = $el.find("input").first();
			var $square = $el.find("i.fa-square").first();
			var v = Number($inp.val())+1;
			if (v>=nVal) {
				v=0;
			}
			$inp.val(v);
			require(["utils/colors"], function(colors){
				$square.css({ color: colors.html(v)});
			});
		}
	});

	var ColorListItemView = Marionette.View.extend({
		className: "card-body",
		template: window.JST["exercices/common/color-list-item"],

		onRender: function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		remove: function(){
			this.model.destroy();
			Marionette.View.prototype.remove.call(this);
		},
	});

	var ValidationItemView = Marionette.View.extend({
		className: "card-body",
		template: window.JST["exercices/common/validation-item"],
		triggers:{
			"click button.js-submit" : "form:submit",
			"mousedown button.js-clavier" : "form:clavier:click",
		},

		onRender: function(){
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
		},

		remove: function(){
			this.model.destroy();
			Marionette.View.prototype.remove.call(this);
		},

	});

	var JsxgraphItemView = Marionette.View.extend({
		className: "card-body text-center",
		template: window.JST["exercices/common/jsxgraph-item"],

		onRender: function(){
			var model = this.model;
			var params = model.get("params");
			var fcts = model.get("renderingFunctions");
			var that = this;
			var divId = this.model.get("divId");

			this.$el.find(".jxgbox").each(function(){
				var $el = $(this);
				// Astuce bricoleuse sans laquelle le width() renvoir systématiquement 0
				setTimeout(function(){
					$el.height($el.width());
				},0);
			})

			require(["jsxgraph"], function(){
				that.graph = JXG.JSXGraph.initBoard(divId, params);
				if (fcts) {
					_.each(fcts, function(item){ item(that.graph); });
				}
			});
		},

		execPost: function(fct){
			fct(this.graph);
		},
	});

	var BriqueItemsListView = Marionette.CollectionView.extend({
		childView: function(model){
			var type = model.get("type");
			switch(type){
				case "jsxgraph":
					return JsxgraphItemView;
					break;
				case "validation":
					return ValidationItemView;
					break;
				case "color-choice":
					return ColorChoiceItemView;
					break;
				case "color-list":
					return ColorListItemView;
					break;
				case "input":
					return InputItemView;
					break;
				default:
					return BriqueItemView;
			}
		},
	});

	var BriqueView = Marionette.View.extend({
		currentFocus: null,
		className: function(){
			var className;
			switch (this.model.get("cols")) {
				case 2:
					className = "col-md-6 col-12";
					break;
				default:
					className = "col-12";
			}
			return className;
		},
		template: window.JST["exercices/common/brique-panel"],

		regions: {
			items: {
				el: 'div.js-items',
			},
		},

		initialize : function(data) {
			this.listenTo(this.model, 'change:focus', this.setFocus);
		},

		onRender: function(){
			var items = this.model.get("items");
			this.itemsView = new BriqueItemsListView({
				collection: items,
			});
			this.listenTo(this.itemsView,"childview:form:submit",this.formSubmit);
			this.listenTo(this.itemsView, "childview:form:clavier:click", this.onClavier);
			this.listenTo(this.itemsView,"childview:form:input:focusin", this.onInputFocus);
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.needForm = this.model.checkIfNeedValidation();
			return data;
		},

		onClavier: function(childview, e){
			var cible = e.currentTarget.name;
			var $el;
			if (cible=="aide"){
				$el = $("ul.js-liste-aide");
				if ($el.css('display') == 'none') {
					$el.slideDown("slow");
				} else {
					$el.slideUp("slow");
				}
			} else {
				if (!this.currentFocus) {
					// On cherche le premier input
					var view = this.itemsView.children.find(function(item){ return (item.model.get("type") == "input") });
					if (view) {
						// On cherche le premier input
						var format = view.model.get("format");
						if (format){
							var it = _.first(_.filter(format, function(item){ if (item.name) return true; else return false; }));
							if (it){
								if (it.latex){
									var $node = view.$el.find("textarea");
								} else {
									var $node = view.$el.find("input");
								}
							}
						} else {
							// On envoie dans le premier input
							var $node = view.$el.find("input");
						}
						if ($node) {
							this.currentFocus = { view: view, node:$node[0] };
						}
					}
				}
				if (this.currentFocus){
					if (this.currentFocus.node.tagName == "INPUT") {
						$inp = $(this.currentFocus.node);
						var pos = $inp[0].selectionStart;
						var pEnd = $inp[0].selectionEnd;
						var currentText = $inp.val();
						switch(cible){
							case "empty":
								$inp.val(currentText.substring(0,pos)+"∅"+currentText.substring(pos));
								break;
							case "pi":
								$inp.val(currentText.substring(0,pos)+"π"+currentText.substring(pos));
								break;
							case "sqrt":
								$inp.val(currentText.substring(0,pos)+"sqrt("+currentText.substring(pos, pEnd)+")"+currentText.substring(pEnd));
								break;
							case "pow":
								$inp.val(currentText.substring(0,pos)+"^("+currentText.substring(pos, pEnd)+")"+currentText.substring(pEnd));
								break;
						}
					} else {
						// Dans ce cas c'est un latex-input
						var id = $(this.currentFocus.node).parent().parent().attr('id');
						var mfs = this.currentFocus.view.mathFields;
						var mf = _.find(mfs, function(item,key){
							if (id == "mq-exo-"+key){
								return true;
							} else {
								return false;
							}
						});

						if (mf){
							switch(cible){
								case "sqrt":
									mf.cmd('\\sqrt');
									mf.focus();
									break;
								case "pow":
									mf.cmd("^");
									mf.focus();
									break;
								case "pi":
									mf.cmd("\\pi");
									mf.focus();
									break;
							}
						}
					}
				}
			}
			return false;
		},

		onInputFocus: function(childview, e){
			this.currentFocus = { view: childview, node:e.currentTarget };
		},

		formSubmit: function(e){
			var data = Backbone.Syphon.serialize(this);
			var cv_datas = this.itemsView.children.map(function(childview){
				var model = childview.model;
				if ( (model.get("type") == "jsxgraph") && (model.get("getData")) ) {
					var fct = model.get("getData");
					return fct(childview.graph);
				} else {
					return null;
				}
			});

			data = _.reduce(cv_datas,function(memo, item){
				if (item == null) {
					return memo;
				} else {
					return _.extend(memo, item);
				}
			}, data);

			// On fait remonter les données récupérées dans la form ainsi que la vue
			this.trigger("form:submit",data,this);
		},

		onFormDataInvalid: function(data){
			this.itemsView.children.each(function(childview){
				if (childview.onFormDataInvalid) {
					childview.onFormDataInvalid(data);
				}
			});
		},

		removeItem: function(model){
			var childview = this.itemsView.children.findByModel(model);
			if (childview){
				childview.remove();
			}
		},

		showItems: function() {
			this.showChildView('items', this.itemsView);
		},

		setFocus: function() {
			this.$el.find(".card-header").each(function(){
				$(this).addClass("text-white bg-warning");
			});
		},

		unsetFocus: function() {
			this.$el.find(".card-header").each(function(){
				$(this).removeClass("text-white bg-warning");
			});
		},

		execPosts: function(list){
			var that =  this;
			_.each(list, function(item){
				var itemBrique =item.item;
				var childview = that.itemsView.children.findByModel(itemBrique);
				if (childview) {
					childview.execPost(item.post);
				}
			})
		}
	});

	var BriquesListView = Marionette.CollectionView.extend({
		className:"row", // Pour un contenu fluide dans bootstrap
		childView: BriqueView,
	});

	var PiedView = Marionette.View.extend({
		template: window.JST["exercices/common/pied"],
	});

	var OptionsView = Marionette.View.extend({
		template: window.JST["exercices/show/options-view"],
		className: "card",
		ui:{
			submit:"button.js-submit",
		},

		events: {
			"click @ui.submit": "formSubmit",
		},

		formSubmit: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("options:form:submit", data);
		},

		serializeData:function(){
			var optionsItems = _.map(
				this.model.attributes,
				function(val,key){
					return { key: key, tag: val.tag, options: val.options, value: val.value || 0 };
				}
			);
			return { optionsItems : optionsItems };
		},
	});



	var View = Marionette.View.extend({
		template: window.JST["exercices/show/show-view"],
		regions: {
			collection: {
				el: '#collection',
			},
			pied: {
				el: '#exercice-pied',
			},
			options: {
				el: '#options',
			},
		},

		ui:{
			reinit:"button.js-reinit",
			setoptions:"button.js-options",
			setanswers:"button.js-answers",
		},

		triggers: {
			"click @ui.reinit":"button:reinit",
			"click @ui.setoptions":"button:options",
			"click @ui.setanswers":"button:answers",
		},

		onRender: function() {
			var maCollection = this.model.get("briquesCollection");
			this.listView = new BriquesListView({
				collection: maCollection
			});
			this.listenTo(this.listView,"childview:form:submit",this.formSubmit);
			this.showChildView('collection', this.listView);
			this.piedView = new PiedView({ model: this.options.pied});
			this.showChildView('pied', this.piedView);
			this.listenTo(this.options.pied, "change:finished", this.piedView.render);
			// Mathjax pour le titre général et les titres de briques
			this.$el.find(".card-header").each(function(){ MathJax.Hub.Queue(["Typeset",MathJax.Hub,this]); })
		},

		formSubmit: function(data,view) {
			this.trigger("brique:form:submit",data,view);
		},

		showItems: function(brique){
			// Affiche les items de la brique passée en argument
			var childView = this.listView.children.findByModel(brique);
			if (childView){
				childView.showItems();
			}
		},


		setFocus: function(brique){
			// met le focus sur la brique passée en argument
			var childView = this.listView.children.findByModel(brique);
			if (childView){
				childView.setFocus();
			}
		},

		serializeData: function(){
			var data = _.clone(this.model.attributes);
			data.showOptionsButton = this.options.showOptionsButton;
			data.showReinitButton = this.options.showReinitButton;
			data.showAnswersButton = this.options.showAnswersButton;
			return data;
		},

		showOptionsView: function(optionsModel){
			// Vérifie que la vue n'est pas déjà active
			var currentView = this.getRegion('options').currentView;
			if (currentView) {
				currentView.$el.toggle();
			} else {
				optionsView = new OptionsView({ model: optionsModel});
				this.showChildView('options', optionsView);
				this.listenTo(optionsView, "options:form:submit", function(data){ this.trigger("options:form:submit", data); });
			}
		},

	});

	return View;
});
