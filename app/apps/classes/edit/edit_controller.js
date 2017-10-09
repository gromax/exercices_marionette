define(["app","apps/common/loading_view","apps/common/missing_item_view","apps/classes/edit/edit_view"], function(app, LoadingView, MissingView, EditView){
	var Controller = {
		edit: function(id){
			var loadingView = new LoadingView({
				title: "Modification d'une classe",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);

			require(["backbone.radio", "entities/classe"], function(Radio,Item){
				var channel = Radio.channel('classes');
				var fetchingItem = channel.request("classe:entity", id);
				$.when(fetchingItem).done(function(item){
					var view;
					if(item !== undefined){
						view = new EditView({
							model: item,
							generateTitle: true
						});

						view.on("form:submit", function(data){
							var updatingItem = item.save(data);
							if(updatingItem){
								$.when(updatingItem).done(function(){
									app.trigger("classe:show", item.get("id"));
								}).fail(function(response){
									if(response.status == 422){
										view.triggerMethod("form:data:invalid", response.responseJSON.errors);
									}
									else{
										alert("Erreur inconnue. Essayez à nouveau !");
									}
								});
							}
							else {
								view.triggerMethod("form:data:invalid", item.validationError);
							}
						});
					}
					else
					{
						view = new MissingView({message:"Cette classe n'existe pas !"});
					}
					app.regions.getRegion('main').show(view);
				});
			});
		}
	}

	return Controller;
});
