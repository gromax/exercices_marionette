define(["backbone.radio", "entities/exercice", "entities/exercices/exercices_controller"], function(Radio, Item, ExercicesController){
	var ItemsCollection = Backbone.Collection.extend({
		model: Item,
	});

	var API = {
		getEntities: function(){
			var itemsData = ExercicesController.all();
			var collection = new ItemsCollection(itemsData);
			return collection;
		}
	};

	var channel = Radio.channel('exercices');
	channel.reply('exercices:entities', API.getEntities );

	return;
});
