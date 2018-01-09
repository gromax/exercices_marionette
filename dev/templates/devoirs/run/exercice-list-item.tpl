<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- idE %></span> <%- title %></h5>
<p class="list-group-item-text"><%- description %></p>

<hr>

<% if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ %>
<p><%- value.tag %> : <%- value.options[value.value] %></p>
	<% });
} %>
<p>Répétitions : <%- num %> | coefficient <%- coeff %></p>
<p>Note : <%- note %></p>
Vous avez répété cet exercice <%- n_faits %> fois.
