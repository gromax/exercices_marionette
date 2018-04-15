<div class="form-group row">
	<label class="col-sm-2 col-form-label"><%- tag %></label>
	<% _.each(format, function(item){ %>
	<div class="col-sm-<%- item.cols %> <%- item.class %>"><%
		if (item.name) { %>
		<input type="text" class="form-control" id="exo-<%- item.name %>" name="<%- item.name %>" value="">
		<% } else { %>
		<span><%- item.text %></span>
		<% }
	%></div><%
	}); %>
</div>
