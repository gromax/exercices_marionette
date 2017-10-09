define(["apps/classes/common/classe_form_view"], function(FormView){
	var EditView = FormView.extend({
		initialize: function() {
			this.title = "Modifier la classe : "+ this.model.get("nom");
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
