define([
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/list_layout",
	"apps/devoirs/list/list_panel",
	"apps/devoirs/list/list_view",
	"apps/devoirs/edit/edit_fiche_view"
], function(
	app,
	Marionette,
	AlertView,
	Layout,
	Panel,
	ListView,
	ShowView
){

	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		list: function(){
			app.trigger("header:loading", true);
			var listItemsLayout = new Layout();
			var listItemsPanel = new Panel();
			var channel = this.getChannel();

			require(["entities/devoir", "entities/dataManager"], function(Item){
				var fetching = channel.request("custom:entities",["fiches"]);
				$.when(fetching).done(function(fiches){
					var listItemsView = new ListView({
						collection: fiches
					});

					listItemsLayout.on("render", function(){
						listItemsLayout.getRegion('panelRegion').show(listItemsPanel);
						listItemsLayout.getRegion('itemsRegion').show(listItemsView);
					});

					listItemsPanel.on("devoir:new", function(){
						var newItem = new Item();
						var view = new ShowView({
							model: newItem,
							editMode: true,
						});

						view.on("form:submit", function(data){
							var savingItem = newItem.save(data);
							if (savingItem){
								app.trigger("header:loading", true);
								$.when(savingItem).done(function(){
									fiches.add(newItem);
									view.trigger("dialog:close");
									listItemsView.flash(newItem);
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										if(response.status == 401){
											alert("Vous devez vous (re)connecter !");
											view.trigger("dialog:close");
											app.trigger("home:logout");
										} else {
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/020]");
										}
									}
								}).always(function(){
									app.trigger("header:loading", false);
								});
							} else {
								view.triggerMethod("form:data:invalid",newItem.validationError);
							}

						});
						app.regions.getRegion('dialog').show(view);
					});

					listItemsView.on("item:show",function(childView, args){
						var model = childView.model;
						app.trigger("devoir:show", model.get("id"));
					});

					listItemsView.on("item:setAttribute", function(childView, attr_name){
						// attr_name sera soit visible soit actif
						var model = childView.model;
						var attr_value = model.get(attr_name);
						model.set(attr_name, !attr_value);
						var updatingItem = model.save();
						if (updatingItem) {
							app.trigger("header:loading", true);
							$.when(updatingItem).done(function(){
								childView.render();
								childView.flash("success");
							}).fail(function(response){
								if(response.status == 401){
									alert("Vous devez vous (re)connecter !");
									app.trigger("home:logout");
								} else {
									alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/021]");
								}
							}).always(function(){
								app.trigger("header:loading", false);
							});
						} else {
							alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code x/022]");
						}
					});

					listItemsView.on("item:delete", function(childView,e){
						var model = childView.model;
						var idFiche = model.get("id");
						if (confirm("Supprimer le devoir « "+model.get("nom")+" » ?")) {
							var destroyRequest = model.destroy();
							app.trigger("header:loading", true);
							$.when(destroyRequest).done(function(){
								childView.remove();
								channel.request("fiche:destroy:update", idFiche);
							}).fail(function(response){
								alert("Erreur. Essayez à nouveau !");
							}).always(function(){
								app.trigger("header:loading", false);
							});
						}

					});

					app.regions.getRegion('main').show(listItemsLayout);
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
				})
			});
		}
	});

	return new Controller();
});
