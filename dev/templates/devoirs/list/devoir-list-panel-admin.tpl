<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">
	<div class="input-group">
		<span class="input-group-btn">
			<% if (showInactifs) {
			%><button class="btn btn-success js-inactive-filter" type="button">Inactifs <i class="fa fa-eye"></i></button><%
			} else {
			%><button class="btn btn-danger js-inactive-filter" type="button">Inactifs <i class="fa fa-eye-slash"></i></button><% }%>
		</span>
	</div>
</form>
