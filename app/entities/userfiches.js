define(["entities/userfiche"], function(Item){

	var ItemsCollection = Backbone.Collection.extend({
		url: "api/assosUF",
		model: Item,

		getNumberForEachUser: function(){
			// renvoie une liste pour chaque idEleve, le nombre de fiche de cette liste qui lui est associé
			var output = {};
			var liste = this.models;
			for (item of liste){
				id = item.get("idUser");
				if (output[id]) {
					output[id]++;
				} else {
					output[id] = 1;
				}
			}
			return output;
		}
	});


	return ItemsCollection;
});
