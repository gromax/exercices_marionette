<ul class="list-group">
<% _.each(list,function(item){ %>
	<% switch(item.type) { case "success" : %>
	<li class="list-group-item list-group-item-success"><i class="fa fa-check-square" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% break; case "error": %>
	<li class="list-group-item list-group-item-danger"><i class="fa fa-times-rectangle" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% break; default: %>
	<li class="list-group-item list-group-item-primary"><i class="fa fa-square" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% } %>
<% }) %>
</ul>
