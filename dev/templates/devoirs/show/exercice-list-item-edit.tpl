<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary"><%- idE %></span> <%- title %></h5>
<p class="list-group-item-text"><%- description %></p>

<hr>
<form>
<% if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ %>

<div class="form-group">
	<label for="exo-option-<%- key %>"><%- options[key].tag %></label>
	<select class="form-control" id="exo-option-<%- key %>" name="option_<%- key %>">
		<% _.each(value.options, function(optElement, optIndex, list){%>
		<option value="<%- optIndex %>" <% if(optIndex==value.value) { %> selected <% }; %> > <%- optElement %> </option>
		<% }); %>
	</select>
</div>

	<% });
} %>

<div class="form-group row">
	<label for="exo-num" class="col-sm-2 col-form-label">Répétitions</label>
	<div class="col-sm-10">
		<input type="text" class="form-control" id="exo-num" name="num" value="<%- num %>" placeholder="Nombre de répétitions">
	</div>
</div>

<div class="form-group row">
	<label for="exo-coeff" class="col-sm-2 col-form-label">Coefficient</label>
	<div class="col-sm-10">
		<input type="text" class="form-control" id="exo-coeff" name="coeff" value="<%- coeff %>" placeholder="Coefficient de l'exercice">
	</div>
</div>

<div class="btn-group" role="group">
	<!-- Bouton d'édition -->
	<button type="button" class="btn btn-sm js-cancel">Annuler</button>
	<!-- Bouton suppression -->
	<button type="submit" class="btn btn-success btn-sm js-submit">Enregistrer</button>
</div>
</form>
