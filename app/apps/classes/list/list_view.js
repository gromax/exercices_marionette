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
				//self.model.destroy();
				Marionette.View.prototype.remove.call(self);
			});
		}

	});

	var Liste = Marionette.CompositeView.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["classes/list/classe-list"],
		emptyView: noView,
		childView: Item,
		childViewContainer: "tbody"
	});

	return Liste;
});
