<% switch(type) { case "text" : %>
	<% _(ps).each(function(p){ %>
<p class="card-text"><%= p %></p>
	<% }) %>

<% break; case "ul": %>
<ul class="list-group list-group-flush">
<% _.each(list,function(item){ %>
	<% switch(item.type) { case "success" : %>
	<li class="list-group-item list-group-item-success"><%= item.text %></li>
	<% break; case "error": %>
	<li class="list-group-item list-group-item-danger"><%= item.text %></li>
	<% break; case "warning": %>
	<li class="list-group-item list-group-item-warning"><%= item.text %></li>
	<% break; case "info": %>
	<li class="list-group-item list-group-item-info"><%= item.text %></li>
	<% break; default: %>
	<li class="list-group-item list-group-item-primary"><%= item.text %></li>
	<% } %>
<% }) %>
</ul>

<% break; case "tableau": %>
<div class="table-responsive">
<table class="table table-bordered">
	<% if (entetes) { %>
	<thead class="thead-dark">
		<tr>
		<% _.each(entetes, function(entete_item){ %>
			<th><%- entete_item %></th>
		<% }) %>
		</tr>
	</thead>
	<% } %>
	<% if (lignes) { %>
	<tbody>
		<% _.each(lignes, function(ligne_item){ %>
		<tr>
			<% _.each(ligne_item, function(cell_item){ %>
				<td><%- cell_item %></td>
			<% }) %>
		</tr>
		<% }) %>
	</tbody>
	<% } %>
</table>
</div>
<% } %>
