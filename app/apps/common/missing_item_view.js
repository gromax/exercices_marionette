define(["jst","marionette"], function(JST,Marionette){
	var view = Marionette.View.extend({
		template: window.JST["common/missing-item"]
	});

	return view;
});
