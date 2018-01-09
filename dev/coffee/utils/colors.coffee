define [], () ->
	# Objet pour les couleurs quand il y a une liste de choix
	return {
		html: (index)->
			switch index
				when 0 then "#ff0000"
				when 1 then "#347c2c"
				when 2 then "#8d38c9"
				when 3 then "#ffa500"
				when 4 then "#0000ff"
				when 5 then "#808080"
				when 6 then "#d2b9d3"
				when 7 then "#c04000"
				when 8 then "#ffff00"
				when 9 then "#6495ed"
				else "#000000"
		tex: (index)->
			switch index
				when 0 then "red"
				when 1 then "JungleGreen"
				when 2 then "Violet"
				when 3 then "Orange"
				when 4 then "blue"
				when 5 then "gray"
				when 6 then "Thistle"
				when 7 then "Mahogany"
				when 8 then "yellow"
				when 9 then "CornflowerBlue"
				else "black"
	}
