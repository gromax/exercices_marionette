define(["backbone.radio","entities/classe","BBcache"], function(Radio,Item){
	var ItemsCollection = Backbone.Collection.extend({
		url: "api/classes",
		model: Item,
		comparator: "nom"
	});

	var API = {
		storedCollection:null,
		lastTime:null,
		getEntities: function(){
			var items = new ItemsCollection();
			var defer = $.Deferred();
			items.fetch({
				cache:true,
				success: function(data){
					defer.resolve(data);
				}
			});
			var promise = defer.promise();
			return promise;
		}
	};

	var channel = Radio.channel('entities');
	channel.reply('classes:entities', API.getEntities );

	return;
});
