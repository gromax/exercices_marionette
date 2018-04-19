<% _.each(radio,function(subItem,key){
	var radio_id = ""+Math.random()
%>
<div class="form-check">
	<input class="form-check-input" type="radio" id="radio<%- radio_id %>" name="<%- name %>" value="<%- key %>" <% if (key==0){ %>checked<% } %> >
	<label class="form-check-label" for="radio<%- radio_id %>">
		<%- subItem %>
	</label>
</div>
<% }) %>
