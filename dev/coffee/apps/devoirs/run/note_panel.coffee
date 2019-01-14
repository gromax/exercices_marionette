define ["jst","marionette"], (JST,Marionette) ->
	Panel = Marionette.View.extend {
		template: window.JST["devoirs/run/note-panel"]

		serializeData: ->
			exofiches = @options.exofiches.where({idFiche: @model.get("idFiche")})
			faits = _.where(this.options.faits.toJSON(), {aUF: @model.get("id")})
			data = _.clone(@model.attributes)
			data.note = @model.calcNote(exofiches, faits, @options.notation)
			return data
	}

	return Panel
