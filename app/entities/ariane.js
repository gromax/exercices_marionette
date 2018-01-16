define([], function(){

	var ArianeItem = Backbone.Model.extend({
	});

	var ArianeCollection = Backbone.Collection.extend({
		model:ArianeItem,
	});

	var home = {
		text: "<i class='fa fa-home'></i>",
		link: "home",
		e: "home:show",
		active: false
	};

	var ArianeController = {
		collection: new ArianeCollection([ home ]), // comme on ne parse pas ici, le active restera false

		reset: function(models){
			models.unshift(home);
			_.each(models, function(item){ item.active = true; });
			_.last(models).active = false;
			this.collection.reset(models);
		},

		add: function(model){
			_.last(this.collection.models).set("active",true);
			if (_.isArray(model)) {
				_.each(model, function(item){ item.active = true; });
				_.last(model).active = false;
			} else {
				model.active = false;
			}
			this.collection.add(model);
		},
	}

	return ArianeController;
});
