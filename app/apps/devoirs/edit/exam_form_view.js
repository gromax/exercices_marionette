define(["jst","apps/common/item_form_view"], function(JST,FormView){
	var View = FormView.extend({
		itemMarkup:"exam",
		title: "Modification",
		template: window.JST["devoirs/edit/exam-form"],
	});

	return View;
});
