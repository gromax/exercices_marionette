<nav class="navbar navbar-dark bg-primary navbar-expand-lg">
	<a class="navbar-brand js-home" href="#Home">Exercices de maths &nbsp; <span class="js-spinner"></span><% if (isAdmin){ %> <span class="badge badge-warning">Compte Admin</span><% } %></a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
		<span class="navbar-toggler-icon"></span>
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<% if (isOff) { %>
		<ul class="navbar-nav ml-auto">
			<li class="nav-item"><a class="nav-link js-login" href="#login"><i class="fa fa-sign-in" aria-hidden="true"></i> Connexion</a></li>
		</ul>
		<%} else {%>
		<ul class="navbar-nav ml-auto">
			<li class="nav-item"><a class="nav-link js-edit-me" href="#"><i class="fa fa-user"></i> &nbsp; <%- nomComplet %></a></li>
			<li class="nav-item"><a class="nav-link js-logout" href="#"><i class="fa fa-sign-out"></i> &nbsp; Déconnexion</a></li>
		</ul>
		<%}%>
		<span class="navbar-text">Version <%- version %></span>
	</div>
</nav>
