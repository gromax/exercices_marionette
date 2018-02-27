<div class="card">
	<div class="card-header">
		Connexion
	</div>
	<div class="card-body">
		<form>
			<div class="form-group row">
				<label for="user-identifiant" class="col-form-label col-sm-3">Email</label>
				<div class="col-sm-9">
					<input type="email" class="form-control" name="identifiant" id="user-identifiant" placeholder="Entrez un email" value="">
				</div>
			</div>

			<div class="form-group row">
				<label for="user-pwd" class="col-form-label col-sm-3">Mot de passe</label>
				<div class="col-sm-9">
					<input type="password" class="form-control" name="pwd" id="user-pwd" placeholder="Entrez un mot de passe">
				</div>
			</div>
			<button class="btn btn-primary js-submit">Valider</button>
			<div id="messages"></div>
		</form>
	</div>
</div>
