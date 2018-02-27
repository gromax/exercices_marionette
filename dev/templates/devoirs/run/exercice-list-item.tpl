<div class="justify-content-between">
<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- numero %></span> <%- title %> &emsp; <small><span title="Répéter <%- num %> fois"><i class="fa fa-repeat"></i>&nbsp; <%- num %></span> | <span title="Coefficient <%- coeff %>"><i class="fa fa-balance-scale"></i></span><%- coeff %></small></h5>

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
<a href="#" class="btn btn-success btn-lg js-faits" role="button" title="Voir les essais sauvegardés"><%- note %>&nbsp;%</a>
</div>
</div>
<% if(n_faits< num) {%>
<p class="text-danger">Vous devez encore faire cet exercice <b><%- num-n_faits %> fois</b>.</p>
<% } else { %>
<p class="text-success">Vous avez répété cet exercice <b><%- n_faits %> fois</b>. Vous pouvez continuer pour améliorer votre note.</p>
<% } %>
</div>
