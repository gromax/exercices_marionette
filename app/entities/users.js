define(["backbone.radio","entities/user"], function(Radio,User){
	var ItemsCollection = Backbone.Collection.extend({
		url: "api/users",
		model: User,
		comparator: "nomComplet"
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
				$.when(promise).done(function(fetchedUsers){
					API.storedCollection = fetchedUsers;
				});
				return promise;
			}
		}
	};

	var channel = Radio.channel('users');
	channel.reply('user:entities', API.getEntities );

	return;
});
