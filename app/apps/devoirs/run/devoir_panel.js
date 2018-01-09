define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/run/devoir-panel"],
	});

	return Panel;
});
