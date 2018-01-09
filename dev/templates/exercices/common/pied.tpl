<% if (finished) { %>
<div class="card text-white bg-success">
<p class="card-text">L'exercice est terminé. Votre note est : <b><%- note %>/100</b>.</p>
</div>
<% } else { %>
<div class="card text-white bg-danger">
<p class="card-text">L'exercice n'est pas terminé.</p>
</div>
<% } %>
