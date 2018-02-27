<div class="list-group">
<% _.each(list,function(item){ %>
	<a href="#" class="list-group-item list-group-item-action"><i class="fa fa-square fa-2x"></i> &nbsp; <%= item.text %><input type="hidden" name="<%- name %><%- item.rank %>" value=-1></a>
<% }) %>
</div>
