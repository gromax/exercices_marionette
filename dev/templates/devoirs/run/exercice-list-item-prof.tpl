<div class="justify-content-between">
<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- numero %></span> <%- title %> &emsp; <small><span title="Fait <%- n_faits %> fois sur <%- num %> fois"><i class="fa fa-repeat"></i>&nbsp;<span class="<% if(n_faits< num) {%>text-danger<% } else { %>text-success<% } %>"><%- n_faits %></span> / </span> <%- num %></span> | <span title="Coefficient <%- coeff %>"><i class="fa fa-balance-scale"></i></span><%- coeff %></small></h5>

<div class="row">
<div class="col">
<p class="mb-1"><%- description %></p>
<% if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ %>
<p><%- value.tag %> : <%- value.options[value.value] %></p>
	<% });
} %>
</div>
<div class="col-2 align-self-end align-top">
<h2><span class="badge badge-success"><%- note %>&nbsp;%</span></h2>
</div>
</div>
</div>
