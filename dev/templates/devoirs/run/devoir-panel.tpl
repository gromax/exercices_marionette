<h2><%- nomFiche %></h2>

<p><%- description %></p>

<% if (!actif) { %>
<div class="alert alert-warning" role="alert">
<h4 class="alert-heading"><i class="fa fa-exclamation-circle fa-lg"></i> Ce devoir est verrouillé</h4>
<% if (!profMode) { %><p>Vous pouvez continuer mais vos essais ne seront ni enregistrés ni comptabilisés dans la note.</p><% } %>
</div>
<% } %>
