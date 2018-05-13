define [
	"app",
	"marionette",
	"apps/common/alert_view",
	"apps/common/missing_item_view",
	"apps/exercices/show/show_view",
	"apps/exercices/show/answers_view"
], (
	app,
	Marionette,
	AlertView,
	MissingView,
	View,
	AnswersView
) ->
	# Il faudra envisager un exercice vide
	# Ou un exercice dont le fichier js n'existe pas
	# et éventuellement un chargement

	Controller = Marionette.Object.extend {
		channelName: "entities"

		show: (id, params) ->
			app.trigger("header:loading", true)

			###
			Envoyé pour un test direct
			Ou bien pour l'exécution d'un exofiche


			id permet de trouver l'exercice
			d'éventuelles options permettent de paraméter l'exécution de l'exercices
			 -> Elles sont fournies lors d'un test par l'interface adhoc ou si l'exercice est lancé par un exofiche
			 Les inputs. sont forcément fournis par une entrée UE, ou bien sont nulls et initialisés par l'exercice
			 Les liens de sauvegardes : Soit c'est un item de note déjà existant, soit ce sont des idEF et idUF pour en créer un, soit rien du tout=> pas de sauvegarde
			 les answers = peuvent être fournis par le UE

			 le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
			 créera la promesse savingUE
			 ajoutera au savingUE le when -> faits.add() le cas échéant
			 retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()

			 le paramètre save est une fonction qui se charge de l'éventuelle sauvegarde
			 La gestion de optionsValues est un peu complexe :
			 - on ne transmet à l'exercice que les valeurs.
			 - L'exercice, en se chargeant, récupère toutes les infos sur les options avec les descriptions...
			 - Et puis pour initialiser l'exercice on doit lui transmettre les valeurs
			 - C'est donc l'exercice (exercice.js) qui se charge de mêler les infos et les valeurs des options et de le renvoyer à la vue
			###
			exo_default_params = {
				optionsValues:null
				showOptionsButton:false
				showReinitButton:false
				showAnswersButton:false
				ue: false
				save:null
			}
			exo_params = _.extend( exo_default_params, params)
			if exo_params.ue
				inputs = JSON.parse(exo_params.ue.get("inputs"))
				answersData = JSON.parse(exo_params.ue.get("answers"))
			else
				inputs = {}
				answersData = {}
			self = @
			channel = @getChannel()
			require ["entities/exercice"], (Exercice) ->
				fetchingExercice = channel.request("exercice:entity", id, exo_params.optionsValues, inputs)
				$.when(fetchingExercice).done( (exo)->
					baremeTotal = exo.baremeTotal()
					pied = new Backbone.Model({ finished:false, note:0 })
					view = new View {
						model: exo
						pied:pied
						showOptionsButton: exo_params.showOptionsButton
						showReinitButton: exo_params.showReinitButton
						showAnswersButton: exo_params.showAnswersButton
					}
					note = 0

					# Recherche la brique ayant le focus en activant/désactivant les flags en chemin
					# renvoie la brique ayant le focus ce qui sera utile lorsqu'on lira un exercice sauvegardé
					MAJ_briques = (exoview)->
						briques = exo.getBriquesUntilFocus()
						exoview.showItems(b) for b in briques
						b=briques.pop()
						if b isnt false
							exoview.setFocus(b)
						else
							pied.set("finished",true)
						return b # renvoie la brique ayant le focus

					if exo_params.showReinitButton
						view.on "button:reinit", ()->
							###
							 exo_params contient des informations de sauvegarde avec la fonction save
							 il contient aussi, s'il a déjà été enregistré, un objet UE
							 UE contient les inputs
							 En cas de réinit, la fonction de sauvegarde peut être conservée
							 En revanche le ue doit être effacé
							###
							self.show(id, _.omit(exo_params,"ue"))

					if exo_params.showOptionsButton
						view.on "button:options", ->
							modelOptions = new Backbone.Model(exo.get("options"))
							view.showOptionsView(modelOptions)

						view.on "options:form:submit", (submitedDataOptions) ->
							new_exo_params = _.extend(exo_params, { optionsValues:submitedDataOptions })
							self.show(id,new_exo_params)

					if exo_params.showAnswersButton
						view.on "button:answers", ()->
							aView = new AnswersView({answers:answersData})
							aView.on "form:cancel", ()->
								aView.trigger("dialog:close")
							aView.on "form:submit", (submitedAnswers)->
								exo_params.ue.set("answers", JSON.stringify(submitedAnswers))
								aView.trigger("dialog:close")

								channel.once "update:note", (note)->
									app.trigger("header:loading", true)
									savingUE = exo_params.ue.save()
									$.when(savingUE).fail( (response)->
										if response.status is 401
											alert("Vous devez vous (re)connecter !")
											app.trigger("home:logout")
										else
											alert("Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code "+response.status+"/023]")
									).always( ()->
										app.trigger("header:loading", false)
									)

								self.show(id, exo_params)
							app.regions.getRegion('dialog').show(aView)

					getToTrashItems = (bV) ->
						return bV.itemsView.children.filter( (it)->
							tT = it.model.get("toTrash")
							def = it.defaultToTrash
							return (tT is true) or (tT isnt false) and  def
						)

					# Traitement après vérif
					# Dans le but d'enchaîner le traitement initial d'un exercice sauvegardé
					# la fonction renvoie le nouveau focus
					traitement_final = (bv, m, v, mV)->
						# bv = brique_view => La brique d'exercice dans laquelle s'effectue la vérif
						# m = model => le model associé à la brique
						# v = verifs => le résultats des vérifications menées selon les réponse utilisateur aux questions de cette brique
						# mV = model_validation => les données utilisateur traitées
						pied.set("note",Math.ceil(note))
						# Suppression des items d'input
						it.remove() for it in getToTrashItems(bv)
						# Ajout des items de correction
						m.get("items").add(v.add)
						# La brique est marquée comme terminée
						m.set({ done: true, focus: false })
						bv.unsetFocus()
						# recherche du prochain focus
						focusedBrique = MAJ_briques(view)
						# Exécution de traitemens posts typiquement sur un graphique
						# Ils doivent être effectués après le render pour que l'objet du dom existe
						# on se contente donc de placer un lien sur les données qui s'efface dès l'action effectuée,
						# au moment du render
						bv.setPostVerificationRenderData(mV)
						return focusedBrique

					view.on "brique:form:submit", (data,brique_view)->
						model = brique_view.model

						model_validation = model.validation(data)


						validation_errors = _.compact( _.pluck(_.values( model_validation), "error" ) )
						if validation_errors.length is 0
							verifs = model.verification(model_validation)
							# calcul de la note

							note = verifs.note*model.get("bareme")*100/baremeTotal + note

							answersData = _.extend(answersData, data)

							if exo_params.save
								# Puisqu'on valide, c'est qu'on a une brique de validation
								# Si c'est la seule, c'est la dernière et l'exo est terminé.

								bWithValidation = (item.get("items").where({type:"validation"}) for item in exo.get("briquesCollection").models)
								finished = _.flatten( bWithValidation).length <=1

								###
								 le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
								 L'objet contient une clé ue qui sera accessible avec le bon contexte (d'où l'utilisation de apply)
								 si c'est un exercice repris, le ue existe tout de suite, sinon il est false au début
								 L'exécution de la function crée ue s'il n'existait déjà
								 ce qui servira notamment pour un exercice en plus de 1 étape
								 la fonction créera la promesse savingUE
								 ajoutera au savingUE le when -> faits.add() le cas échéant
								 retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()
								###
								savingUE = exo_params.save.apply(exo_params,[note, answersData, exo.get("inputs"), finished])
								if savingUE
									$.when(savingUE).done( ()->
										traitement_final(brique_view, model, verifs)
									).fail( (response)->
										alert "Erreur inconnue. Essayez à nouveau ou prévenez l'administrateur [code #{response.status}/023]"
									)
								else
									traitement_final(brique_view, model, verifs, model_validation)
							else
								# On ne sauvegarde pas, on exécuter directement le traitement final
								traitement_final(brique_view, model, verifs, model_validation)
						else
							brique_view.onFormDataInvalid(model_validation)

					###
					 Quand la vue est dans le dom, on lance l'affichage des items
					 Ce traitement n'est fait qu'une fois au début
					 Dans le cas d'un exercice sauvegardé, il y a des answers à traiter
					 Alors on cherche le focus, on vérifie d'éventuelles réponses
					 si les réponses sont valides, on les traite et on cherche le nouveau focus.
					 Cela jusqu'à atteindre la fin de l'exercice ou un focus pour lequel answersData ne contient pas de réponses valides
					###
					view.on "render", (v)->
						model = MAJ_briques(v)
						if (model isnt false) and not _.isEmpty(answersData)
							# Il s'agit de la lecture d'une sauvegarde d'exercice
							# model est le focus. Normalement, l'exercice contenant au moins une question, model soit être !==false
							go_on = true
							while go_on and (model isnt false)
								# On s'arêtera si une validation renvoie false ou si on arrive à la fin de l'exercice
								brique_view = view.listView.children.findByModel(model)

								model_validation = model.validation(answersData)
								validation_errors = _.compact( _.pluck(_.values( model_validation), "error" ) )
								if validation_errors.length is 0
									verifs = model.verification(model_validation)
									# calcul de la note
									note = verifs.note*model.get("bareme")*100/baremeTotal + note
									model = traitement_final(brique_view, model, verifs, model_validation)
								else
									# La validation n'ayant pas abouti, on ne va pas plus loin
									go_on = false

							if exo_params.ue
								# Lors d'un refresh avec changement de answers, la note peut avoir changé
								exo_params.ue.set("note",note)
								channel.trigger("update:note")

					app.regions.getRegion('main').show(view)

				).fail( (response)->
					view = new MissingView({ message:"Cet exercice n'existe pas !" })
					app.regions.getRegion('main').show(view)
				).always( ()->
					app.trigger("header:loading", false)
				)

		execExoForTest: (id)->
			# Fonction pour éviter d'attaquer show depuis l'extérieur
			@show(id,{ showOptionsButton:true, showReinitButton:true })

		execExoFicheForProf: (id)->
			# Il faut charger le exofiche correspondant à id pour obtenir le idE et data.options
			channel = @getChannel()
			that = @
			app.trigger("header:loading", true)
			require ["entities/dataManager"], ->
				fetchingExoFiches = channel.request("custom:entities", ["exofiches"])
				$.when(fetchingExoFiches).done( (exofiches)->
					exofiche = exofiches.get(id)
					if exofiche
						idFiche = exofiche.get('idFiche')
						liste = exofiches.where({"idFiche":idFiche})
						index = 1+_.findIndex(liste, (item)->
							return item.get("id") is id
						)

						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Exercices", e:"devoir:showExercices", data:idFiche, link:"devoir:"+idFiche+"/exercices"},
							{ text:"Exercice "+index, e:"exercice-fiche:run", data:id, link:"exercice-fiche:"+id}
						])

						idE = exofiche.get("idE")
						# On ne doit transmettre que des options brutes
						exoficheOptions = _.mapObject exofiche.get("options"), (val,key)->
							return val.value
						that.show(idE, { optionsValues:exoficheOptions, showReinitButton:true })
					else
						view = new MissingView({ message:"Cet exercice n'existe pas !" })
						app.Ariane.add([
							{ text:"Fiche inconnue" }
						])
						app.regions.getRegion('main').show(view)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

		execExoFicheForEleve: (idUF, idEF) ->
			self = @
			channel = @getChannel()
			app.trigger("header:loading", true)
			require ["entities/aUE", "entities/dataManager"], (ItemUE) ->
				fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (userfiches, exofiches, faits)->
					exofiche = exofiches.get(idEF)
					userfiche = userfiches.get(idUF)
					if exofiche and userfiche
						# Il faut récupérer le numéro de l'exercice dans le devoir
						liste = exofiches.where({"idFiche":userfiche.get("idFiche")})
						index = _.findIndex liste, (item)->
							return item.get("id") is idEF
						app.Ariane.add [
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
							{ text:"Exercice "+(index+1)+"/"+liste.length, e:"exercice-fiche:run", data:[idEF, idUF], link:"user-fiche:"+idUF+"/exercice-fiche:" + idEF },
						]
						idE = exofiche.get("idE")
						# On ne doit transmettre que des options brutes
						exoficheOptions = _.mapObject exofiche.get("options"), (val,key)->
							return val.value

						###
						 le paramètre save sera une fonction prenant (note, answers, inputs, finished) en argument
						 L'objet contient une clé ue qui sera accessible avec le bon contexte (d'où l'utilisation de apply)
						 si c'est un exercice repris, le ue existe tout de suite, sinon il est false au début
						 L'exécution de la function crée ue s'il n'existait déjà
						 ce qui servira notamment pour un exercice en plus de 1 étape
						 la fonction créera la promesse savingUE
						 ajoutera au savingUE le when -> faits.add() le cas échéant
						 retournera le savingUE à l'exercice pour qu'il puisse y lier le when -> traitement_final()
						###

						saveFunction = false
						if userfiche.get("actif") and userfiche.get("ficheActive")
							# La fiche étant active, l'exercice sera sauvegardé
							saveFunction = (note, answers, inputs, finished)->
								newUE = false
								ue = this.ue # cette commande nécessite que la fonction soit appelée dans le bon contexte
								unless ue
									ue = new ItemUE {
										aEF: Number idEF
										aUF: Number idUF
										inputs: JSON.stringify(inputs)
									}
									newUE = true

								savingUE = ue.save {
									note: Math.ceil(note)
									answers: JSON.stringify(answers)
									finished: finished
								}

								if newUE
									thisObj = @
									$.when(savingUE).done( ()->
										faits.add(ue)
										thisObj.ue = ue
									)

								return savingUE

						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:true })
					else
						view = new MissingView({ message:"Cet exercice n'existe pas !" })
						app.regions.getRegion('main').show(view)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

		execUEForProf: (idUE)->
			self = @
			channel = @getChannel()
			app.trigger("header:loading", true)
			require ["entities/dataManager"], ->
				fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (userfiches, exofiches, faits)->
					ue = faits.get(idUE)
					if ue
						idEF = ue.get("aEF")
						idUF = ue.get("aUF")
						userfiche = userfiches.get(idUF)
						nomCompletUser = userfiche.get("nomCompletUser")
						exofiche = exofiches.get(idEF)
						idFiche = exofiche.get("idFiche")

						EFs = exofiches.where({idFiche : idFiche})
						index = _.findIndex(EFs, (it)->
							return it.get("id") is idEF
						)

						app.Ariane.add([
							{ text:"Devoir #"+idFiche, e:"devoir:show", data:idFiche, link:"devoir:"+idFiche},
							{ text:"Fiches élèves", e:"devoir:showUserfiches", data:idFiche, link:"devoir:"+idFiche+"/fiches-eleves"},
							{ text:nomCompletUser+" #"+idUF, e:"devoirs:fiche-eleve:show", data:idUF, link:"devoirs/fiche-eleve:"+idUF },
							{ text:"Exercice "+(index+1), e:"devoirs:fiche-eleve:faits", data:[idUF, idEF], link:"devoirs/fiche-eleve:"+idUF+"/exercice:"+idEF },
							{ text:"Essai #"+idUE, e:"exercice-fait:run", data:idUE, link:"exercice-fait:"+idUE }
						])


						# debug : prévoir une fenêtre de modif des données

						idE = exofiche.get("idE")
						# On ne doit transmettre que des options brutes
						exoficheOptions = _.mapObject(exofiche.get("options"), (val,key)->
							return val.value
						)

						saveFunction = false
						showReinitButton = false
						if userfiche.get("actif") and userfiche.get("ficheActive")
							# La fiche étant active, l'exercice sera sauvegardé
							# Il parait aussi logique de permettre de poursuivre la fiche en relancçant l'exercice
							showReinitButton = true
							saveFunction = (note, answers, inputs, finished) ->
								ue = @ue # cette commande nécessite que la fonction soit appelée dans le bon contexte
								if ue
									savingUE = ue.save {
										note: Math.ceil(note)
										answers: JSON.stringify(answers)
										finished: finished
									}
									return savingUE
								else
									return false

						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:showReinitButton, ue:ue, showAnswersButton:true })

					else
						app.Ariane.add([
							{ text:"Élément manquant"}
						])

						view = new MissingView({ message:"Cette sauvegarde de votre travail n'existe pas !" })
						app.regions.getRegion('main').show(view)
				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

		execUEForEleve: (idUE) ->
			self = @
			channel = @getChannel()
			app.trigger("header:loading", true)
			require ["entities/dataManager"], ->
				fetchingData = channel.request("custom:entities", ["userfiches", "exofiches", "faits"])
				$.when(fetchingData).done( (userfiches, exofiches, faits)->
					ue = faits.get(idUE)
					if ue
						idEF = ue.get("aEF")
						idUF = ue.get("aUF")
						userfiche = userfiches.get(idUF)
						exofiche = exofiches.get(idEF)
						idFiche = exofiche.get("idFiche")
						EFs = exofiches.where({idFiche : idFiche})
						index = _.findIndex(EFs, (it)->
							return it.get("id") is idEF
						)

						app.Ariane.add([
							{ text:userfiche.get("nomFiche"), e:"devoir:show", data:idUF, link:"devoir:"+idUF},
							{ text:"Exercice "+(index+1), e:"userfiche:exofiche:faits", data:[idUF,idEF], link:"devoir:"+idUF+"/exercice:"+idEF},
							{ text:"Essai #"+idUE },
						])

						idE = exofiche.get("idE")
						# On ne doit transmettre que des options brutes
						exoficheOptions = _.mapObject(exofiche.get("options"), (val,key)->
							return val.value
						)

						saveFunction = false
						showReinitButton = false
						if userfiche.get("actif") and userfiche.get("ficheActive")
							# La fiche étant active, l'exercice sera sauvegardé
							saveFunction = (note, answers, inputs, finished)->
								newUE = false
								ue = this.ue # cette commande nécessite que la fonction soit appelée dans le bon contexte
								unless ue
									ue = new ItemUE {
										aEF: Number idEF
										aUF: Number idUF
										inputs: JSON.stringify(inputs)
									}
									newUE = true

								savingUE = ue.save {
									note: Math.ceil(note)
									answers: JSON.stringify(answers)
									finished: finished
								}

								if newUE
									thisObj = @
									$.when(savingUE).done( ()->
										faits.add(ue)
										thisObj.ue = ue
									)

								return savingUE


						self.show(idE, { optionsValues:exoficheOptions, save:saveFunction, showReinitButton:showReinitButton, ue:ue })

					else
						view = new MissingView({ message:"Cette sauvegarde de votre travail n'existe pas !" })
						app.regions.getRegion('main').show(view)

				).fail( (response)->
					if response.status is 401
						alert("Vous devez vous (re)connecter !")
						app.trigger("home:logout")
					else
						alertView = new AlertView()
						app.regions.getRegion('main').show(alertView)
				).always( ()->
					app.trigger("header:loading", false)
				)

	}

	return new Controller()
