define(["app", "apps/common/loading_view", "apps/common/list_layout","apps/classes/list/list_panel", "apps/classes/list/list_view", "apps/classes/new/new_view", "apps/classes/edit/edit_view"], function(app, LoadingView, Layout, Panel, ListView, NewView, EditView){

	var Controller ={
		list: function(){
			var loadingView = new LoadingView();
			app.regions.getRegion('main').show(loadingView);
			var listItemsLayout = new Layout();
			var listItemsPanel = new Panel();

			require(["backbone.radio", "entities/rustined_collection", "entities/classe","entities/classes"], function(Radio, RustinedCollection, Classe){
				var channel=Radio.channel('classes');
				var fetching = channel.request("classe:entities");
				$.when(fetching).done(function(items){
					var rustinedItems = RustinedCollection({
						collection: items,
					});

					var listItemsView = new ListView({
						collection: rustinedItems
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
									var newItemView = listItemsView.children.findByModel(newItem);
									// check whether the new user view is displayed (it could be
									// invisible due to the current filter criterion)
									if(newItemView){
										newItemView.flash("success");
									}
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

					listItemsView.on("childview:item:show",function(childView, args){
						var model = childView.model;
						app.trigger("classe:show", model.get("id"));
					});

					listItemsView.on("childview:item:edit",function(childView, args){
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

					listItemsView.on("childview:item:delete", function(childView,e){
						// du fait du fonctionnement de l'intermédiaire, la fonction remove ne sera pas appelée
						// et il n'y aura pas de fadeout
						childView.model.destroy();
						//childView.remove();
					});

					app.regions.getRegion('main').show(listItemsLayout);
				});

			});



		}
	};

	return Controller;
});
