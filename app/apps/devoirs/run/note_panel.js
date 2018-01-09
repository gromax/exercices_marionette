define(["jst","marionette"], function(JST,Marionette){
	var Panel = Marionette.View.extend({
		template: window.JST["devoirs/run/note-panel"],

		serializeData:function(){
			var exofiches = this.options.exofiches.where({idFiche: this.model.get("idFiche")});
			var faits = _.where(this.options.faits.toJSON(), {aUF: this.model.get("id")});
			data = _.clone(this.model.attributes);
			data.note = this.model.calcNote(exofiches, faits);
			return data;
		},
	});

	return Panel;
});
