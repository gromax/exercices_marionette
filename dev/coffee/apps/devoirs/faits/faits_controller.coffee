define [
	"app"
	"marionette"
	"apps/common/alert_view"
	"apps/common/missing_item_view"
	"apps/devoirs/faits/faits_view"
], (
	app,
	Marionette,
	AlertView,
	MissingView,
	ListView
) ->
	Controller = Marionette.Object.extend {
		channelName: 'entities',

		listForProf: (idUF, idEF) ->
			# idUF : est l'association user/fiche, l'occurence d'un devoir
			# idEF : est l'assoication exercice/fiche, référence d'un exercice à l'intérieur d'un devoir
			# Chaque exercice fait est associé à un UF et un EF

			app.trigger("header:loading", true)
			channel = this.getChannel()

			require ["entities/dataManager"], () ->
				fetching = channel.request("custom:entities",["userfiches", "exofiches", "faits", "users"])
				$.when(fetching).done( (userfiches, exofiches, faits, users) ->
					idUF = Number(idUF)
					idEF = Number(idEF)
					userfiche = userfiches.get(idUF)
					exofiche = exofiches.get(idEF)
					if (userfiche isnt undefined) and (exofiche isnt undefined)
						# Je cherche le numéro du EF dans la fiche
						idFiche = userfiche.get("idFiche")
						EFs = exofiches.where({idFiche : idFiche})
						index = _.findIndex(EFs, (it) ->
							return it.get("id") is idEF
						)

						idUser = userfiche.get("idUser")
						user = users.get(idUser)
						app.Ariane.add [
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche}
							{ text:"Fiches élèves", e:"devoir:showUserfiches", data:idFiche, link:"devoir:"+idFiche+"/fiches-eleves"}
							{ text:user.get("nomComplet")+" #"+idUF, e:"devoirs:fiche-eleve:show", data:idUF, link:"devoirs/fiche-eleve:"+idUF }
							{ text:"Exercice "+(index+1) }
						]

						listItemsView = new ListView {
							collection: faits
							filter: (child, index, collection) ->
								return (child.get("aUF") is idUF) and (child.get("aEF") is idEF)
							showDeleteButton:true
						}

						listItemsView.on "item:show", (childView, args) ->
							model = childView.model;
							app.trigger("exercice-fait:run", model.get("id"))

						listItemsView.on "item:delete", (childView,e) ->
							model = childView.model
							idModel = model.get("id")
							destroyRequest = model.destroy()
							app.trigger("header:loading", true)
							$.when(destroyRequest).done( ()->
								childView.remove()
								channel.request("aUE:destroy:update", idModel)
							).fail( (response)->
								alert("Erreur. Essayez à nouveau !")
							).always( ()->
								app.trigger("header:loading", false)
							)

						app.regions.getRegion('main').show(listItemsView)

					else
						view = new MissingView()
						app.regions.getRegion('main').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false);
				)

		listForEleve: (idUF, idEF) ->
			#   idUF : est l'association user/fiche, l'occurence d'un devoir
			#   idEF : est l'assoication exercice/fiche, référence d'un exercice à l'intérieur d'un devoir
			app.trigger("header:loading", true)
			channel = this.getChannel()
			require ["entities/dataManager"], () ->
				fetching = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetching).done( (userfiches, exofiches, faits) ->
					idUF = Number(idUF)
					idEF = Number(idEF)
					userfiche = userfiches.get(idUF)
					exofiche = exofiches.get(idEF)
					if (userfiche isnt undefined) and (exofiche isnt undefined)
						filter = (child, index, collection) ->
							return (child.get("aUF") is idUF) and (child.get("aEF") is idEF)
						# Je cherche le numéro du EF dans la fiche
						EFs = exofiches.where {idFiche : userfiche.get("idFiche")}
						index = _.findIndex(EFs, (it) ->
							return it.get("id") is idEF
						)

						app.Ariane.add [
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF}
							{ text:"Exercice "+(index+1) }
						]

						# Partie commune
						listItemsView = new ListView {
							collection: faits
							filter: filter
							showDeleteButton:false
						}

						listItemsView.on "item:show", (childView, args) ->
							model = childView.model
							app.trigger("exercice-fait:run", model.get("id"))

						app.regions.getRegion('main').show(listItemsView)
					else
						view = new MissingView()
						app.regions.getRegion('main').show(view)
				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

		unfinishedForEleve: ->
			app.trigger("header:loading", true)
			channel = this.getChannel()
			require ["entities/dataManager"], () ->
				fetching = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetching).done( (userfiches, exofiches, faits) ->
					filter = (child, index, collection) ->
						# Si l'exercice n'est pas terminé, encore faut-il qu'il puisse l'être
						finished = child.get("finished")
						if not finished
							uf = userfiches.get(child.get("aUF"))
							if uf.get("actif") and uf.get("ficheActive")
								return true
						false

					# Partie commune
					listItemsView = new ListView {
						collection: faits
						filter: filter
						showDeleteButton:false
					}

					listItemsView.on "item:show", (childView, args) ->
						model = childView.model
						app.trigger("exercice-fait:run", model.get("id"))

					app.regions.getRegion('main').show(listItemsView)


				).fail( (response) ->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( () ->
					app.trigger("header:loading", false);
				)

	}

	return new Controller()

