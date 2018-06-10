define [], () ->
	# Tableau de variation

	class TabVar
		constructor: (x_list, params) ->
			@config = { espace_gauche:100, marge:20, margeArrow:15, espace_entre_valeurs:150, hauteur_ligne:40, x_tag:"$x$", color:"#000000", texColor:"black" }
			if (typeof params is "object") and params isnt null
				@config[key] = params[key] for key of params
			@x_list = x_list
			@x_tag = @config.x_tag
			@lines = []
		linesNumber : () ->
			n = 1 # compte pour la ligne d'entête
			n += ligne.hauteur for ligne in @lines
			n
		addVarLine: (line, params) ->
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
			config = { h:3, tag:"$f$" }
			if (typeof params is "object") and params isnt null
				config[key] = params[key] for key of params
			if typeof line is "string" then line=line.split(',')
			if not(_.isArray(line)) then return
			line.push('?') while line.length<@x_list.length # On s'assure une longueur minimum
			line.pop() while line.length>@x_list.length # On s'assure d'une longueur maximum
			@lines.push {type:"var", tag:config.tag, values:line, hauteur:Math.max(config.h,3)}
			@
		addSignLine: (line, params) ->
			# line est un texte qui a la forme z,+,z
			# Sur les rangs pairs (zones) :  +, -, espace, h = zone interdite, ? = inconnu
			# Sur les rangs impairs (valeurs) : d = double-barre, z = 0, t = pointillé, espace, ? = inconnu
			config = { h:1.5, tag:"$f(x)$" }
			if (typeof params is "object") and params isnt null
				config[key] = params[key] for key of params
			if typeof line is "string" then line=line.split(',')
			if not(_.isArray(line)) then return
			line.push('?') while line.length<2*@x_list.length-1 # On s'assure une longueur minimum
			line.pop() while line.length>2*@x_list.length-1 # On s'assure d'une longueur maximum
			@lines.push {type:"sign", tag:config.tag, values:line, hauteur:Math.max(config.h,1)}
			@
		toTexTpl: () ->
			entetes = ("#{line.tag}/#{line.hauteur/2}" for line in @lines)
			entetes.unshift "#{@x_tag}/1"
			{ type:"tkz-tab", lgt:1, espcl:1.5, lw:"1pt", entetes:entetes.join(), lines:@lines, x_list:@x_list.join(), color:@config.texColor }
		render: (draw, maxWidth) ->
			c = @config
			d = @config.espace_entre_valeurs
			longueur = c.espace_gauche+(@x_list.length-1)*d+2*c.marge
			containerWidth = Math.min(longueur, maxWidth ? longueur+1)

			hauteur = @linesNumber() * c.hauteur_ligne
			draw.size(longueur, hauteur)
			draw.rect(longueur, c.hauteur_ligne).stroke({ color: c.color, width: 2 }).fill({ color:"#fff"}) # Rectangle des x
			draw.rect(c.espace_gauche, c.hauteur_ligne).stroke({ color: c.color, width:2 }).fill({ color:"#fff"}) # Rectangle entête des x
			div = $("<div>")
			div.append("<div x=#{c.espace_gauche/2} y=#{c.hauteur_ligne/2} class='js-MJ'>#{c.x_tag}</div>")
			#draw.fo(@config.espace_gauche, @config.hauteur_ligne).appendChild(document.createTextNode(@config.x_tag))
			x0 = c.espace_gauche + c.marge # Origine x pour les valeurs du tableau
			y0 = c.hauteur_ligne
			x_number = @x_list.length
			for x,i in @x_list
				switch i
					when 0 then div.append("<div left=#{x0+d*i} y=#{c.hauteur_ligne/2} class='js-MJ'>#{x}</div>")
					when x_number-1 then div.append("<div right=#{x0+d*i} y=#{c.hauteur_ligne/2} class='js-MJ'>#{x}</div>")
					else div.append("<div x=#{x0+d*i} y=#{c.hauteur_ligne/2} class='js-MJ'>#{x}</div>")

			renderSignLine = (line)->
				hl = line.hauteur*c.hauteur_ligne
				draw.rect(longueur, hl).move(0,y0).stroke({ color: c.color, width: 2 }).fill({ color:"#fff"})
				draw.rect(c.espace_gauche, hl).move(0,y0).stroke({ color: c.color, width: 2 }).fill({ color:"#fff"})
				div.append("<div x=#{c.espace_gauche/2} y=#{y0+hl/2} class='js-MJ'>#{line.tag}</div>")

				for item,j in line.values
					i = j/2 # Position x en nombre de cases
					if j%2 is 0
						# En face de la valeur i
						switch
							when item is "z"
								# ligne avec zéro
								draw.line(x0+i*d, y0 ,x0+i*d, y0+hl).stroke({dasharray:'5 5', width:.5})
								draw.text("0").attr({stroke:c.color, fill:c.color, style:"font-size:30"}).center(x0+d*i, y0+hl/2)
							when item is "d"
								# double barre
								draw.line(x0+i*d-2, y0, x0+i*d-2, y0+hl)
								draw.line(x0+i*d+2, y0, x0+i*d+2, y0+hl)
							when item is "t"
								# simple ligne
								draw.line(x0+i*d, y0 ,x0+i*d, y0+hl).stroke({dasharray:'5 5', width:.5})
					else
						# En face d'une zone
						switch
							when (item is "+") or (item is "-")
								#draw.text(item).attr({stroke:c.color, fill:c.color, style:"font-size:30"}).center(x0+d*i, y0+hl/2)
								div.append("<div x=#{x0+d*i} y=#{y0+hl/2} class='js-MJ'>$#{item}$</div>")
						# Sinon, pour l'instant, rien

			renderVarLine = (line) ->
				hl = line.hauteur*c.hauteur_ligne
				draw.rect(longueur, hl).move(0,y0).stroke({ color: c.color, width: 2 }).fill({ color:"#fff"})
				draw.rect(c.espace_gauche, hl).move(0,y0).stroke({ color: c.color, width: 2 }).fill({ color:"#fff"})
				div.append("<div x=#{c.espace_gauche/2} y=#{y0+hl/2} class='js-MJ'>#{line.tag}</div>")

				l = line.values.length
				y_last = false
				for item,i in line.values
					tab = item.split("/")
					tab.push "?" while tab.length<2
					switch
						when tab[0] is "-"
							switch
								when i is 0 then div.append("<div left=#{x0} bottom=#{y0+hl} aright=1 class='js-MJ'>#{tab[1]}</div>")
								when i is l-1 then div.append("<div right=#{x0+d*i} bottom=#{y0+hl} aleft=1 class='js-MJ'>#{tab[1]}</div>")
								else div.append("<div x=#{x0+d*i} bottom=#{y0+hl} aleft=1 aright=1 class='js-MJ'>#{tab[1]}</div>")
						when tab[0] is "+"
							switch
								when i is 0 then div.append("<div left=#{x0} top=#{y0} aright=1 class='js-MJ'>#{tab[1]}</div>")
								when i is l-1 then div.append("<div right=#{x0+d*i} aleft=1 top=#{y0} class='js-MJ'>#{tab[1]}</div>")
								else div.append("<div x=#{x0+d*i} top=#{y0} aleft=1 aright=1 class='js-MJ'>#{tab[1]}</div>")
							y_new = y0
							if y_last isnt false
								s = { x:x0+d*(i-1), y: y_last}
								e = { x:x0+d*i, y: y_new}
								m = { x:(e.x-s.x)*.3, y:(e.y-s.y)*.3}
								draw.line(s.x+m.x, s.y+m.y, e.x-m.x, e.y-m.y).stroke({color:c.color, width:1})
							y_last = y_new

						#when tab[0] is "R" then out.push { type: "none" }
						#when tab[0] is "-D" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1] }
						#when tab[0] is "+D" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1] }
						#when tab[0] is "D-" then out.push { type:"forbidden", rightPos:"bottom", rightTag:tab[1] }
						#when tab[0] is "D+" then out.push { type:"forbidden", rightPos:"top", rightTag:tab[1] }
						#when tab[0] is "-D-" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1], rightPos:"bottom", rightTag:tab[2] }
						#when tab[0] is "-D+" then out.push { type:"forbidden", leftPos:"bottom", leftTag:tab[1], rightPos:"top", rightTag:tab[2] }
						#when tab[0] is "+D-" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1], rightPos:"bottom", rightTag:tab[2] }
						#when tab[0] is "+D+" then out.push { type:"forbidden", leftPos:"top", leftTag:tab[1], rightPos:"top", rightTag:tab[2] }

			for line in @lines
				if line.type is "var" then renderVarLine(line)
				else if line.type is "sign" then renderSignLine(line)
				y0 += line.hauteur*c.hauteur_ligne

			require ["mathjax", "svg"], (MathJax, SVG)->
				fct = ()->
					source = div.find ".js-MJ"
					arrow_last = null
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
						$g = svg.find "g"
						g = SVG.adopt($g[0])
						g.attr({ transform: "translate(#{x} #{y}) scale(.03) matrix(1 0 0 -1 0 0)", color:c.color})
						g.putIn(draw)
						if $el.attr("aleft") is "1" and arrow_last isnt null
							# tracé d'une flèche
							ar = draw.line(arrow_last.x, arrow_last.y, x-5, y-h/2).stroke({ width:1, color:c.color})
							ar.marker 'end', 20, 20, (add) ->
								add.polygon('4,5 4,15 18,10').fill(c.color).stroke({ width: 1, color:c.color })

						if $el.attr("aright") is "1"
							# préparation d'une prochaine flèche
							arrow_last = {x:x+w+12, y:y-h/2}
						else
							arrow_last = null
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,div[0]])
				MathJax.Hub.Queue fct
			if (scale = containerWidth/longueur) isnt 1
				bb = draw.bbox()
				draw.translate(containerWidth-bb.w,0).scale(scale,scale)
			@

	return {
		make: (x_list, params) ->
			new TabVar(x_list, params)
	}
