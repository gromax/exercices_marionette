define(["jst","apps/common/item_form_view"], function(JST,FormView){
	var view = FormView.extend({
		itemMarkup:"devoir",
		getTemplate: function(){
			// editMode compte aussi pour un new
			if (this.options.editMode) {
				return window.JST["devoirs/edit/fiche-edit"];
			} else {
				return window.JST["devoirs/edit/fiche-show"];
			}
		},

		events: {
			"click a.js-edit": "editClicked",
			"click button.js-submit": "submitClicked",
		},

		editClicked: function(e){
			e.preventDefault();
			this.trigger("devoir:edit", this);
		},

		initialize: function() {
			// si editMode = false, c'est une showView, dans ce cas
			// on prépare le generateTitle pour le cas où on basculerait au editMode
			if (!this.options.editMode) {
				this.options.generateTitle = true;
			}
			// title n'est utilisé que pour le cas d'un edit ou d'un new
			if (this.model.get("id")) {
				this.title = "Modifier le devoir : "+ this.model.get("nom");
			} else {
				this.title = "Nouveau devoir";
			}
		},

		onRender: function(){
			// Dans le template de edit, le title n'est pas inclus pour le cas
			// où on appelle le template dans un popup
			if(this.options.generateTitle && this.options.editMode){
				var $title = $("<h1>", { text: this.title });
				this.$el.prepend($title);
			}
		},

		goToEdit: function(){
			this.options.editMode = true;
			this.render();
		},

		goToShow: function(){
			this.options.editMode = false;
			this.render();
		}
	});

	return view;
});
