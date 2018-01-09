<div class="btn-group" role"group">
	<% _(clavier).each( function(subitem){ %>
		<% switch(subitem) { case "aide" : %>
	<button class="btn btn-info js-clavier" type="button" title="Aide" name="aide" ><i class="fa fa-question-circle-o"></i></button>
		<% break; case "infini": %>
	<button class="btn btn-default js-clavier" type="button" title="Infini" name="infini">$\infty$</button>
		<% break; case "sqrt": %>
	<button class="btn btn-default js-clavier" type="button" title="Racine carrée" name="sqrt">$\sqrt{x}$</button>
		<% break; case "pi": %>
	<button class="btn btn-default js-clavier" type="button" title="Pi" name="pi">$\pi$</button>
		<% break; case "sqr": %>
	<button class="btn btn-default js-clavier" type="button" title="Carré" name="sqr">$\x^2$</button>
		<% break; case "empty": %>
	<button class="btn btn-default js-clavier" type="button" title="Ensemble vide" name="empty">$\varnothing$</button>
		<% break; case "union": %>
	<button class="btn btn-default js-clavier" type="button" title="Union" name="union">$\cup$</button>
		<% break; case "intersection": %>
	<button class="btn btn-default js-clavier" type="button" title="Intersection" name="intersection">$\cap$</button>
		<% break; case "reels": %>
	<button class="btn btn-default js-clavier" type="button" title="Ensemble des réels" name="reels">$\mathbb{R}$</button>
		<% } %>
	<% })%>
	<button type="submit" class="btn btn-default js-submit">Valider</button>
</div>
