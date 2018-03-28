<nav class="navbar navbar-dark bg-primary">
	<a class="navbar-brand js-home" href="#Home">Exercices de maths &nbsp; <span class="js-spinner"></span></a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
		<span class="navbar-toggler-icon"></span>
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<% if (isOff) { %>
			<ul class="navbar-nav">
				<li class="nav-item"><a class="nav-link js-login" href="#login"><i class="fa fa-sign-in" aria-hidden="true"></i> Connexion</a></li>
			</ul>
		<%}%>
		<% if (isAdmin) { %>
			<ul class="navbar-nav">
				<li class="nav-item"><a class="nav-link js-logout" href="#logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Déconnexion</a></li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >
					<%- nomComplet %>
					</a>
					<div class="dropdown-menu">
						<a class="dropdown-item js-users" href="#Comptes"><i class="fa fa-users" aria-hidden="true"></i> Voir les utilisateurs</a>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item js-edit-me" href="#edit-me"><i class="fa fa-user" aria-hidden="true"></i> Mon compte</a>
					</div>
				</li>
			</ul>
		<%}%>
		<% if (isEleve) { %>
			<ul class="navbar-nav">
				<li class="nav-item"></li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >
					<%- nomComplet %>
					</a>
					<div class="dropdown-menu">
						<a class="dropdown-item js-logout" href="#logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Déconnexion</a>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item js-edit-me" href="#edit-me"><i class="fa fa-user" aria-hidden="true"></i> Mon compte</a>
					</div>
				</li>
			</ul>
		<%}%>
	</div>
</nav>
