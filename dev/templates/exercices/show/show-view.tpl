<div class="card">
<div class="card-header text-white bg-primary"><h3><%- title %> <% if (showReinitButton){ %><button type="button" class="js-reinit btn btn-sm" title="Réinitialiser"><i class="fa fa-refresh"></i></button><% } %> <% if (!_.isEmpty(options) && showOptionsButton){ %> <button type="button" class="js-options btn btn-sm" title="Options"><i class="fa fa-cog"></i></button> <% } %> </h3></div>
</div>

<div id="options"></div>

<div id="collection"></div>

<div id="exercice-pied"></div>
