<% if (finished) { %>
<div class="card-header text-white bg-success">
<h3>L'exercice est terminé. Votre note est : <b><%- note %>/100</b>.</h3>
</div>
<% } else { %>
<div class="card-header text-white bg-danger">
<h3>L'exercice n'est pas terminé.</h3>
</div>
<% } %>
