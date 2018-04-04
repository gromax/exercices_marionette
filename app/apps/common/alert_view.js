define(["jst","marionette","spin.jquery"], function(JST,Marionette){
	var AlertView = Marionette.View.extend({
		tag:"div",
		template: window.JST["common/alert-view"],
		className: function(){
			return "alert alert-"+this.options.type;
		},

		initialize: function(options){
			var options = options || {};
			this.title = options.title || "Erreur !";
			this.message = options.message || "Erreur inconnue. Reessayez !";
			this.type = options.type || "danger;"
		},

		serializeData: function(){
			return {
				title: this.title,
				message: this.message,
				dismiss: false || this.options.dismiss,
				type: this.type
			}
		},

	});

	return AlertView;
});
