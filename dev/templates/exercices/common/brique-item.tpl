<% switch(type) { case "text" : %>
	<% _(ps).each(function(p){ %>
<p class="card-text"><%= p %></p>
	<% }) %>
<% break; case "input": %>
<div class="form-group row">
	<label for="exo-<%- name %>" class="col-sm-2 col-form-label"><%- tag %></label>
	<div class="col-sm-10">
		<input type="text" class="form-control" id="exo-<%- name %>" name="<%- name %>" placeholder="<%- description %>" value="">
	</div>
</div>

<% break; case "latex-input": %>
<div class="form-group row">
	<label for="exo-<%- name %>" class="col-sm-2 col-form-label"><%- tag %></label>
	<div class="col-sm-10">
		<span class="js-mathquill" style="width:90%;"></span>
		<input type="hidden" id="exo-<%- name %>" name="<%- name %>" value="">
	</div>
</div>

<% break; case "radio": %>
	<% _.each(radio,function(subItem,key){
		var radio_id = ""+Math.random()
	%>
<div class="form-check">
	<input class="form-check-input" type="radio" id="radio<%- radio_id %>" name="<%- name %>" value="<%- key %>" <% if (key==0){ %>checked<% } %> >
	<label class="form-check-label" for="radio<%- radio_id %>">
		<%- subItem %>
	</label>
</div>
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

<% break; case "aide": %>
<ul class="list-group list-group-flush js-liste-aide" style="display:none;">
<% _.each(list,function(item){ %>
	<li class="list-group-item list-group-item-info"><%= item %></li>
<% }) %>
</ul>

<% } %>
