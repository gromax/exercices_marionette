<div class="list-group">
<% _.each(list,function(item,index){ %>
	<a href="#" class="list-group-item list-group-item-action" index=<%- index %> ><i class="fa fa-square fa-2x"></i> &nbsp; <%= item.text %></a>
<% });
var stringDefault = _.map(list, function(item){ return -1 }).join(';');
%>
<input type="hidden" name="<%- name %>" value="<%- stringDefault %>">
</div>
