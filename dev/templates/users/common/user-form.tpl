<form>
	<div class="form-group">
		<label for="user-prenom" class="control-label">Prénom :</label>
		<input class="form-control" id="user-prenom" name="prenom" type="text" value="<%- prenom %>" placeHolder="Prénom"/>
	</div>
	<div class="form-group">
		<label for="user-nom" class="control-label">Nom :</label>
		<input class="form-control" id="user-nom" name="nom" type="text" value="<%- nom %>" placeHolder="Nom"/>
	</div>

	<% if (rank!="Root"){ %>
	<div class="form-group">
		<label for="user-email" class="control-label">@ :</label>
		<input class="form-control" id="user-email" name="email" type="text" value="<%- email %>" placeHolder="email"/>
	</div>
	<% } %>
	<% if (showPWD){ %>
		<div class="form-group">
		<label for="user-pwd" class="control-label">Mot de passe :</label>
		<input class="form-control" id="user-pwd" name="pwd" type="password" value="" placeHolder="Mot de passe"/>
	</div>
	<%}%>

	<% if (ranks!==false){%>
		<%if (ranks==1) {%>
			<input name="rank" type="hidden" value=""/>
		<%} else {%>
	<div class="form-group">
		<label for="user-rank">Rang :</label>
		<select class="form-control" id="user-rank" name="rank">
			<option value="Prof">Professeur</option>
			<option value="Admin">Administrateur</option>
		</select>
	</div>
		<%}%>
	<%}%>
	<button class="btn btn-success js-submit">Enregistrer</button>
</form>
