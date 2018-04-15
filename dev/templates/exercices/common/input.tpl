<div class="form-group row">
	<label class="col-sm-2 col-form-label"><%- tag %></label>
	<% if (typeof format == "undefined") { // format de base %>
		<div class="col-sm-10">
			<input type="text" class="form-control" id="exo-<%- name %>" name="<%- name %>" placeholder="<%- description %>" value="">
		</div>
	<% } else {
		// format est un tableau d'objets { cols, name, class, text, latex }
		_.each(format, function(item){ %>
		<div class="col-sm-<%- item.cols %> <%- item.class %>"><%
			if (item.name) {
				if (item.latex) { %>
					<span class="js-mathquill" id="mq-exo-<%- name %>" style="width:100%;"></span>
					<input type="hidden" id="exo-<%- name %>" name="<%- name %>" value="">
				<% } else { %>
			<input type="text" class="form-control" id="exo-<%- item.name %>" name="<%- item.name %>" value="">
				<% }
			} else { %>
			<span><%- item.text %></span>
			<% }
		%></div><%
		});
	} %>
</div>
