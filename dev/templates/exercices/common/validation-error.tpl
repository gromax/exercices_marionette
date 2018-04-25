<% if (_.isArray(error)) {
	_.each(error, function(item){ %>
<small class='js-validation-error'><i class='fa fa-exclamation-triangle'></i><%- item %></small>
<%	});
} else { %>
<small class='js-validation-error'><i class='fa fa-exclamation-triangle'></i><%- error %></small>
<% } %>
