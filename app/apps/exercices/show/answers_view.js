define([
	"jst",
	"marionette",
	"backbone.syphon"
], function(
	JST,
	Marionette
){

	var AnswersView = Marionette.View.extend({
		template: window.JST["exercices/show/answers-view-prof"],
		title: "[DEBUG] Réponses utilisateur",
		ui:{
			submit:"button.js-submit",
			cancel:"button.js-cancel",
		},

		events: {
			"click @ui.submit": "formSubmit",
		},

		triggers: {
			"click @ui.cancel": "form:cancel",
		},

		formSubmit: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger("form:submit", data);
		},

		serializeData:function(){
			return { answers : this.options.answers };
		},
	});

	return AnswersView;
});
