<div class="card">
	<div class="card-header"><% if (unique && !locked) { %><button type="button" class="btn btn-dark js-refresh" index="0"><i class="fa fa-refresh"></i></button> &nbsp; <% } %> <%- title %></div>

	<% if (message) { %>
	<div class="card-body bg-warning">
	<%- message %>
	</div>
	<% } %>

<%
	var item_count = 0;
	var enumi = {
		A:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		a:"abcdefghijklmnopqrstuvwxyz",
		"1":"123456789",
		"I":["I","II","III","IV","V","VI","VII","VIII","IX"],
		"i":["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]
	}

	var fct_recursive = function(el,index){
		if (typeof el == "string"){
%><%= el %>
<%		} else if((typeof el == "object")&&(el!==null)){
			switch (el.type){
				case "subtitles":
					_.each(el.children,function(sub_el, sub_index){
%><div class="card-body">
	<p class="card-text"><% if ((!locked)&&(el.refresh)) {%><button type="button" class="btn btn-dark js-refresh" index="<%- sub_index %>"><i class="fa fa-refresh"></i></button> &nbsp; <% } %><% if(el.enumi){ %><%- enumi[el.enumi][sub_index] %>) <% } %><%- el.title || "" %><%- sub_el.title || "" %></p>
</div>
<%						_.each(sub_el.children, fct_recursive);
					});
					break;
				case "2cols":
%><div class="row"><div class="col-6">
<%					fct_recursive(el.col1,index); %>
</div><div class="col-6">
<%					fct_recursive(el.col2,index); %>
</div></div>
<%					break;
				case "text":
%><div class="card-body">
<% _.each(el.children,function(p){ %><p class="card-text"><%= p %></p><% }); %>
</div>
<%
					break;
				case "enumerate":
%><ul class="list-group list-group-flush">
	<% _.each(el.children,function(sub_el, sub_index){ %>
		<li class="list-group-item"><% if ((!locked)&&(el.refresh)){ %><button type="button" class="btn btn-dark js-refresh" index="<%- sub_index %>"><i class="fa fa-refresh"></i></button> &nbsp; <% } %><% if(el.enumi){ %><%- enumi[el.enumi][sub_index] %>) <% } fct_recursive(sub_el,sub_index); %></li>
	<% }) %>
</ul>
<%
					break;
				case "tableau":
%><div class="table-responsive">
	<table class="table table-bordered">
<%					if (el.entetes) { %>
		<thead class="thead-dark"><tr>
<%						_.each(el.entetes, function(entete_item){ %>
			<th><%- entete_item %></th>
<%						}) %>
		</tr></thead>
<%					}
					if (el.lignes) { %>
		<tbody>
<%						_.each(el.lignes, function(ligne_item){ %>
			<tr>
<%							_.each(ligne_item, function(cell_item){ %>
				<td><%- cell_item %></td>
<%							}) %>
			</tr>
<%						}) %>
		</tbody>
<%					} %>
</table>
</div>
<%
					break;
			}
		}
	}

	_.each(children, fct_recursive);
%>
</div>
