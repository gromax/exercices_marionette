<td><span class="badge badge-pill badge-primary"><%- id %></span></td>
<td><%- nom %> <%- prenom %><br/><small class="text-info"><i class="fa fa-envelope fa-1"></i><%- email %></small></td>
<td><%- nomClasse %></td>
<td><%- date %></td> <!-- à parser -->
<td><%- rank %></td>
<td align="right">
	<div class="btn-group" role="group">
		<!-- Bouton d'édition -->
		<a href="#user:<%- id %>/edit" class="btn btn-secondary btn-sm js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i></a>
		<!-- Bouton de mot de passe -->
		<a href="#user:<%- id %>/password" class="btn btn-secondary btn-sm js-editPwd" role="button"><i class="fa fa-key" title="Modifier"></i></a>
		<!-- Bouton suppression -->
		<button type="button" class="btn btn-danger btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>
		<!-- Bouton mdp oublié -->
		<button type="button" class="btn btn-secondary btn-sm js-forgotten" data-toggle="tooltip" data-placement="top" title="Mot de passe oublié"><i class="fa fa-envelope" aria-hidden="true"></i></span></button>
		<!-- Bouton connect en tant que -->
		<button type="button" class="btn btn-secondary btn-sm js-sudo" data-toggle="tooltip" data-placement="top" title="Connecter en tant que..." ><i class="fa fa-sign-in" aria-hidden="true"></i></span></button>
	</div>
</td>
