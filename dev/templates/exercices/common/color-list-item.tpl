<ul class="list-group">
<% _.each(list,function(item){ %>
	<% switch(item.type) { case "success" : %>
	<li class="list-group-item list-group-item-success"><i class="fa fa-check-square fa-2x" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square fa-2x" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% break; case "error": %>
	<li class="list-group-item list-group-item-danger"><i class="fa fa-times-rectangle fa-2x" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square fa-2x" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% break; default: %>
	<li class="list-group-item list-group-item-primary"><i class="fa fa-square fa-2x" style="color:<%- item.color %>"></i> &nbsp; <%= item.text %><% if(item.secondColor) { %> &nbsp; <i class="fa fa-square fa-2x" style="color:<%- item.secondColor %>"></i><% } %></li>
	<% } %>
<% }) %>
</ul>
