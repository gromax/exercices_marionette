<form>
<% _.each(answers, function(value, key){ %>
	<div class="form-group row">
		<label for="aItem_<%- key %>" class="col-3 col-form-label"><%- key %></label>
		<div class="col-8">
			<input type="text" class="form-control" id="aItem_<%- key %>" name="<%- key %>" value="<%- value %>">
		</div>
	</div>
<% }); %>
	<button type="button" class="btn btn-danger js-cancel">Annuler</button> <button type="submit" class="btn btn-default js-submit">Valider</button>
</form>
