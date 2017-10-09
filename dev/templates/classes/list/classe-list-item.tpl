<td><span class="badge badge-pill badge-primary"><%- id %></span></td>
<td><%- nom %></td>
<td><%- nomOwner %></td>
<td><% if(ouverte) {%>Ouverte<%} else {%>Fermée <%}%></td>
<td><%- date %></td> <!-- à parser -->
<td align="right">
	<div class="btn-group" role="group">
		<!-- Bouton d'édition -->
		<a href="#classe:<%- id %>/edit" class="btn btn-secondary btn-sm js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i></a>
		<!-- Bouton suppression -->
		<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>
	</div>
</td>
