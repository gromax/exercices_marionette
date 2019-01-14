define [], () ->
	# Tableau de variation

	class TabHeaderLine
		constructor: (@x_list, @tag, @parent) ->
			@hauteur = 1
			@offset = @parent.offset
			@parent.offset += 1
		render: (draw) ->
			if @div then @div.remove()
			@div = $("<div>")
			d = @parent.config.espace_entre_valeurs
			h = @parent.config.hauteur_ligne
			y0 = @offset * h
			color = @parent.config.color

			if @svg then @svg.remove()
			@svg = draw.group().move(0,y0)

			@svg.rect(@parent.config.longueur, h).stroke({ color, width: 2 }).fill({ color:"#fff"}) # Rectangle des x
			@svg.rect(@parent.config.espace_gauche, h).stroke({ color, width:2 }).fill({ color:"#fff"}) # Rectangle entête des x

			textDiv = $("<div x=#{@parent.config.espace_gauche/2} y=#{h/2} class='js-MJ'>#{@tag}</div>").appendTo(@div)
			x0 = @parent.config.espace_gauche + @parent.config.marge # Origine x pour les valeurs du tableau
			x_number = @x_list.length

			for x,i in @x_list
				switch i
					when 0 then textDiv = $("<div left=#{x0+d*i} y=#{h/2} class='js-MJ'>#{x}</div>")
					when x_number-1 then textDiv = $("<div right=#{x0+d*i} y=#{h/2} class='js-MJ'>#{x}</div>")
					else textDiv = $("<div x=#{x0+d*i} y=#{h/2} class='js-MJ'>#{x}</div>")
				textDiv.appendTo(@div)
			TabVar.mathjaxUpdate(@div, @svg,color)

			@

	class TabSignLine
		constructor: (line, @parent, params) ->
			# line est un texte qui a la forme z,+,z
			# Sur les rangs pairs (zones) :  +, -, espace, h = zone interdite, ? = inconnu
			# Sur les rangs impairs (valeurs) : d = double-barre, z = 0, t = pointillé, espace, ? = inconnu
			@tag = params?.tag ? "$f(x)$"
			@hauteur = Math.max(params?.h ? 1.5, 1)
			if typeof line is "string" then line=line.split(',')
			if not(_.isArray(line)) then line = []

			s = 2*@parent.size - 1
			line.push('') while line.length < s # On s'assure une longueur minimum
			line.pop() while line.length > s # On s'assure d'une longueur maximum
			@values = _.map line, (item, index) ->
				it = item.split("|")
				{ index, tag:item[0], hasButton:it[1] is "button" }
			@offset = @parent.offset
			@parent.offset += @hauteur
			@locked = false
			@

		render: (draw) ->
			if @svg then @svg.remove()
			y0 = @offset * @parent.config.hauteur_ligne

			@svg = draw.group().move(0, y0)

			@renderHeader()
			@renderRight()

		renderRight: ->
			that = @
			if @svgSigns then @svgSigns.remove()
			d = @parent.config.espace_entre_valeurs
			color = @parent.config.color
			hl = @hauteur * @parent.config.hauteur_ligne
			x0 = @parent.config.espace_gauche + @parent.config.marge
			@svgSigns = @svg.group().move(x0,0)

			# drawPlus = (x,y) ->
			# 	it = draw.group().move(x,y)
			# 	it.add draw.line(0, -10 , 0, 10).stroke({color, width:2})
			# 	it.add draw.line(-10, 0 , 10, 0).stroke({color, width:2})
			# 	it
			# drawMinus = (x,y) ->
			# 	draw.line(x-10, y, x+10, y).stroke({color, width:2})

			for item,j in @values
				i = j/2 # Position x en nombre de cases
				x = d*i
				if j%2 is 0
					# En face de la valeur i
					switch
						when item.tag is "z"
							# ligne avec zéro
							item.svg = @svgSigns.group().move(x, 0)
							item.svg.line(0, 0 ,0, hl).stroke({dasharray:'5 5', width:.5})
							item.svg.text("0").attr({stroke: color, fill: color, style:"font-size:30"}).center(0, hl/2)
						when item.tag is "d"
							# double barre
							item.svg = @svgSigns.group().move(x, 0)
							item.svg.add(draw.line(-2, 0, -2, hl))
							item.svg.add(draw.line(2, 0, 2, hl))
						when item.tag is "t"
							# simple ligne
							item.svg = @svgSigns.line(x, 0, x, hl).stroke({dasharray:'5 5', width:.5})
				else
					# En face d'une zone
					#if item.tag is "+" then item.svg = drawPlus(x, y0+hl/2)
					#else item.svg = drawMinus(x, y0+hl/2)
					if item.tag is "+"
						@svgSigns.line(x, hl/2-10 , x, hl/2+10).stroke({color, width:2})
						@svgSigns.line(x-10, hl/2 , x+10, hl/2).stroke({color, width:2})
					else @svgSigns.line(x-10, hl/2, x+10, hl/2).stroke({color, width:2})


					if item.hasButton
						#item.x = x
						button = @svgSigns.rect(30,30).move(x-15, hl/2-15).attr({ fill:'#ccc', 'fill-opacity': 0.4}).stroke({ color:'#000', width: 1 }).style('cursor', 'pointer')
						button.item = item
						button.on "click", ()->
							if not that.locked
								if @item.tag is "+"
									@item.tag = "-"
									#@item.svg.remove()
									#@item.svg = drawMinus(@item.x, y0+hl/2)
								else
									@item.tag = "+"
									#@item.svg.remove()
									#@item.svg = drawPlus(@item.x, y0+hl/2)
								that.renderRight()
					#draw.text(item).attr({stroke:c.color, fill:c.color, style:"font-size:30"}).center(x0+d*i, y0+hl/2)
					#div.append("<div x=#{x0+d*i} y=#{y0+hl/2} class='js-MJ'>$#{item}$</div>")
					# Sinon, pour l'instant, rien


		renderHeader: ->
			if @div then @div.remove()
			@div = $("<div>")
			if @svgHeader then @svgHeader.remove()
			hl = @parent.config.hauteur_ligne * @hauteur
			color = @parent.config.color
			@svgHeader = @svg.group()
			@svgHeader.rect(@parent.config.longueur, hl).stroke({ color, width: 2 }).fill({ color:"#fff"})
			@svgHeader.rect(@parent.config.espace_gauche, hl).stroke({ color, width: 2 }).fill({ color:"#fff"})
			textDiv = $("<div x=#{@parent.config.espace_gauche/2} y=#{hl/2} class='js-MJ'>#{@tag}</div>").appendTo(@div)
			TabVar.mathjaxUpdate(@div, @svgHeader, color)
			@

		getPos: ->
			m = _.map @values, (it)->
				if it.tag is "+" or it.tag is "-" then it.tag
				else ""
			m.join("")

		toString: ->
			(item.tag for item in @values).join(",")

		setPos: (pos) ->
			if typeof pos is "string" then pos = pos.split(",")
			l = @values.length
			for i in [0..l-1]
				@values[i].tag = pos[i] ? ""

		toTexTpl: ->
			{
				type: "sign"
				values: @toString()
			}

		toggleLock: ->
			# verrouille les éventuels boutons
			@locked = not @locked


	class TabVarItem
		constructor: (@xIndex, @pos, tag, @parent, @prev, @isLast, @isFirst) ->
			if @prev isnt null then @prev.next = @
			[@tag, strButton] = tag.split("|")
			@hasButton = strButton is "button"
			@next = null
			@

		@make: ( index, tabTag, parent, prev, isLast, isFirst ) ->
			switch tabTag[0]
				when "-"
					item = new TabVarItem(index, "-", tabTag[1], parent, prev, isLast, isFirst)
					return [item, item]
				when "+"
					item = new TabVarItem(index, "+", tabTag[1], parent, prev, isLast, isFirst)
					return [item, item]
				when "R"
					item = new TabVarItem(index, "R", "", parent, null, true, true)
					return [item,prev]
				else return [null, null]
				#when tab[0] is "R" then out.push { type: "none" }
				#when tab[0] is "-D" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1] }
				#when tab[0] is "+D" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1] }
				#when tab[0] is "D-" then out.push { type:"forbidden", rightPos:"bottom", rightTag:tab[1] }
				#when tab[0] is "D+" then out.push { type:"forbidden", rightPos:"top", rightTag:tab[1] }
				#when tab[0] is "-D-" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1], rightPos:"bottom", rightTag:tab[2] }
				#when tab[0] is "-D+" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1], rightPos:"top", rightTag:tab[2] }
				#when tab[0] is "+D-" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1], rightPos:"bottom", rightTag:tab[2] }
				#when tab[0] is "+D+" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1], rightPos:"top", rightTag:tab[2] }

		render: (d, hl) ->
			x = d*@xIndex
			if @pos is "-" or @pos is "+"
				if @pos is "-"
					ypos = "bottom"
					y = hl
				else
					ypos = "top"
					y = 0

				switch
					when @isFirst then xpos = "left"
					when @isLast then xpos = "right"
					else xpos = "x"

				@div = $("<div #{xpos}=#{x} #{ypos}=#{y} class='js-MJ'>#{@tag}</div>").appendTo(@parent.divRight)
				@div[0].coordsLink = @
				if @hasButton
					@div[0].buttonTo = @

		renderLeftArrow: ->
			if not @isFirst and @prev isnt null
				svgParent = @parent.svgVars
				color = @parent.parent.config.color
				# tracé d'une flèche
				lCoords = @prev.coords
				rCoords = @coords
				if lCoords and rCoords
					if @leftArrow then @leftArrow.remove()
					@leftArrow = svgParent.line(lCoords.x + lCoords.w + 12, lCoords.y - lCoords.h/2, rCoords.x-12, rCoords.y - rCoords.h/2).stroke({ width:1, color })
					@leftArrow.marker 'end', 20, 20, (add) ->
						add.polygon('4,5 4,15 18,10').fill(color).stroke({ width: 1, color })
			@
	class TabVarLine
		constructor: (line, @parent, params) ->
			# -/val
			# +/val
			# R
			# -D/val
			# +D/val
			# D-/val
			# D+/val
			# -D-/val/val
			# -D+/val/val
			# +D-/val/val
			# +D+/val/val
			# val peut avoir un |button si on veut mettre un bouton
			@tag = params?.tag ? "$f$"
			@hauteur = Math.max(params?.h ? 3, 3)
			if typeof line is "string" then line=line.split(',')
			if not(_.isArray(line)) then line = []
			size = @parent.size
			line.push('') while line.length < size # On s'assure une longueur minimum
			line.pop() while line.length > size # On s'assure d'une longueur maximum

			that = @
			prevItem = null

			@values = _.flatten( _.map line, (item, index) ->
				tab = item.split("/")
				result = TabVarItem.make( index, tab, that, prevItem, index is size-1, index is 0)
				prevItem = result[1]
				result[0]
			)
			@offset = @parent.offset
			@parent.offset += @hauteur
			@locked = false
			@
		render: (draw) ->
			if @svg then @svg.remove()
			y0 = @offset * @parent.config.hauteur_ligne
			@svg = draw.group().move(0, y0)

			@renderHeader()
			@renderRight()

		renderRight: () ->
			if @divRight then @divRight.remove()
			@divRight = $("<div>")

			if @svgVars then @svgVars.remove()
			d = @parent.config.espace_entre_valeurs
			hl = @parent.config.hauteur_ligne*@hauteur
			color = @parent.config.color
			x0 = @parent.config.espace_gauche + @parent.config.marge
			@svgVars = @svg.group().move(x0,0)
			item.render(d, hl) for item in @values
			TabVar.mathjaxUpdate(@divRight, @svgVars, color)
			@

		renderHeader: () ->
			if @divHeader then @divHeader.remove()
			@divHeader = $("<div>")
			if @svgHeader then @svgHeader.remove()
			@svgHeader = @svg.group()
			hl = @parent.config.hauteur_ligne * @hauteur
			color = @parent.config.color

			@svgHeader.rect(@parent.config.longueur, hl).stroke({ color, width: 2 }).fill({ color:"#fff"})
			@svgHeader.rect(@parent.config.espace_gauche, hl).stroke({ color, width: 2 }).fill({ color:"#fff"})
			textDiv = $("<div x=#{@parent.config.espace_gauche/2} y=#{hl/2} class='js-MJ'>#{@tag}</div>").appendTo(@divHeader)
			TabVar.mathjaxUpdate(@divHeader, @svgHeader, color)
			@

		renderArrows: ->
			item.renderRightArrow() for item in @values

		getPos: ->
			(item.pos for item in @values).join("")

		setPos: (pos) ->
			if typeof pos is "string" then pos = pos.split("")
			l = @values.length
			for i in [0..l-1]
				@values[i].pos = pos[i] ? "+"

		toTexTpl: ->
			{
				type: "var"
				values: (item.pos+"/"+item.tag for item in @values).join(",")
			}

		toggleLock: ->
			# verrouille les éventuels boutons
			@locked = not @locked



	class TabVar
		constructor: (x_list, params) ->
			@offset = 0 # position du curseur vertical
			@config = _.extend { espace_gauche:100, marge:20, margeArrow:15, espace_entre_valeurs:150, hauteur_ligne:40, color:"#000000", texColor:"black" }, params
			@size = x_list.length
			@config.longueur = @config.espace_gauche+(@size - 1)*@config.espace_entre_valeurs + 2*@config.marge
			x_tag = params?.x_tag ? "$x$"
			@lines = [ new TabHeaderLine(x_list, x_tag, @) ]
		addVarLine: (line, params) ->
			@lines.push(new TabVarLine(line, @, params))
			@
		addSignLine: (line, params) ->
			@lines.push(new TabSignLine(line, @, params))
			@
		toTexTpl: () ->
			entetes = ("#{line.tag}/#{line.hauteur/2}" for line in @lines)
			{ type:"tkz-tab", lgt:1, espcl:1.5, lw:"1pt", entetes:entetes.join(), lines: (line.toTexTpl() for line in @lines), x_list:@lines[0].x_list.join(), color:@config.texColor }
		render: (draw, maxWidth) ->
			lines = @lines
			containerWidth = Math.min(@config.longueur, maxWidth ? @config.longueur+1)
			draw.size(@config.longueur, @offset * @config.hauteur_ligne)

			line.render(draw) for line in lines


			if (scale = containerWidth/@config.longueur) isnt 1
				bb = draw.bbox()
				draw.translate(containerWidth-bb.w,0).scale(scale,scale)
			@

		@mathjaxUpdate: (div, svgParent, color) ->
			spin = svgParent.fo(20,20).appendChild($("<i class='fa fa-spinner fa-spin'></i>")[0])
			require ["mathjax", "svg"], (MathJax, SVG)->
				fct = ()->
					source = div.find ".js-MJ"
					source.each ()->
						$el = $(@)
						svg = $el.find "svg"
						w = Number(svg.attr("width")[..-3])*10
						h = Number(svg.attr("height")[..-3])*10

						switch
							when x = $el.attr("x")
								x = Number(x)-w/2
							when x = $el.attr("left")
								x = Number(x)
							when x = $el.attr("right")
								x = Number(x) - w
							else
								x=0
						switch
							when y = $el.attr("y")
								y = Number(y)+h/2
							when y = $el.attr("bottom")
								y = Number(y)-3
							when y = $el.attr("top")
								y = Number(y) + h+3
							else
								y=0
						buttonTo = @buttonTo
						$g = svg.find "g"
						g = SVG.adopt($g[0])
						g.putIn(svgParent)

						g.attr({ transform: "translate(#{x} #{y}) scale(.03) matrix(1 0 0 -1 0 0)", color})
						if buttonTo?
							button = svgParent.rect(w+20,h+6).move(x-7,y-h-3).attr({ fill:'#ccc', 'fill-opacity': 0.4}).stroke({ color:'#000', width: 1 }).style('cursor', 'pointer')
							button.on "click", ()->
								if not buttonTo.parent.locked
									if buttonTo.pos is "-"
										buttonTo.coords.y = h+3
										buttonTo.pos = "+"
										button.move(x-7,0)
										g.attr({transform:"translate(#{x},#{h + 3}) scale(.03) matrix(1 0 0 -1 0 0)"})
									else
										hl = buttonTo.parent.hauteur* buttonTo.parent.parent.config.hauteur_ligne
										buttonTo.coords.y = hl-3
										buttonTo.pos = "-"
										button.move(x-7,hl-h-6)
										g.attr({transform:"translate(#{x},#{hl - 3}) scale(.03) matrix(1 0 0 -1 0 0)"})
									buttonTo.next?.renderLeftArrow()
									buttonTo.renderLeftArrow()

						if @coordsLink
							@coordsLink.coords = { x, y, w, h }
							@coordsLink.renderLeftArrow()
							delete @coordsLink
					spin.remove()
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,div[0]])
				MathJax.Hub.Queue fct


	return {
		make: (x_list, params) ->
			new TabVar(x_list, params)
	}
