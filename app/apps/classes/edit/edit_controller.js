define(["app","marionette","apps/common/loading_view","apps/common/missing_item_view","apps/classes/edit/edit_view"], function(app, Marionette, LoadingView, MissingView, EditView){
	var Controller = Marionette.Object.extend({
		channelName: "entities",
		edit: function(id){
			var loadingView = new LoadingView({
				title: "Modification d'une classe",
				message: "Chargement des données."
			});

			app.regions.getRegion('main').show(loadingView);
			var channel = this.getChannel();
			require(["entities/dataManager"], function(){
				var fetchingClasse = channel.request("classe:entity",id);
				$.when(fetchingClasse).done(function(item){
					var view;
					if(item !== undefined){
						app.Ariane.add([
							{ text:item.get("nom"), e:"classe:show", data:id, link:"classe:"+id},
							{ text:"Modification", e:"classe:edit", data:id, link:"classe:"+id+"/edit"},
						]);
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
	});

	return new Controller();
});
