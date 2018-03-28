<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- idE %></span> <%- title %></h5>
<p class="list-group-item-text"><%- description %></p>

<hr>

<% if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ %>
<p><%- value.tag %> : <%- value.options[value.value] %></p>
	<% });
} %>
<div class="row">
	<div class="col">
		<p>Répétitions : <%- num %> | coefficient <%- coeff %></p>
	</div>
	<div class="col-4">
		<div class="btn-group" role="group">
			<button type="button" class="btn btn-secondary btn-sm js-test"><i class="fa fa-eye" title="Tester"></i> Tester</button>
			<!-- Bouton d'édition -->
			<button type="button" class="btn btn-secondary btn-sm js-edit"><i class="fa fa-pencil" title="Modifier"></i> Modifier</button>
			<!-- Bouton suppression -->
			<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>
		</div>
	</div>
</div>
