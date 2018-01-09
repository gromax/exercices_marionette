<div class="card-header text-white bg-warning"><h4>Options</h4></div>

<div class="card-block">
	<form>
<% _.each(optionsItems, function(item, index){ %>
		<div class="form-group row">
			<label for="optionItem_<%- index %>" class="col-3 col-form-label"><%- item.tag %></label>
			<div class="col-8">
				<select class="form-control" id="optionItem_<%- index %>" name="<%- item.key %>">
	<% _.each(item.options, function(itemChoice, indexChoice){ %>
					<option value="<%- indexChoice %>" <% if(indexChoice==item.value) { %>selected<% } %> ><%- itemChoice %></option>
	<% }); %>
				</select>
			</div>
		</div>
<% }); %>
		<button type="submit" class="btn btn-default js-submit">Valider</button>
	</form>
</div>
