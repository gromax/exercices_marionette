define ["svg"], (SVG) ->
	SVG.Rounded = SVG.invent {
		# Define the type of element that should be created
		create: 'rect'

		# Specify from which existing class this shape inherits
		inherit: SVG.Shape

		# Add custom methods to invented shape
		extend: {
		# Create method to proportionally scale the rounded corners
			size: (width, height) ->
				@attr({
					width: width
					height: height
					rx: height / 5
					ry: height / 5
				})

		}

		# Add method to parent elements
		construct: {
			# Create a rounded element
			rounded: (width, height) ->
				@put(new SVG.Rounded).size(width, height)

		}
	}




	SVG.ForeignObject = SVG.invent {
		create: 'foreignObject'
		inherit: SVG.Shape
		extend: {
			appendChild: (child, attrs) ->
				newChild = if typeof child is 'string' then document.createElement(child) else child
				if typeof attrs is 'object'
					 newChild[a] = attrs[a] for a in attrs
					@node.appendChild(newChild)
				@
			getChild: (index) ->
				@node.childNodes[index]
		}

		construct: {
			fo: (width, height)->
				w = width ? 100
				h = height ? 100
				@put(new SVG.ForeignObject).size(w, h)
		}
	}

	return SVG
