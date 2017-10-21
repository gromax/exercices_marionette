define(["jst","marionette"], function(JST,Marionette){
	var view = Marionette.View.extend({
		initialize: function(options){
			var options = options || {};
			this.message = options.message || "Cet item n'existe pas.";
		},

		serializeData: function(){
			return {
				message: this.message
			}
		},


		template: window.JST["common/missing-item"]
	});

	return view;
});
