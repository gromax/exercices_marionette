<form>
<% if (closedMode) {
%><button type="button" class="btn btn-warning js-add">Ajouter un message</button><%
} else {
%> <div class="form-group">
<h4>Moi <i class="fa fa-long-arrow-right"></i> <%- dest %></h4>
<label for="message-message">Contenu du message</label>
<textarea class="form-control" id="message-message" name="message" rows="3"></textarea>
</div>
<div class="btn-group" role="group">
<button class="btn btn-danger js-cancel">Annuler</button>
<button class="btn btn-success js-submit">Envoyer</button>
</div>
<%
} %>
</form>
