<div class="form-group row">
	<% if (typeof format == "undefined") { // format de base %>
	<label class="col-sm-2 col-form-label"><%- tag %></label>
	<div class="col-sm-9">
		<input type="text" class="form-control" id="exo-<%- name %>" name="<%- name+'['+index+']' %>" <% if (typeof description != "undefined") { %> placeholder="<%- description %>" <% } %> value="">
	</div>
	<div class="col-sm-1">
		<button class="btn btn-default js-remove-input" type="button" title="Ajouter un champ" index=<%- index %>><i class="fa fa-minus"></i></button></p>
	</div>
	<% } else {
		// format est un tableau d'objets { cols, name, class, text, latex }
		_.each(format, function(item){ %>
	<div class="col-sm-<%- item.cols %> <%- item.class %>"><%
			if (item.name) {
				if (item.latex) { %>
		<span class="js-mathquill" id="mq-exo-<%- item.name %>" style="width:100%;"></span>
		<input type="hidden" id="exo-<%- item.name %>" name="<%- item.name+'['+index+']' %>" value="" <% if(item.description) { %> placeholder="<%- item.description %>" <% } %> >
				<% } else { %>
		<input type="text" class="form-control" id="exo-<%- item.name+'['+index+']' %>" name="<%- item.name %>" value="">
				<% }
			} else { %>
		<%= item.text %>
			<% }
	%></div><%
		}); %>
	<div class="col-sm-1">
		<button class="btn btn-default js-remove-input" type="button" title="Supprimer la ligne" index=<%- index %>><i class="fa fa-minus"></i></button></p>
	</div><%
	} %>
</div>
