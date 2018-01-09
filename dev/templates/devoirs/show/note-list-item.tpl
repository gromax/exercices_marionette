<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- id %></span> <%- nomUser %> <%- prenomUser %></h5>

<div class="btn-group" role="group">
	<!-- Bouton suppression -->
	<button type="button" class="btn btn-secondary js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>
	<% if (actif) { %>
		<button type="button" class="btn btn-success js-actif" title="Désactiver">Note : <b><%- note %></b></button>
	<% } else { %>
		<button type="button" class="btn btn-danger js-actif" title="Activer">Note : <b><%- note %></b></button>
	<% } %>
</div>
