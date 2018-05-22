<div class="form-group row">
	<% if (typeof format == "undefined") { // format de base %>
	<label class="col-4 col-form-label"><%- tag %></label>
	<div class="col-8">
		<input type="text" class="form-control" id="exo-<%- name %>" name="<%- name %>" <% if (typeof description != "undefined") { %> placeholder="<%- description %>" <% } %> value="">
	</div>
	<% } else {
		// format est un tableau d'objets { cols, name, class, text, latex }
		_.each(format, function(item){ %>
	<div class="col-<%- item.cols %> <%- item.class %>"><%
			if (item.name) {
				if (pref.mathquill && item.latex) { %>
		<span class="js-mathquill" id="mq-exo-<%- item.name %>" style="width:100%;"></span>
		<input type="hidden" id="exo-<%- item.name %>" name="<%- item.name %>" value="" <% if(item.description) { %> placeholder="<%- item.description %>" <% } %> >
				<% } else { %>
		<input type="text" class="form-control" id="exo-<%- item.name %>" name="<%- item.name %>" value="">
				<% }
			} else { %>
		<%= item.text %>
			<% }
	%></div><%
		});
	} %>
</div>
