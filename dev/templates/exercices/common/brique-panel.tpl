<div class="card">

<% if (title) { %>
	<div class="card-header"><%- title %></div>
<% } %>

<% if(needForm) { %>
	<form>
		<div class="js-items" ></div>
	</form>
<% } else { %>
	<div class="js-items"></div>
<% } %>

</div>
