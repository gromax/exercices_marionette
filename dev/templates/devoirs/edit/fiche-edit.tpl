<form>
	<div class="form-group">
		<label for="devoir-nom" class="control-label">Nom :</label>
		<input class="form-control" id="devoir-nom" name="nom" type="text" value="<%- nom %>" placeHolder="Nom"/>
	</div>

	<div class="form-group">
		<label for="devoir-description" class="control-label">Description :</label>
		<input class="form-control" id="devoir-description" name="description" type="text" value="<%- description %>" placeHolder="Description"/>
	</div>

	<div class="checkbox">
		<label>
			<input type="checkbox" name="visible" <% if (visible) { %> checked <% } %> > Devoir visible
		</label>
	</div>

	<div class="checkbox">
		<label>
			<input type="checkbox" name="actif" <% if (actif) { %> checked <% } %> > Devoir activé
		</label>
	</div>

	<div class="form-group">
		<label for="devoir-notation" class="control-label">Type de notation :</label>
		<select class="form-control" id="devoir-notation" name="notation">
			<option value=0 <% if(0==notation) { %>selected<% } %> >Poids dégressif</option>
			<option value=1 <% if(1==notation) { %>selected<% } %> >Valeur supérieure</option>
		</select>
	</div>

	<button class="btn btn-success js-submit">Enregistrer</button>
</form>
