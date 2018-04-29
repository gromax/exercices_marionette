define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/users/show/show_view",
	"apps/common/missing_item_view"
], function(
	app,
	Marionette,
	AlertView,
	ShowView,
	MissingView
){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		showUser: function(id, isMe){
			app.trigger("header:loading", true);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				if (isMe) {
					var fetchingUser = channel.request("user:me");
				} else {
					var fetchingUser = channel.request("user:entity", id);
				}
				$.when(fetchingUser).done(function(user){
					var view;
					if(user !== undefined){
						if (isMe) {
							app.Ariane.add({ text:"Mon compte", e:"user:show", data:id, link:"user:"+id});
						} else {
							app.Ariane.add({ text:user.get("nomComplet"), e:"user:show", data:id, link:"user:"+id});
						}

						view = new ShowView({
							model: user
						});
						view.on("user:edit", function(user){
							app.trigger("user:edit", user.get("id"));
						});
						view.on("user:editPwd", function(user){
							app.trigger("user:editPwd", user.get("id"));
						});
					}
					else{
						if (isMe) {
							app.Ariane.add({ text:"Mon compte", e:"user:show", data:id, link:"user:"+id});
						} else {
							app.Ariane.add({ text:"Utilisateur inconnu", e:"user:show", data:id, link:"user:"+id});
						}
						view = new MissingView({ message:"Cet utilisateur n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				}).fail(function(response){
					if(response.status == 401){
						alert("Vous devez vous (re)connecter !");
						app.trigger("home:logout");
					} else {
						var alertView = new AlertView();
						app.regions.getRegion('main').show(alertView);
					}
				}).always(function(){
					app.trigger("header:loading", false);
				});
			});
		}
	});

	return new Controller();
});
