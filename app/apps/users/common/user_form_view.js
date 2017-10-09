define(["jst","apps/common/item_form_view"], function(JST,FormView){
	var View = FormView.extend({
		itemMarkup:"user",
		template: window.JST["users/common/user-form"],

		serializeData:function(){
			var data = _.clone(this.model.attributes);
			data.showPWD = this.showPWD || false;
			data.ranks = this.ranks || false;
			return data;
		},

	});

	return View;
});
