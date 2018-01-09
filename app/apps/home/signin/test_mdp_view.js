define(["jst","apps/common/item_form_view"], function(JST,FormView){
	var View = FormView.extend({
		itemMarkup:"signin",

		initialize:function(){
			this.title = "Rejoindre la classe "+this.model.get("nomClasse");
		},

		template: window.JST["home/signin/test-mdp-form"],
	});

	return View;
});
