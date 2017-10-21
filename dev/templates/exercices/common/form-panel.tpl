<% if (title) {%>
	<% if(focused) {%>
<div class="card-header text-white bg-danger"><i class="fa fa-play"></i> <%- title %></div>
	<% } else { %>
<div class="card-header"><%- title %></div>
	<% } %>
<% } %>
<div class="card-body">
<form>
<% _.each(liste,function(item){ %>
	<% if (item.radio) { %>
	<div class="col-xs-12 col-md-12">
		<% _.each(item.list,function(subItem){ %>
		<label class="radio-inline">
			<input type="radio" name="<%- item.radio %>" value="<%- subItem.value %>" <% if (subItem.checked){ %>checked<% } %> > <%- item.title %>
		</label>
		<% }) %>
	</div>
	<% } else { %>
	<div class="form-group row">
		<% if (item.text) {%><p class="text-info"><% item.text %></p><% } %>
		<label for="inputHorizontalSuccess" class="col-sm-2 col-form-label"><%- item.tag %></label>
		<div class="col-sm-10">
			<input type="text" class="form-control" id="exo-<%- item.name %>" name="<%- item.name %>" placeholder="<%- item.description %>" value="<%- item.user %>">
		</div>
	</div>
	<% } %>
<% }) %>

	<div class="col-xs-12 col-md-4">
		<div class="btn-group" role"group">
<% _(clavier).each( function(item){ %>
	<% switch(item) { case "aide" : %>
			<button class="btn btn-info js-clavier" type="button" title="Aide" name="aide" ><i class="fa fa-question-circle-o"></i></button>
	<% break; case "infini": %>
			<button class="btn btn-default js-clavier" type="button" title="Infini" name="infini">$\\infty$</button>
	<% break; case "sqrt": %>
			<button class="btn btn-default js-clavier" type="button" title="Racine carrée" name="sqrt">$\\sqrt{x}$</button>
	<% break; case "pi": %>
			<button class="btn btn-default js-clavier" type="button" title="Pi" name="pi">$\\pi$</button>
	<% break; case "sqr": %>
			<button class="btn btn-default js-clavier" type="button" title="Carré" name="sqr">$\\x^2$</button>
	<% break; case "empty": %>
			<button class="btn btn-default js-clavier" type="button" title="Ensemble vide" name="empty">$\\varnothing$</button>
	<% break; case "union": %>
			<button class="btn btn-default js-clavier" type="button" title="Union" name="union">$\\cup$</button>
	<% break; case "intersection": %>
			<button class="btn btn-default js-clavier" type="button" title="Intersection" name="intersection">$\\cap$</button>
	<% break; case "reels": %>
			<button class="btn btn-default js-clavier" type="button" title="Ensemble des réels" name="reels">$\\mathbb{R}$</button>
	<% } %>
<% })%>
			<button type="submit" class="btn btn-default js-submit">Valider</button>
		</div>
	</div>
</div>
</form>
</div>
<% if (aide) {%>
<ul class="list-group list-group-flush js-liste-aide" style="display:none;">
<% _.each(aide,function(item){ %>
	<li class="list-group-item list-group-item-info"><%- item %></li>
<% }) %>
</ul>
<% } %>
