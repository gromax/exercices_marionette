define(["marionette","jquery-ui","bootstrap"], function(Marionette){
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
				ariane: "#ariane-region",
				message: "#message-region",
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
				view.trigger("dialog:closed");
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

	// Morceau de code pour réagir à un changement de zoom
	var elFrame = $('#zoomframe')[0];
	$(elFrame.contentWindow).resize(function() {
		$(window).trigger('zoom');
		Manager.trigger('zoom', window.devicePixelRatio);
	});


	Manager.on("start", function(){
		Manager.version = "2.2.327";
		var historyStart = function() {
			require([
				"apps/header/header_app",
				"apps/ariane/ariane_app",
				"apps/common/apps",
				"apps/users/apps",
				"apps/classes/apps",
				"apps/devoirs/apps",
				"apps/exercices/apps",
				"apps/home/apps",
				"apps/messages/apps"
			], function(){
				Manager.trigger("ariane:show");
				Manager.trigger("header:show");
				if(Backbone.history){
					Backbone.history.start();
					if(Manager.getCurrentRoute() === ""){
						Manager.trigger("home:show");
					}
				}
			});
		}

		require(["entities/ariane", "backbone.radio","entities/session"], function(ArianeController, Radio){
			var channel = Radio.channel('entities');
			Manager.Ariane = ArianeController;
			Manager.Auth = channel.request("session:entity", historyStart);
			Manager.settings = {}
		});
	});

	return Manager;
});

