define(["app", "marionette", "apps/common/loading_view", "apps/common/list_layout","apps/devoirs/list/list_panel", "apps/devoirs/list/list_view", "apps/devoirs/show/show_view"], function(app, Marionette, LoadingView, Layout, Panel, ListView, ShowView){

	var Controller = Marionette.Object.extend({
		channelName: 'entities',

		list: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var listItemsLayout = new Layout();
			var listItemsPanel = new Panel();
			var channel = this.getChannel();

			require(["entities/dataManager"], function(){
				var fetching = channel.request("prof:entities");
				$.when(fetching).done(function(devoirs, userfiches, exofiches, faits){
					var listItemsView = new ListView({
						collection: devoirs
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
								$.when(savingItem).done(function(){
									items.add(newItem);
									view.trigger("dialog:close");
									listItemsView.flash(newItem);
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										alert("An unprocessed error happened. Please try again!");
									}
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
							$.when(updatingItem).done(function(){
								childView.render();
								childView.flash("success");
							}).fail(function(response){
								alert("Une erreur inconnue s'est produite. Réessayez !");
							});
						} else {
							alert("Une erreur inconnue s'est produite. Réessayez !");
						}
					});

					listItemsView.on("item:delete", function(childView,e){
						childView.remove();
					});

					app.regions.getRegion('main').show(listItemsLayout);
				});

			});



		}
	});

	return new Controller();
});
