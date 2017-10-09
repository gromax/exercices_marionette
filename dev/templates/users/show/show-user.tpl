<h1><%- prenom %> <%- nom %></h1>

<p><strong>email :</strong> <%- email %></p>
<p><strong>Classe :</strong> <%- nomClasse %></p>
<p><strong>Rang :</strong> <%- rank %></p>

<div class="btn-group" role="group">
<a href="#user:<%- id %>/edit" class="btn btn-success js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i> Modifier</a>
<a href="#user:<%- id %>/password" class="btn btn-success js-editPwd" role="button"><i class="fa fa-key" title="Mot de passe"></i> Modifier le mot de passe</a>
</div>
