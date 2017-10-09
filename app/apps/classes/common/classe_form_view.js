define(["jst","apps/common/item_form_view"], function(JST,FormView){
	var View = FormView.extend({
		itemMarkup:"classe",
		template: window.JST["classes/common/classe-form"],

	});

	return View;
});
