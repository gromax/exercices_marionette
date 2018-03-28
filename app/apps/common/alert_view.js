define(["jst","marionette","spin.jquery"], function(JST,Marionette){
	var AlertView = Marionette.View.extend({
		tag:"div",
		template: window.JST["common/alert-view"],
		className: "alert alert-danger",
		initialize: function(options){
			var options = options || {};
			this.title = options.title || "Erreur !";
			this.message = options.message || "Erreur inconnue. Reessayez !";
		},

		serializeData: function(){
			return {
				title: this.title,
				message: this.message
			}
		},

	});

	return AlertView;
});
