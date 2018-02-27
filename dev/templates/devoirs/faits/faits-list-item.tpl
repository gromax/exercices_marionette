<td><span class="badge badge-pill badge-primary"><%- id %></span></td>
<td><%- date %></td> <!-- à parser -->
<td><%- note %></td>
<td><% if(finished){ %>
	<i class="fa fa-check-square-o"></i>
<% } else { %>
	<i class="fa fa-square-o"></i>
<% } %>
</td>
<% if (showDeleteButton) { %>
<td align="right">
	<div class="btn-group" role="group">
		<!-- Bouton suppression -->
		<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>
	</div>
</td>
<% } %>
