<div class="jumbotron">
	<h1>Bienvenue !</h1>

	<p>Vous êtes administrateur du site. Vous pouvez exécuter une des commandes suivantes :</p>

	<div class="list-group">
		<a type="button" class="list-group-item list-group-item-action js-messages" href="#messages"><i class="fa fa-comment" aria-hidden="true"></i> Messages<% if (unread>0){%>&emsp;<span class="badge badge-danger"><%-unread%> message(s) non lu(s)<% } %></span></a>

		<a type="button" class="list-group-item list-group-item-action js-users" href="#users"><i class="fa fa-users" aria-hidden="true"></i> Voir les utilisateurs</a>

		<a type="button" class="list-group-item list-group-item-action js-classes" href="#classes"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Voir les classes</a>

		<a type="button" class="list-group-item list-group-item-action js-exercices" href="#exercices"><i class="fa fa-files-o" aria-hidden="true"></i> Voir les exercices</a>

		<a type="button" class="list-group-item list-group-item-action js-devoirs" href="#Devoirs"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Voir les devoirs</a>
	</div>
</div>
