define(["app","marionette","apps/common/loading_view", "apps/common/missing_item_view", "apps/exercices/show/show_view"], function(app, Marionette, LoadingView, MissingView, View){
	// Il faudra envisager un exercice vide
	// Ou un exercice dont le fichier js n'existe pas
	// et éventuellement un chargement

	var Controller = Marionette.Object.extend({
		channelName: 'exercice',

		show: function(id){
			var loadingView = new LoadingView({
				title: "Exercice #"+id,
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/exercice"], function(Radio,Exercice){
				var channel = Radio.channel('exercices');
				var fetchingExercice = channel.request("exercice:entity", id);
				$.when(fetchingExercice).done(function(exo){
					view = new View({ model: exo });

					app.regions.getRegion('main').show(view);

				}).fail(function(){
					view = new MissingView({ message:"Cet exercice n'existe pas !" });
					app.regions.getRegion('main').show(view);
				});
			});
		},

		radioEvents: {
			'exercice:form:submit': 'formSubmit',
		},

		formSubmit:function(data, view) {
			var model = view.model;
			var errors = model.validation(data);
			if (errors == false) {
				console.log("succès");
			} else {
				view.onFormDataInvalid(errors);
			}
		}
	})
	return new Controller();
});
