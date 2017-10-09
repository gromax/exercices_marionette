//define(["marionette","jquery-ui","bootstrap"], function(Marionette){
define(["marionette","jquery-ui"], function(Marionette){
	var Manager = new Marionette.Application();

	Manager.navigate = function(route, options){
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	Manager.getCurrentRoute = function(){
		return Backbone.history.fragment
	};

	Manager.on("before:start", function(){
		var RegionContainer = Marionette.View.extend({
			el: "#app-container",
			regions: {
				header: "#header-region",
				main: "#main-region",
				dialog: "#dialog-region"
			}
		});

		Manager.regions = new RegionContainer();

		Manager.regions.getRegion("dialog").onShow = function(region,view){
			var self = this;
			var closeDialog = function(){
				self.stopListening();
				self.empty();
				self.$el.dialog("destroy");
			};
			this.listenTo(view, "dialog:close", closeDialog);
			this.$el.dialog({
				modal: true,
				title: view.title,
				width: "auto",
				close: function(e, ui){
					closeDialog();
				}
			});
		};
	});

	Manager.on("start", function(){
		var historyStart = function() {
			require(["apps/home/home_app", "apps/header/header_app", "apps/users/users_app", "apps/classes/classes_app", "apps/exercices/exercices_app"], function(){
				Manager.trigger("header:show");
				if(Backbone.history){
					Backbone.history.start();
					if(Manager.getCurrentRoute() === ""){
						Manager.trigger("home:show");
					}
				}
			});
		}

		require(["backbone.radio","entities/session"], function(Radio){
			var channel = Radio.channel('session');
			Manager.Auth = channel.request("session:entity", historyStart);
		});
	});

	return Manager;
});

