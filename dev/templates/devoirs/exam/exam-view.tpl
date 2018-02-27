<div class="card">
	<div class="card-header text-white bg-primary">
		<h3>
			<%- nom %> &nbsp;
			<div class="btn-group" role="group">
<% if (locked) {%>
				<button type="button" class="btn btn-danger js-lock"><i class="fa fa-3 fa-lock" title="Déverouiller"></i></button>
<% } else { %>
				<button type="button" class="btn btn-success js-lock"><i class="fa fa-3 fa-unlock" title="Vérouiller"></i></button>
<% } %>
				<button type="button" class="btn btn-warning js-tex"><i class="fa fa-3 fa-font" title="Tex"></i></button>
			</div>
		</h3>
	</div>
</div>

<div id="exam-tex"></div>

<div id="exam-collection"></div>

<div id="exam-pied"></div>
