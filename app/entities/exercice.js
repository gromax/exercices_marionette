// Classe d'un item exercice
define(["backbone.radio","entities/exercices/exercices_controller"], function(Radio, ExercicesController){
	var Item = Backbone.Model.extend({
		defaults: {
			title: "Titre de l'exercice",
			description: "Description de l'exercice",
			keywords: ""
		},
	});

	var API = {
		getEntity: function(id){
			var itemData = ExercicesController.get(id);
			var itemModel = new Item(itemData);
			return itemModel;
		}
	};

	var channel = Radio.channel('exercices');
	channel.reply('exercice:entity', API.getEntity );

	return Item;
});
