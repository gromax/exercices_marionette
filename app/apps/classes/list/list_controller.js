define(["app", "marionette", "apps/common/loading_view", "apps/common/list_layout","apps/classes/list/list_panel", "apps/classes/list/list_view", "apps/classes/new/new_view", "apps/classes/edit/edit_view"], function(app, Marionette, LoadingView, Layout, Panel, ListView, NewView, EditView){

	var Controller = Marionette.Object.extend({
		channelName: 'classes',

		list: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var listItemsLayout = new Layout();
			var listItemsPanel = new Panel();
			var channel = this.getChannel();

			require(["entities/classe","entities/classes"], function(Classe){
				var fetching = channel.request("classe:entities");
				$.when(fetching).done(function(items){
					var listItemsView = new ListView({
						collection: items
					});

					listItemsLayout.on("render", function(){
						listItemsLayout.getRegion('panelRegion').show(listItemsPanel);
						listItemsLayout.getRegion('itemsRegion').show(listItemsView);
					});

					listItemsPanel.on("classe:new", function(){
						var newItem = new Classe();
						var view = new NewView({
							model: newItem
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
						app.trigger("classe:show", model.get("id"));
					});

					listItemsView.on("item:edit",function(childView, args){
						var model = childView.model;
						var view = new EditView({
							model:model
						});

						view.on("form:submit", function(data){
							var updatingItem = model.save(data);
							if(updatingItem){
								$.when(updatingItem).done(function(){
									childView.render();
									view.trigger("dialog:close");
									childView.flash("success");
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									} else {
										alert("An unprocessed error happened. Please try again!");
									}
								});
							} else {
								this.triggerMethod("form:data:invalid", model.validationError);
							}
						});

						app.regions.getRegion('dialog').show(view);
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
