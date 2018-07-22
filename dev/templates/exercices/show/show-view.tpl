<div class="card">
<div class="card-header text-white bg-primary"><h3><%- title %> <% if (showReinitButton){ %><button type="button" class="js-reinit btn btn-sm" title="Réinitialiser"><i class="fa fa-refresh"></i></button><% } %><% if (!_.isEmpty(options) && showOptionsButton){ %>&nbsp;<button type="button" class="js-options btn btn-sm" title="Options"><i class="fa fa-cog"></i></button> <% } %><% if (showAnswersButton){ %>&nbsp;<button type="button" class="js-answers btn btn-sm" title="Réponses utilisateur"><i class="fa fa-question"></i></button><% } %><% if (showMessagesButton){ %>&nbsp;<button type="button" class="js-show-messages btn btn-sm" title="Voir les messages"><i class="fa fa-commenting"></i></button><% } %></h3></div>
</div>

<div id="options"></div>

<div id="messages"></div>

<div id="collection"></div>

<div id="exercice-pied"></div>
