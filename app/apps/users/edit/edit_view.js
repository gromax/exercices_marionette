define(["apps/users/common/user_form_view"], function(FormView){
	var EditView = FormView.extend({
		initialize: function() {
			this.title = "Modifier "+ this.model.get("prenom")+" "+ this.model.get("nom");
		},

		onRender: function(){
			if(this.options.generateTitle){
				var $title = $("<h1>", { text: this.title });
				this.$el.prepend($title);
			}
		}
	});

	return EditView;
});
