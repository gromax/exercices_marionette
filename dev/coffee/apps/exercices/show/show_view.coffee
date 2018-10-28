define [
	"app",
	"jst",
	"marionette",
	"mathjax",
	"mathquill",
	"backbone.syphon"
], (
	app,
	JST,
	Marionette,
	MathJax
)->
	DefaultItemView = Marionette.View.extend {
		className: "card-body",
		template: window.JST["exercices/common/brique-item"],

		onFormDataInvalid: (data)->
			model = @model
			name = model.get("name")
			if name
				$el = @$el;
				# On retire un éventuel message d'erreur antérieur
				$el.find(".js-validation-error").each(
					()-> $(this).remove()
				)

				validation_item = data[name]
				if validation_item and validation_item.error
					# Il y a une erreur qu'il faut afficher
					$el.addClass "bg-danger text-white"
					$el.append(window.JST["exercices/common/validation-error"]({ error:validation_item.error }))
				else
					# Pas d'erreur, on efface l'éventuel formatage erreur
					$el.removeClass("bg-danger text-white")

		onRender: ()->
			that = this
			if fcts = @model.get("renderingFunctions")
				item(that) for item in fcts
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]])

			if @postVerificationRenderData? and typeof(post = @model.get("postVerificationRender")) is "function"
				post(@, @postVerificationRenderData)
				@postVerificationRenderData = null

		remove: ()->
			@model.destroy()
			Marionette.View.prototype.remove.call(@)

		setPostVerificationRenderData: (data)->
			@postVerificationRenderData = data
	}

	RadioItemView = DefaultItemView.extend {
		template: window.JST["exercices/common/radio"]
		defaultToTrash: true
	}

	AideItemView = DefaultItemView.extend {
		template: window.JST["exercices/common/aide-item"]
		defaultToTrash: true
	}

	InputItemView = DefaultItemView.extend {
		template: window.JST["exercices/common/input"]
		defaultToTrash: true
		triggers: {
			"focusin input": "form:input:focusin"
			"focusin textarea": "form:input:focusin"
		},

		serializeData: ()->
			out = _.clone(@model.attributes)
			out.pref = app.Auth.get("pref")
			out
		onRender: ()->
			that = @
			format = @model.get("format")
			if format
				fctMQ = (item)->
					if item.latex and item.name
						$answerSpan = $("#mq-exo-"+item.name,that.$el)
						mathField = window.MQ.MathField($answerSpan[0], {
							spaceBehavesLikeTab: true
							autoCommands: 'pi theta sqrt'
							autoOperatorNames: 'sin cos'
							handlers: {
								edit: -> if mathField then $("#exo-"+item.name).val(mathField.latex())
								enter: -> that.trigger("form:submit")
							}
						})
						return [item.name, mathField]
					else
						return false;
				@mathFields = _.object(_.compact(_.map(format,fctMQ)))
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]]);
	}

	AddInputView = DefaultItemView.extend {
		template: window.JST["exercices/common/add-input"]
		defaultToTrash: true
		triggers:{
			"click button.js-add-input": "button:add"
			"click button.js-remove-input": "button:remove"
		}

		initialize: -> @inputs = []
		onButtonAdd: (view, e)->
			index = @inputs.length;
			$newInput = $(window.JST["exercices/common/input-del"]({index:index, name:"pwet", tag:"lala", description:"rr"}))
			view.$el.append($newInput)
			@inputs.push($newInput)

		onButtonRemove: (view, e)->
			console.log e
			$el = $(e.currentTarget)
			index = Number($el.attr("index"))
			console.log index
	}

	ColorChoiceItemView = DefaultItemView.extend {
		template: window.JST["exercices/common/color-choice-item"]
		defaultToTrash: true
		triggers:{
			"click a.list-group-item-action":"choice:click:item"
		},

		onChoiceClickItem: (view, e)->
			$el = $(e.currentTarget)
			index = Number($el.attr("index"))
			name = this.model.get("name")
			maxValue = this.model.get("maxValue")
			if maxValue
				nVal = maxValue+1
			else
				nVal = this.model.get("list").length
			$inp = $("input[name='"+name+"']")
			$square = $el.find("i.fa-square").first()
			values = $inp.val().split(";")
			v = Number( values[index] )+1
			if v>=nVal
				v=0;
			values[index]=v
			$inp.val(values.join(";"))
			require ["utils/colors"], (colors)-> $square.css({ color: colors.html(v)})
	}

	ColorListItemView = Marionette.View.extend {
		className: "card-body"
		template: window.JST["exercices/common/color-list-item"]

		onRender: -> MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]])

		remove: ->
			@model.destroy();
			Marionette.View.prototype.remove.call(@)
	}

	ValidationItemView = Marionette.View.extend {
		className: "card-body"
		template: window.JST["exercices/common/validation-item"]
		defaultToTrash: true
		triggers: {
			"click button.js-submit" : "form:submit"
			"mousedown button.js-clavier" : "form:clavier:click"
		}

		onRender: -> MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.$el[0]])

		remove: ->
			@model.destroy()
			Marionette.View.prototype.remove.call(@)
	}

	JsxgraphItemView = DefaultItemView.extend {
		className: "card-body text-center"
		#template: window.JST["exercices/common/jsxgraph-item"]
		onRender: -> null
		onAttach: ->
			model = @model
			params = model.get("params")
			that = @

			jsxId = "jsx#{Math.random()}"
			div = $("<div id='#{jsxId}'></div>")
			@$el.append(div)
			if model.has("size")
				size = model.get("size")

				if typeof size is "number"
					h = w = size
				else
					w = size[0]
					h = size[1]
			else
				w = h = 500
			containerWidth = @$el.width()*.95
			scale = Math.min(w,containerWidth)/w
			div.height(Math.round(h*scale))
			div.width(Math.round(w.scale))

			require ["jsxgraph"], ()->
				that.graph = JXG.JSXGraph.initBoard(jsxId, params);
				if fcts = model.get("renderingFunctions")
					item(that.graph) for item in fcts
				if that.postVerificationRenderData? and typeof(post = model.get("postVerificationRender")) is "function"
					post(that, that.postVerificationRenderData)
					that.postVerificationRenderData = null
	}

	SVGItemView = DefaultItemView.extend {
		className: "card-body text-center"
		onRender: () -> null
		onAttach: ->
			svgId = "svg#{Math.random()}"
			@$el.attr("id",svgId)
			fcts = @model.get("renderingFunctions")
			v = @
			require ["utils/svg.add"], (SVG) ->
				v.draw = SVG(svgId)
				if fcts
					item(v) for item in fcts
				if v.postVerificationRenderData? and typeof(post = v.model.get("postVerificationRender")) is "function"
					post(v, v.postVerificationRenderData)
					v.postVerificationRenderData = null
	}

	BriqueItemsListView = Marionette.CollectionView.extend {
		childView:  (model)->
			type = model.get("type")
			switch type
				when "jsxgraph" then return JsxgraphItemView;
				when "svg" then return SVGItemView;
				when "validation" then return ValidationItemView;
				when "color-choice" then return ColorChoiceItemView;
				when "color-list" then return ColorListItemView;
				when "input" then return InputItemView;
				when "radio" then return RadioItemView;
				when "aide" then return AideItemView;
				when "add-input" then return AddInputView;
				else return DefaultItemView;
	}

	BriqueView = Marionette.View.extend {
		currentFocus: null
		className: ->
			if @model.get("cols") is 2 then "col-md-6 col-12"
			else "col-12"
		template: window.JST["exercices/common/brique-panel"]

		regions: {
			items: {
				el: 'div.js-items'
			}
		}

		initialize : (data)->
			@listenTo(@model, 'change:focus', @setFocus)

		onRender: ->
			items = @model.get("items")
			@itemsView = new BriqueItemsListView { collection: items }
			@listenTo(@itemsView,"childview:form:submit",@formSubmit)
			@listenTo(@itemsView, "childview:form:clavier:click", @onClavier)
			@listenTo(@itemsView,"childview:form:input:focusin", @onInputFocus)

		serializeData: ->
			data = _.clone(@model.attributes)
			data.needForm = @model.checkIfNeedValidation()
			data

		onClavier: (childview, e)->
			cible = e.currentTarget.name
			if cible is "aide"
				$el = $("ul.js-liste-aide")
				if $el.css('display') is 'none'
					$el.slideDown("slow")
				else
					$el.slideUp("slow")
			else
				if not @currentFocus
					# On cherche le premier input
					view = this.itemsView.children.find((item)-> return (item.model.get("type") is "input") )
					if view
						# On cherche le premier input
						format = view.model.get("format")
						if format
							it = _.first(_.filter(format, (item)-> if (item.name) then true else false))
							if it
								if it.latex then $node = view.$el.find("textarea")
								else $node = view.$el.find("input")
						else
							# On envoie dans le premier input
							$node = view.$el.find("input")
						if $node then @currentFocus = { view: view, node:$node[0] }
				if @currentFocus
					if @currentFocus.node.tagName is "INPUT"
						$inp = $(this.currentFocus.node)
						pos = $inp[0].selectionStart
						pEnd = $inp[0].selectionEnd
						currentText = $inp.val()
						switch cible
							when "empty" then $inp.val(currentText.substring(0,pos)+"∅"+currentText.substring(pos))
							when "pi" then $inp.val(currentText.substring(0,pos)+"π"+currentText.substring(pos))
							when "infini" then $inp.val(currentText.substring(0,pos)+"∞"+currentText.substring(pos))
							when "sqrt" then $inp.val(currentText.substring(0,pos)+"sqrt("+currentText.substring(pos, pEnd)+")"+currentText.substring(pEnd))
							when "pow" then $inp.val(currentText.substring(0,pos)+"^("+currentText.substring(pos, pEnd)+")"+currentText.substring(pEnd))
							when "sqr" then $inp.val(currentText.substring(0,pos)+"^2"+currentText.substring(pos))
							when "cube" then $inp.val(currentText.substring(0,pos)+"^3"+currentText.substring(pos))
					else
						# Dans ce cas c'est un latex-input
						id = $(@currentFocus.node).parent().parent().attr('id')
						mfs = @currentFocus.view.mathFields
						mf = _.find(mfs, (item,key)-> if id is "mq-exo-"+key then true else false )
						if mf
							switch cible
								when "empty"
									mf.cmd('\\varnothing')
									mf.focus()
								when "sqrt"
									mf.cmd('\\sqrt')
									mf.focus()
								when "pow"
									mf.cmd("^")
									mf.focus()
								when "infini"
									mf.cmd("\\infty")
									mf.focus()
								when "pi"
									mf.cmd("\\pi")
									mf.focus()
			return false;

		onInputFocus: (childview, e) ->
			@currentFocus = { view: childview, node:e.currentTarget }

		formSubmit: (e) ->
			data = Backbone.Syphon.serialize(@)
			cv_datas = @itemsView.children.map( (childview)->
				model = childview.model
				if  (model.get("type") is "jsxgraph") and model.get("getData")
					fct = model.get("getData")
					return fct(childview.graph)
				else
					return null;
			)

			data = _.reduce(cv_datas, (memo, item)->
				if item is null then memo
				else _.extend(memo, item)
			, data)

			# On fait remonter les données récupérées dans la form ainsi que la vue
			@trigger("form:submit", data, @)

		onFormDataInvalid: (data)->
			$el = this.$el
			$el.find(".js-validation-error").each ()->
				$(this).remove()

			_.each data, (value,key)->
				if value.error
					$item = $("[name='"+key+"']").closest(".card-body")
					if _.isArray(value.error)
						_.each value.error, (er)-> $item.append("<span class='js-validation-error badge badge-pill badge-danger'><i class='fa fa-exclamation-triangle'></i> #{er}</span>")
					else
						$item.append("<span class='js-validation-error badge badge-pill badge-danger'><i class='fa fa-exclamation-triangle'></i> "+value.error+"</span>")

		removeItem: (model) ->
			if childview = @itemsView.children.findByModel(model)
				childview.remove()

		showItems: ->
			@showChildView('items', this.itemsView)

		setFocus: ->
			this.$el.find(".card-header").each () -> $(this).addClass("text-white bg-warning")

		unsetFocus: ->
			@$el.find(".card-header").each () -> $(this).removeClass("text-white bg-warning")

		setPostVerificationRenderData: (data) ->
			list = this.itemsView.children.filter (item) -> item.model.has("postVerificationRender")
			item.setPostVerificationRenderData(data) for item in list
		postVerifRender: (data)->
			list = this.itemsView.children.filter (item) -> item.model.has("postVerificationRender")
			for item in list
				fct = item.model.get("postVerificationRender")
				fct(item,data)
				item.setPostVerificationRenderData(null)
	}

	BriquesListView = Marionette.CollectionView.extend {
		className:"row" # Pour un contenu fluide dans bootstrap
		childView: BriqueView
	}

	PiedView = Marionette.View.extend {
		template: window.JST["exercices/common/pied"]
		className: "card"
	}

	OptionsView = Marionette.View.extend {
		template: window.JST["exercices/show/options-view"]
		className: "card"
		ui:{
			submit:"button.js-submit"
		},

		events: {
			"click @ui.submit": "formSubmit"
		},

		formSubmit: (e)->
			e.preventDefault()
			data = Backbone.Syphon.serialize(@)
			@trigger("options:form:submit", data)

		serializeData: ->
			{
				optionsItems: _.map @model.attributes, (val,key)-> { key: key, tag: val.tag, options: val.options, value: val.value ? 0 }
			}
	}



	View = Marionette.View.extend {
		template: window.JST["exercices/show/show-view"]
		regions: {
			messages: {
				el: '#messages'
			}
			collection: {
				el: '#collection'
			}
			pied: {
				el: '#exercice-pied'
			}
			options: {
				el: '#options'
			}
		},

		ui:{
			reinit:"button.js-reinit"
			setoptions:"button.js-options"
			setanswers:"button.js-answers"
			showmessages:"button.js-show-messages"
		},

		triggers: {
			"click @ui.reinit":"button:reinit"
			"click @ui.setoptions":"button:options"
			"click @ui.setanswers":"button:answers"
			"click @ui.showmessages":"button:messages"
		}

		onRender: ->
			maCollection = @model.get("briquesCollection");
			@listView = new BriquesListView { collection: maCollection }
			@listenTo(@listView,"childview:form:submit",@formSubmit)
			@showChildView('collection', @listView)
			@piedView = new PiedView({ model: @options.pied})
			@showChildView('pied', @piedView)
			@listenTo(@options.pied, "change:finished", @piedView.render)
			# Mathjax pour le titre général et les titres de briques
			@$el.find(".card-header").each ()-> MathJax.Hub.Queue(["Typeset",MathJax.Hub,this])

		formSubmit: (data,view)->
			@trigger("brique:form:submit",data,view)

		showItems: (brique)->
			# Affiche les items de la brique passée en argument
			childView = @listView.children.findByModel(brique)
			if childView
				childView.showItems()

		setFocus: (brique)->
			# met le focus sur la brique passée en argument
			childView = @listView.children.findByModel(brique)
			if childView
				childView.setFocus()

		serializeData: ->
			data = _.clone(@model.attributes)
			data.showOptionsButton = @options.showOptionsButton
			data.showReinitButton = @options.showReinitButton
			data.showAnswersButton = @options.showAnswersButton
			data.showMessagesButton = @options.showMessagesButton
			data

		showOptionsView: (optionsModel)->
			# Vérifie que la vue n'est pas déjà active
			currentView = @getRegion('options').currentView
			if currentView
				currentView.$el.toggle()
			else
				optionsView = new OptionsView { model: optionsModel}
				@showChildView('options', optionsView)
				@listenTo(optionsView, "options:form:submit", (data)-> @trigger("options:form:submit", data) )

	}

	return View
