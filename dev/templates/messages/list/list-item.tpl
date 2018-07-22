<div class="row">
<div class="col">
<% if (lu || opened) {
%><%- ownerName %> <i class="fa fa-long-arrow-right" aria-hidden="true"></i> <%-destNames%><%
} else {
%><i class="fa fa-exclamation-circle"></i> <b><%- ownerName %> <i class="fa fa-long-arrow-right" aria-hidden="true"></i> <%-destNames%></b><%
} %>&emsp;<i class="<% if (opened) { %>fa fa-chevron-circle-down<% } else {%>fa fa-chevron-circle-right<% } %>"></i><%if (showExoLink && (aUE!=0)){%>&emsp; <a href="#exercice-fait:<%-aUE%>" class="btn btn-outline-secondary btn-sm js-show-exercice" role="button">Voir exercice : <%-aUE%></a><%}%>
</div>
<div class="col-1">
<% if (enableDelete) {%><button type="button" class="btn btn-outline-danger btn-sm js-delete"><i class="fa fa-trash"></i></button><% } %>
</div>
</div>
<div class="js-content"><%if (opened) {%><%-message%><%}%></div>
