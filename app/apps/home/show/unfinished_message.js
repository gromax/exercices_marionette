define(["jst","marionette"], function(JST,Marionette){
	var Item = Marionette.View.extend({
		tagName: "div",
		className: "alert alert-warning",

		template: window.JST["home/show/unfinished-message"],

		serializeData:function(){
			return { number: this.options.number }
		},

		triggers: {
			"click": "devoir:unfinished:show"
		},
	});

	return Item;
});
