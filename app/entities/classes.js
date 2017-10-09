define(["backbone.radio","entities/classe"], function(Radio,Item){
	var ItemsCollection = Backbone.Collection.extend({
		url: "api/classes",
		model: Item,
		comparator: "nom"
	});

	var API = {
		storedCollection:null,
		lastTime:null,
		getEntities: function(){
			t= Date.now();
			if ((API.storedCollection) && (t-API.lastTime<20000))
			{
				var defer = $.Deferred();
				defer.resolve(API.storedCollection);
				return defer.promise();
			}
			else
			{
				API.lastTime = t;
				var items = new ItemsCollection();
				var defer = $.Deferred();
				items.fetch({
					success: function(data){
						defer.resolve(data);
					}
				});
				var promise = defer.promise();
				$.when(promise).done(function(fetchedItems){
					API.storedCollection = fetchedItems;
				});
				return promise;
			}
		}
	};

	var channel = Radio.channel('classes');
	channel.reply('classe:entities', API.getEntities );

	return;
});
