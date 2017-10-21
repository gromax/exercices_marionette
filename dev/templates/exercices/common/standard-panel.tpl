<% if (title) {%>
<div class="card-header"><h4 class="card-title"><%- title %></h4></div>
<% } %>
<% _(zones).each(function(item){ %>
	<% if (item.type=="plain") { %>
<div class="card-block">
	<% _(item.ps).each(function(p){ %>
	<p class="card-text"><%= p %></p>
	<% }) %>
</div>
	<% } %>
<% }) %>
