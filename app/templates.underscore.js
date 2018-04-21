this["JST"] = this["JST"] || {};

this["JST"]["ariane/show/show-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (active){ ;
__p += '\n<a href="#' +
__e( link ) +
'">' +
((__t = ( text )) == null ? '' : __t) +
'</a>\n';
 } else { ;
__p += '\n' +
((__t = ( text )) == null ? '' : __t) +
'\n';
 } ;
__p += '\n\n';

}
return __p
};

this["JST"]["ariane/show/show-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ol></ol>\n';

}
return __p
};

this["JST"]["ariane/show/show-noview"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<i class="fa fa-spinner"></i> Chargement\n';

}
return __p
};

this["JST"]["classes/common/classe-form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form>\n\t<div class="form-group">\n\t\t<label for="classe-nom" class="control-label">Nom :</label>\n\t\t<input class="form-control" id="classe-nom" name="nom" type="text" value="' +
__e( nom ) +
'" placeHolder="Nom"/>\n\t</div>\n\n\t<div class="form-group">\n\t\t<label for="classe-description" class="control-label">Description :</label>\n\t\t<input class="form-control" id="classe-description" name="description" type="text" value="' +
__e( description ) +
'" placeHolder="Description"/>\n\t</div>\n\n\t<div class="checkbox">\n\t\t<label>\n\t\t\t<input type="checkbox" name="ouverte" ';
 if (ouverte) { ;
__p += ' checked ';
 } ;
__p += ' > Classe ouverte\n\t\t</label>\n\t</div>\n\n\t<div class="form-group">\n\t\t<label for="classe-pwd" class="control-label">Mot de passe :</label>\n\t\t<input class="form-control" id="classe-pwd" name="pwd" type="text" value="' +
__e( pwd ) +
'" placeHolder="Mot de passe"/>\n\t</div>\n\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["classes/list/classe-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nom ) +
'</td>\n<td>' +
__e( nomOwner ) +
'</td>\n<td>';
 if(ouverte) {;
__p += 'Ouverte';
} else {;
__p += 'Fermée ';
};
__p += '</td>\n<td>' +
__e( date ) +
'</td> <!-- à parser -->\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton d\'édition -->\n\t\t<a href="#classe:' +
__e( id ) +
'/edit" class="btn btn-secondary btn-sm js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i></a>\n\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t</div>\n</td>\n';

}
return __p
};

this["JST"]["classes/list/classe-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="6">Aucune classe à afficher.</td>\n';

}
return __p
};

this["JST"]["classes/list/classe-list-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary js-new" type="button">Nouvelle classe <i class="fa fa-graduation-cap"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["classes/list/classe-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th>#</th>\n\t\t<th>Nom</th>\n\t\t<th>Professeur</th>\n\t\t<th>Ouverte</th>\n\t\t<th><i class="fa fa-clock-o"></i></th>\n\t\t<th width="100"></th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["classes/show/show-classe"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
__e( nom ) +
'</h1>\n\n<p><strong>description :</strong> ' +
__e( description ) +
'</p>\n<p><strong>Professeur :</strong> ' +
__e( nomOwner ) +
'</p>\n';
 if (ouverte) { ;
__p += '\n<p><strong>Ouverte</strong></p>\n';
 } else { ;
__p += '\n<p><strong>Fermée</strong></p>\n';
 } ;
__p += '\n<p><strong>Mot de passe :</strong> ' +
__e( pwd ) +
'</p>\n\n<div class="btn-group" role="group">\n<a href="#classe:' +
__e( id ) +
'/edit" class="btn btn-success js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i> Modifier</a>\n</div>\n';

}
return __p
};

this["JST"]["common/alert-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (dismiss) { ;
__p += '\n<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n\t<span aria-hidden="true">&times;</span>\n</button>\n';
 } ;
__p += '\n<h1>';
 if (type=="success"){ ;
__p += '<i class="fa fa-check-circle"></i>';
 } else { ;
__p += '<i class="fa fa-exclamation-triangle"></i>';
 } ;
__p += ' ' +
__e( title ) +
'</h1>\n<p>' +
__e( message ) +
'</p>\n';

}
return __p
};

this["JST"]["common/list-layout"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row justify-content-end">\n\t<div id="panel-region" ></div>\n</div>\n<div id="items-region"></div>\n';

}
return __p
};

this["JST"]["common/loading-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1>' +
__e( title ) +
'</h1>\n<p>' +
__e( message ) +
'</p>\n<div id="spinner"></div>\n';

}
return __p
};

this["JST"]["common/missing-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="alert alert-error">' +
__e( message ) +
'</div>\n';

}
return __p
};

this["JST"]["devoirs/edit/add-userfiche-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nom ) +
' ' +
__e( prenom ) +
'</td>\n<td>' +
__e( nomClasse ) +
'</td>\n<td align="right">\n';
 if (devoirCounter==0){;
__p += '\n\t<button type="button" class="btn btn-danger js-addDevoir">0 <i class="fa fa-plus" ></i></button>\n';
 } else { ;
__p += '\n\t<button type="button" class="btn btn-success js-addDevoir">' +
__e( devoirCounter ) +
' <i class="fa fa-plus" ></i></button>\n';
 } ;
__p += '\n</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/add-userfiche-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="4">Aucun utilisateur à afficher.</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/add-userfiches-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th><a href="" class="js-sort" name="id">#</a></th>\n\t\t<th><a href="" class="js-sort" name="nomComplet">Nom</a></th>\n\t\t<th><a href="" class="js-sort" name="nomClasse"><i class="fa fa-graduation-cap"></a></th>\n\t\t<!-- boutons verrou|modification|suppression|lien notes -->\n\t\t<th width="200"></th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["devoirs/edit/add-userfiches-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<input type="text" class="form-control search-query js-filter-criterion" placeholder="Filtrer..." value="' +
__e( filterCriterion ) +
'">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary" type="submit">Filtrer</button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/edit-fiche-layout"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="tabs-region"></div>\n<br>\n<div class="row justify-content-end">\n\t<div id="panel-region"></div>\n</div>\n<br>\n<div id="content-region"></div>\n<br>\n\n';

}
return __p
};

this["JST"]["devoirs/edit/exam-form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n\t<div class="form-group">\n\t\t<label for="exam-nom" class="control-label">Nom :</label>\n\t\t<input class="form-control" id="exam-nom" name="nom" type="text" value="' +
__e( nom ) +
'" placeHolder="Nom du document"/>\n\t</div>\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/exam-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nom ) +
'</td>\n<td>' +
__e( date ) +
'</td> <!-- à parser -->\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton d\'activation -->\n\t';
 if (locked) { ;
__p += '\n\t\t<button type="button" class="btn btn-danger btn-sm js-lock"><i class="fa fa-lock" title="Déverouiller"></i></button>\n\t';
 } else { ;
__p += '\n\t\t<button type="button" class="btn btn-success btn-sm js-lock"><i class="fa fa-unlock" title="Vérouiller"></i></button>\n\t';
 } ;
__p += '\n\t\t<!-- Bouton édition -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-edit"><i class="fa fa-pencil" aria-hidden="true" title="Éditer"></i></button>\n\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t</div>\n</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/exam-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="4">Aucun devoir à afficher.</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/exam-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th>#</th>\n\t\t<th>Nom</th>\n\t\t<th><i class="fa fa-clock-o"></i></th>\n\t\t<th width="50px"></th><!-- bouton lock|bouton de suppression -->\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["devoirs/edit/exam-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form class="form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary js-new" type="button">Nouveau Tex <i class="fa fa-font"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/exofiche-item-edit"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( idE ) +
'</span> ' +
__e( title ) +
'</h5>\n<p class="list-group-item-text">' +
__e( description ) +
'</p>\n\n<hr>\n<form>\n';
 if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ ;
__p += '\n\n<div class="form-group">\n\t<label for="exo-option-' +
__e( key ) +
'">' +
__e( options[key].tag ) +
'</label>\n\t<select class="form-control" id="exo-option-' +
__e( key ) +
'" name="option_' +
__e( key ) +
'">\n\t\t';
 _.each(value.options, function(optElement, optIndex, list){;
__p += '\n\t\t<option value="' +
__e( optIndex ) +
'" ';
 if(optIndex==value.value) { ;
__p += ' selected ';
 }; ;
__p += ' > ' +
__e( optElement ) +
' </option>\n\t\t';
 }); ;
__p += '\n\t</select>\n</div>\n\n\t';
 });
} ;
__p += '\n\n<div class="form-group row">\n\t<label for="exo-num" class="col-sm-2 col-form-label">Répétitions</label>\n\t<div class="col-sm-10">\n\t\t<input type="text" class="form-control" id="exo-num" name="num" value="' +
__e( num ) +
'" placeholder="Nombre de répétitions">\n\t</div>\n</div>\n\n<div class="form-group row">\n\t<label for="exo-coeff" class="col-sm-2 col-form-label">Coefficient</label>\n\t<div class="col-sm-10">\n\t\t<input type="text" class="form-control" id="exo-coeff" name="coeff" value="' +
__e( coeff ) +
'" placeholder="Coefficient de l\'exercice">\n\t</div>\n</div>\n\n<div class="btn-group" role="group">\n\t<!-- Bouton d\'édition -->\n\t<button type="button" class="btn btn-sm js-cancel">Annuler</button>\n\t<!-- Bouton suppression -->\n\t<button type="submit" class="btn btn-success btn-sm js-submit">Enregistrer</button>\n</div>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/exofiche-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( idE ) +
'</span> ' +
__e( title ) +
'</h5>\n<p class="list-group-item-text">' +
__e( description ) +
'</p>\n\n<hr>\n\n';
 if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ ;
__p += '\n<p>' +
__e( value.tag ) +
' : ' +
__e( value.options[value.value] ) +
'</p>\n\t';
 });
} ;
__p += '\n<div class="row">\n\t<div class="col">\n\t\t<p>Répétitions : ' +
__e( num ) +
' | coefficient ' +
__e( coeff ) +
'</p>\n\t</div>\n\t<div class="col-4">\n\t\t<div class="btn-group" role="group">\n\t\t\t<button type="button" class="btn btn-secondary btn-sm js-test"><i class="fa fa-eye" title="Tester"></i> Tester</button>\n\t\t\t<!-- Bouton d\'édition -->\n\t\t\t<button type="button" class="btn btn-secondary btn-sm js-edit"><i class="fa fa-pencil" title="Modifier"></i> Modifier</button>\n\t\t\t<!-- Bouton suppression -->\n\t\t\t<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t\t</div>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["devoirs/edit/exofiche-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5>Aucun exercice à afficher</h5>\n';

}
return __p
};

this["JST"]["devoirs/edit/exofiches-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form class="form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary js-new" type="button">Nouvel exercice <i class="fa fa-files-o"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/fiche-edit"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form>\n\t<div class="form-group">\n\t\t<label for="devoir-nom" class="control-label">Nom :</label>\n\t\t<input class="form-control" id="devoir-nom" name="nom" type="text" value="' +
__e( nom ) +
'" placeHolder="Nom"/>\n\t</div>\n\n\t<div class="form-group">\n\t\t<label for="devoir-description" class="control-label">Description :</label>\n\t\t<input class="form-control" id="devoir-description" name="description" type="text" value="' +
__e( description ) +
'" placeHolder="Description"/>\n\t</div>\n\n\t<div class="checkbox">\n\t\t<label>\n\t\t\t<input type="checkbox" name="visible" ';
 if (visible) { ;
__p += ' checked ';
 } ;
__p += ' > Devoir visible\n\t\t</label>\n\t</div>\n\n\t<div class="checkbox">\n\t\t<label>\n\t\t\t<input type="checkbox" name="actif" ';
 if (actif) { ;
__p += ' checked ';
 } ;
__p += ' > Devoir activé\n\t\t</label>\n\t</div>\n\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/edit/fiche-show"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
__e( nom ) +
'</h1>\n\n<p><strong>description :</strong> ' +
__e( description ) +
'</p>\n';
 if (nomOwner) { ;
__p += '\n<p><strong>Professeur :</strong> ' +
__e( nomOwner ) +
'</p>\n';
 } ;
__p += '\n\n';
 if (visible) { ;
__p += '\n<p><strong>Visible</strong></p>\n';
 } else { ;
__p += '\n<p><strong>Invisible</strong></p>\n';
 } ;
__p += '\n\n';
 if (actif) { ;
__p += '\n<p><strong>Active</strong></p>\n';
 } else { ;
__p += '\n<p><strong>Désactivée</strong></p>\n';
 } ;
__p += '\n\n<div class="btn-group" role="group">\n<a href="#devoir:' +
__e( id ) +
'/edit" class="btn btn-success js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i> Modifier</a>\n</div>\n';

}
return __p
};

this["JST"]["devoirs/edit/tabs-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="nav nav-tabs">\n  <li class="nav-item">\n    <a class="nav-link ';
 if(panel==0) {;
__p += 'active';
 } ;
__p += ' js-devoir" href="#">Devoir</a>\n  </li>\n  <li class="nav-item">\n    <a class="nav-link ';
 if(panel==1) {;
__p += 'active';
 } ;
__p += ' js-exercices" href="#">Exercices</a>\n  </li>\n  <li class="nav-item">\n    <a class="nav-link ';
 if(panel==2) {;
__p += 'active';
 } ;
__p += ' js-notes" href="#">Fiches élèves</a>\n  </li>\n  <li class="nav-item">\n    <a class="nav-link ';
 if(panel==3) {;
__p += 'active';
 } ;
__p += ' js-eleves" href="#">Élèves</a>\n  </li>\n  <li class="nav-item">\n    <a class="nav-link ';
 if(panel==4) {;
__p += 'active';
 } ;
__p += ' js-exams" href="#">Versions papier</a>\n  </li>\n</ul>\n';

}
return __p
};

this["JST"]["devoirs/edit/userfiche-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nomUser ) +
' ' +
__e( prenomUser ) +
'</td>\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-secondary js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t\t';
 if (actif) { ;
__p += '\n\t\t\t<button type="button" class="btn btn-success js-actif" title="Désactiver">Note : <b>' +
__e( note ) +
'</b></button>\n\t\t';
 } else { ;
__p += '\n\t\t\t<button type="button" class="btn btn-danger js-actif" title="Activer">Note : <b>' +
__e( note ) +
'</b></button>\n\t\t';
 } ;
__p += '\n\t</div>\n</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/userfiche-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="3">Aucune note à afficher</td>\n';

}
return __p
};

this["JST"]["devoirs/edit/userfiches-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th><a href="" class="js-sort" name="id">#</a></th>\n\t\t<th><a href="" class="js-sort" name="nomCompletUser">Nom</a></th>\n\t\t<!-- boutons suppression|note verrouillage -->\n\t\t<th width="100"><a href="" class="js-sort" name="_note">Note</a></th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["devoirs/exam/exam-tex"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\\documentclass[11pt]{article}\n\\title{Exercices - n' +
__e( id ) +
' }\n\\usepackage{etex}\n\\usepackage[french]{babel}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage[dvipsnames]{xcolor}\n\\usepackage{amsmath,amssymb}\n\\usepackage{multicol}\n\\usepackage[top=1.5cm, bottom=2cm, left=1.8cm, right=1.8cm]{geometry}\n%------entêtes------------------------\n\\usepackage{fancyhdr}\n\\usepackage{lastpage}\n\\chead{Exercices - ' +
__e( nom ) +
' - n' +
__e( id ) +
' }\n\\lhead{}\n\\rhead{}\n\\renewcommand{\\headrulewidth}{0.5mm}\n\\renewcommand{\\footrulewidth}{0.5mm}\n\\cfoot{Page \\thepage /\\pageref{LastPage}}\n\\pagestyle{fancy}\n%--------------------------------------\n\\usepackage{pstricks-add} % tracé de courbes\n\\usepackage{tikz}\n\\usepackage{tkz-tab}\n\\usetikzlibrary{arrows}\n\\usepackage{enumerate}\n\\usepackage{fancybox} % Pour les encadrés\n\\usepackage{gensymb}\n\\usepackage[np]{numprint}\n\n\\newcounter{numexo} %Création d\'un compteur qui s\'appelle numexo\n\\setcounter{numexo}{0} %initialisation du compteur\n\\newcommand{\\exercice}[1]{\n\t\\addtocounter{numexo}{1}\n\t\\setlength {\\fboxrule }{1pt}\n\t\\vspace{5mm}\n\t\\hspace{-1cm}\\fcolorbox{black}{black!10}{\\textbf{Exo \\,\\thenumexo\\,} }\\hspace{5mm}#1\n\t\\vspace{5mm}\n}\n\n\\frenchbsetup{StandardItemLabels=true} % bullets pour les items\n\\newcommand{\\D}{\\mathcal{D}}\n\\newcommand{\\R}{\\mathbb{R}}\n\\begin{document}\n\\raggedcolumns\n\\begin{multicols}{2}\n';

	var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var recursive_fct = function(el, index){
		if (_.isArray(el)){
			_.each(el,recursive_fct);
		} else if((typeof el == "object")&&(el!==null)){
			switch (el.type){
				case "multicols" : ;
__p += '\n\\begin{multicols}{' +
__e( el.cols ) +
'}\n';
					_.each(el.children,recursive_fct); ;
__p += '\n\\end{multicols}\n';
					break;
				case "tableau": ;
__p += '\n\\begin{center}\n\\begin{tabular}{' +
((__t = ( el.setup )) == null ? '' : __t) +
'}\n\\hline ';

_.each(el.lignes, function(row){;
__p += '\n\t' +
((__t = ( row.join(" & ") )) == null ? '' : __t) +
'\\\\\n\t\\hline\n';
}); ;
__p += '\\end{tabular}\n\\end{center}\n';
					break;
				case "tikz":;
__p += '\n\\begin{center}\n\\begin{tikzpicture}[scale=';
 if (el.scale){ ;
__p +=
__e( el.scale );
 } else { ;
__p += '1';
 } ;
__p += ', >=stealth]';

if (el.index) { ;
__p += '\n\\draw (' +
__e( el.left ) +
',' +
__e( el.top ) +
') node[below right,color=white,fill=black]{\\textbf{' +
__e( el.index ) +
' }};';
 } ;
__p += '\n\\draw [color=black, line width=.1pt] (' +
__e( el.left ) +
' , ' +
__e( el.top ) +
') grid[step=';
 if(el.step){;
__p +=
__e(el.step );
 } else { ;
__p += '1';
 } ;
__p += '] (' +
__e( el.right ) +
', ' +
__e( el.top ) +
');\n';
 if (el.axes){ ;
__p += '\\draw[line width=1pt] (0,0) node[below left, fill=white]{$O$} (' +
__e( el.axes[0] ) +
',-2pt) node[below, fill=white]{\\np{' +
__e( el.axes[0] ) +
'}} --++(0,4pt) (-2pt,' +
__e( el.axes[1] ) +
') node[left, fill=white]{\\np{' +
__e( el.axes[1] ) +
'}}--++(4pt,0);\n\\draw[line width=1.5pt](' +
__e( el.left ) +
',0)--(' +
__e( el.right ) +
',0) (0,' +
__e( el.bottom ) +
')--(0,' +
__e( el.top ) +
');\n';
 }
if (el.Ouv){ ;
__p += '\\draw[line width=1pt] (0,0) node[below left, fill=white]{$O$} (.5,0) node[below, fill=white]{\\vec{u}} (0,.5) node[left, fill=white]{\\vec{v}}\n\\draw[line width=1.5pt, <->](0,1)|-(1,0);\n';
 }
if (el.courbes) {;
__p += '\n\\begin{scope}\n\\clip (' +
__e( el.left ) +
',' +
__e( el.bottom ) +
') rectangle (' +
__e( el.right ) +
', ' +
__e( el.top ) +
');\n';
 _.each(el.courbes, function(itCourbe){
;
__p += '\t\\draw[line width=2pt, color=';
 if (itCourbe.color) { ;
__p +=
__e( itCourbe.color );
 } else { ;
__p += 'black';
 } ;
__p += ' ] plot[smooth, domain=' +
__e( itCourbe.left | el.left ) +
':' +
__e( itCourbe.right | el.right ) +
'](\\x,{' +
__e( itCourbe.expression ) +
'});\n';
 });
;
__p += '\\end{scope}';
 } ;
__p += '\n\\end{tikzpicture}\n\\end{center}\n';
					break;
				case "enumerate": ;
__p += '\n\\begin{enumerate}';
if (el.enumi){;
__p += '[' +
__e(el.enumi ) +
']';
 } else {;
__p += '[1)]';
 } ;
__p += '\n';
 _.each(el.children, function(it, index){ ;
__p += '\\item ';
recursive_fct(it, index); }); ;
__p += '\n\\end{enumerate}\n';
			}
		} else if (typeof el == "string") { ;
__p += '\n' +
((__t = ( el )) == null ? '' : __t) +
'\n';
		}
	}

	var fct = function(item){ ;
__p += '\n\n\\exercice{' +
__e(item.title) +
'}\n\n';
 if (item.message) {;
__p +=
__e( item.message ) +
'\n';
 }
		_.each(item.children, recursive_fct);
	}

	_.each(exercices, fct);
;
__p += '\n\\end{multicols}\n\\end{document}\n';

}
return __p
};

this["JST"]["devoirs/exam/exam-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="card">\n\t<div class="card-header text-white bg-primary">\n\t\t<h3>\n\t\t\t' +
__e( nom ) +
' &nbsp;\n\t\t\t<div class="btn-group" role="group">\n';
 if (locked) {;
__p += '\n\t\t\t\t<button type="button" class="btn btn-danger js-lock"><i class="fa fa-3 fa-lock" title="Déverouiller"></i></button>\n';
 } else { ;
__p += '\n\t\t\t\t<button type="button" class="btn btn-success js-lock"><i class="fa fa-3 fa-unlock" title="Vérouiller"></i></button>\n';
 } ;
__p += '\n\t\t\t\t<button type="button" class="btn btn-warning js-tex"><i class="fa fa-3 fa-font" title="Tex"></i></button>\n\t\t\t</div>\n\t\t</h3>\n\t</div>\n</div>\n\n<div id="exam-tex"></div>\n\n<div id="exam-collection"></div>\n\n<div id="exam-pied"></div>\n';

}
return __p
};

this["JST"]["devoirs/exam/exercice-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="card">\n\t<div class="card-header">';
 if (unique && !locked) { ;
__p += '<button type="button" class="btn btn-dark js-refresh" index="0"><i class="fa fa-refresh"></i></button> &nbsp; ';
 } ;
__p += ' ' +
__e( title ) +
'</div>\n\n\t';
 if (message) { ;
__p += '\n\t<div class="card-body bg-warning">\n\t' +
__e( message ) +
'\n\t</div>\n\t';
 } ;
__p += '\n\n';

	var item_count = 0;
	var enumi = {
		A:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		a:"abcdefghijklmnopqrstuvwxyz",
		"1":"123456789",
		"I":["I","II","III","IV","V","VI","VII","VIII","IX"],
		"i":["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]
	}

	var fct_recursive = function(el,index){
		if (typeof el == "string"){
;
__p +=
((__t = ( el )) == null ? '' : __t) +
'\n';
		} else if((typeof el == "object")&&(el!==null)){
			switch (el.type){
				case "subtitles":
					_.each(el.children,function(sub_el, sub_index){
;
__p += '<div class="card-body">\n\t<p class="card-text">';
 if ((!locked)&&(el.refresh)) {;
__p += '<button type="button" class="btn btn-dark js-refresh" index="' +
__e( sub_index ) +
'"><i class="fa fa-refresh"></i></button> &nbsp; ';
 } ;

 if(el.enumi){ ;
__p +=
__e( enumi[el.enumi][sub_index] ) +
') ';
 } ;
__p +=
__e( el.title || "" ) +
'' +
__e( sub_el.title || "" ) +
'</p>\n</div>\n';
						_.each(sub_el.children, fct_recursive);
					});
					break;
				case "2cols":
;
__p += '<div class="row"><div class="col-6">\n';
					fct_recursive(el.col1,index); ;
__p += '\n</div><div class="col-6">\n';
					fct_recursive(el.col2,index); ;
__p += '\n</div></div>\n';
					break;
				case "text":
;
__p += '<div class="card-body">\n';
 _.each(el.children,function(p){ ;
__p += '<p class="card-text">' +
((__t = ( p )) == null ? '' : __t) +
'</p>';
 }); ;
__p += '\n</div>\n';

					break;
				case "enumerate":
;
__p += '<ul class="list-group list-group-flush">\n\t';
 _.each(el.children,function(sub_el, sub_index){ ;
__p += '\n\t\t<li class="list-group-item">';
 if ((!locked)&&(el.refresh)){ ;
__p += '<button type="button" class="btn btn-dark js-refresh" index="' +
__e( sub_index ) +
'"><i class="fa fa-refresh"></i></button> &nbsp; ';
 } ;

 if(el.enumi){ ;
__p +=
__e( enumi[el.enumi][sub_index] ) +
') ';
 } fct_recursive(sub_el,sub_index); ;
__p += '</li>\n\t';
 }) ;
__p += '\n</ul>\n';

					break;
				case "graphique":
;
__p += '<div id="' +
__e( el.divId ) +
'" class="jxgbox" style="width:100%; height:10px;"></div>\n';

					break;
				case "tableau":
;
__p += '<div class="table-responsive">\n\t<table class="table table-bordered">\n';
					if (el.entetes) { ;
__p += '\n\t\t<thead class="thead-dark"><tr>\n';
						_.each(el.entetes, function(entete_item){ ;
__p += '\n\t\t\t<th>' +
__e( entete_item ) +
'</th>\n';
						}) ;
__p += '\n\t\t</tr></thead>\n';
					}
					if (el.lignes) { ;
__p += '\n\t\t<tbody>\n';
						_.each(el.lignes, function(ligne_item){ ;
__p += '\n\t\t\t<tr>\n';
							_.each(ligne_item, function(cell_item){ ;
__p += '\n\t\t\t\t<td>' +
__e( cell_item ) +
'</td>\n';
							}) ;
__p += '\n\t\t\t</tr>\n';
						}) ;
__p += '\n\t\t</tbody>\n';
					} ;
__p += '\n</table>\n</div>\n';

					break;
			}
		}
	}

	_.each(children, fct_recursive);
;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["devoirs/exam/tex-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="card-body">\n\t<h5 class="card-title">Tex</h5>\n\t<div class="form-group">\n\t\t<textarea class="form-control" rows="20">' +
((__t = ( tex )) == null ? '' : __t) +
'</textarea>\n\t</div>\n\t<button type="button" class="btn btn-primary js-close-tex">Fermer</button>\n</div>\n';

}
return __p
};

this["JST"]["devoirs/faits/faits-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( date ) +
'</td> <!-- à parser -->\n<td>' +
__e( note ) +
'</td>\n<td>';
 if(finished){ ;
__p += '\n\t<i class="fa fa-check-square-o"></i>\n';
 } else { ;
__p += '\n\t<i class="fa fa-square-o"></i>\n';
 } ;
__p += '\n</td>\n';
 if (showDeleteButton) { ;
__p += '\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t</div>\n</td>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["devoirs/faits/faits-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th>#</th>\n\t\t<th><i class="fa fa-clock-o"></i></th>\n\t\t<th>Note</th>\n\t\t<th><i class="fa fa-flag-checkered"></i></th>\n\t\t';
 if (showDeleteButton) { ;
__p += '\n\t\t<th width="170px"></th><!-- bouton de suppression -->\n\t\t';
 } ;
__p += '\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["devoirs/faits/faits-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="5">Aucun exercice à afficher.</td>\n';

}
return __p
};

this["JST"]["devoirs/list/devoir-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nom ) +
'</td>\n<td>' +
__e( nomOwner ) +
'</td>\n<td>' +
__e( date ) +
'</td> <!-- à parser -->\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton d\'activation -->\n\t';
 if (actif) { ;
__p += '\n\t\t<button type="button" class="btn btn-success btn-sm js-actif"><i class="fa fa-check-circle-o" title="Désactiver"></i></button>\n\t';
 } else { ;
__p += '\n\t\t<button type="button" class="btn btn-danger btn-sm js-actif"><i class="fa fa-ban" title="Activer"></i></button>\n\t';
 } ;
__p += '\n\t\t<!-- Bouton visible / invisible -->\n\t';
 if (visible) { ;
__p += '\n\t\t<button type="button" class="btn btn-success btn-sm js-visible"><i class="fa fa-eye" title="Rendre invisible"></i></button>\n\t';
 } else { ;
__p += '\n\t\t<button type="button" class="btn btn-danger btn-sm js-visible"><i class="fa fa-eye-slash" title="Rendre visible"></i></button>\n\t';
 } ;
__p += '\n\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t</div>\n</td>\n';

}
return __p
};

this["JST"]["devoirs/list/devoir-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="5">Aucun devoir à afficher.</td>\n';

}
return __p
};

this["JST"]["devoirs/list/devoir-list-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary js-new" type="button">Nouveau devoir <i class="fa fa-pencil-square-o"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["devoirs/list/devoir-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th><a href="" class="js-sort" name="id">#</a></th>\n\t\t<th><a href="" class="js-sort" name="nom">Nom</a></th>\n\t\t<th><a href="" class="js-sort" name="nomOwner">Professeur</a></th>\n\t\t<th><a href="" class="js-sort" name="date"><i class="fa fa-clock-o" aria-hidden="true"></i></a></th>\n\t\t<th width="170px"></th><!-- bouton visible/invisible|bouton actif/inactif|lien vers liste aUF|bouton d\'édition|bouton de suppression -->\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["devoirs/run/devoir-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
__e( nomFiche ) +
'</h2>\n\n<p>' +
__e( description ) +
'</p>\n\n';
 if (!actif) { ;
__p += '\n<div class="alert alert-warning" role="alert">\n<h4 class="alert-heading"><i class="fa fa-exclamation-circle fa-lg"></i> Ce devoir est verrouillé</h4>\n';
 if (!profMode) { ;
__p += '<p>Vous pouvez continuer mais vos essais ne seront ni enregistrés ni comptabilisés dans la note.</p>';
 } ;
__p += '\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["devoirs/run/exercice-list-item-eleve"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="justify-content-between">\n<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( numero ) +
'</span> ' +
__e( title ) +
' &emsp; <small><span title="Répéter ' +
__e( num ) +
' fois"><i class="fa fa-repeat"></i>&nbsp; ' +
__e( num ) +
'</span> | <span title="Coefficient ' +
__e( coeff ) +
'"><i class="fa fa-balance-scale"></i></span>' +
__e( coeff ) +
'</small></h5>\n\n<div class="row">\n<div class="col">\n<p class="mb-1">' +
__e( description ) +
'</p>\n';
 if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ ;
__p += '\n<p>' +
__e( value.tag ) +
' : ' +
__e( value.options[value.value] ) +
'</p>\n\t';
 });
} ;
__p += '\n</div>\n<div class="col-2 align-self-end align-top">\n<a href="#" class="btn btn-success btn-lg js-faits" role="button" title="Voir les essais sauvegardés">' +
__e( note ) +
'&nbsp;%</a>\n</div>\n</div>\n';
 if(n_faits< num) {;
__p += '\n<p class="text-danger">Vous devez encore faire cet exercice <b>' +
__e( num-n_faits ) +
' fois</b>.</p>\n';
 } else { ;
__p += '\n<p class="text-success"><a href="#" class="js-faits" title="Voir les exercices sauvegardés">Vous avez répété cet exercice <b>' +
__e( n_faits ) +
' fois</b>.</a> Vous pouvez continuer pour améliorer votre note.</p>\n';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["devoirs/run/exercice-list-item-prof"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="justify-content-between">\n<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( numero ) +
'</span> ' +
__e( title ) +
' &emsp; <small><span title="Fait ' +
__e( n_faits ) +
' fois sur ' +
__e( num ) +
' fois"><i class="fa fa-repeat"></i>&nbsp;<span class="';
 if(n_faits< num) {;
__p += 'text-danger';
 } else { ;
__p += 'text-success';
 } ;
__p += '">' +
__e( n_faits ) +
'</span> / </span> ' +
__e( num ) +
'</span> | <span title="Coefficient ' +
__e( coeff ) +
'"><i class="fa fa-balance-scale"></i></span>' +
__e( coeff ) +
'</small></h5>\n\n<div class="row">\n<div class="col">\n<p class="mb-1">' +
__e( description ) +
'</p>\n';
 if (!_.isEmpty(options)) {
	_.each(options,function(value, key, list){ ;
__p += '\n<p>' +
__e( value.tag ) +
' : ' +
__e( value.options[value.value] ) +
'</p>\n\t';
 });
} ;
__p += '\n</div>\n<div class="col-2 align-self-end align-top">\n<h2><span class="badge badge-success">' +
__e( note ) +
'&nbsp;%</span></h2>\n</div>\n</div>\n</div>\n';

}
return __p
};

this["JST"]["devoirs/run/exercice-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5>Aucun exercice à afficher</h5>\n';

}
return __p
};

this["JST"]["devoirs/run/note-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Votre note pour ce devoir : ' +
__e( note ) +
'\n';

}
return __p
};

this["JST"]["devoirs/run/run-layout"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="devoir-params-region"></div>\n<br>\n<div id="exercices-region"></div>\n<br>\n<div id="note-region"></div>\n<br>\n\n';

}
return __p
};

this["JST"]["exercices/common/brique-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 switch(type) { case "text" : ;
__p += '\n\t';
 _(ps).each(function(p){ ;
__p += '\n<p class="card-text">' +
((__t = ( p )) == null ? '' : __t) +
'</p>\n\t';
 }) ;
__p += '\n\n';
 break; case "ul": ;
__p += '\n<ul class="list-group list-group-flush">\n';
 _.each(list,function(item){ ;
__p += '\n\t';
 switch(item.type) { case "success" : ;
__p += '\n\t<li class="list-group-item list-group-item-success">' +
((__t = ( item.text )) == null ? '' : __t) +
'</li>\n\t';
 break; case "error": ;
__p += '\n\t<li class="list-group-item list-group-item-danger">' +
((__t = ( item.text )) == null ? '' : __t) +
'</li>\n\t';
 break; case "warning": ;
__p += '\n\t<li class="list-group-item list-group-item-warning">' +
((__t = ( item.text )) == null ? '' : __t) +
'</li>\n\t';
 break; case "info": ;
__p += '\n\t<li class="list-group-item list-group-item-info">' +
((__t = ( item.text )) == null ? '' : __t) +
'</li>\n\t';
 break; default: ;
__p += '\n\t<li class="list-group-item list-group-item-primary">' +
((__t = ( item.text )) == null ? '' : __t) +
'</li>\n\t';
 } ;
__p += '\n';
 }) ;
__p += '\n</ul>\n\n';
 break; case "tableau": ;
__p += '\n<div class="table-responsive">\n<table class="table table-bordered">\n\t';
 if (entetes) { ;
__p += '\n\t<thead class="thead-dark">\n\t\t<tr>\n\t\t';
 _.each(entetes, function(entete_item){ ;
__p += '\n\t\t\t<th>' +
__e( entete_item ) +
'</th>\n\t\t';
 }) ;
__p += '\n\t\t</tr>\n\t</thead>\n\t';
 } ;
__p += '\n\t';
 if (lignes) { ;
__p += '\n\t<tbody>\n\t\t';
 _.each(lignes, function(ligne_item){ ;
__p += '\n\t\t<tr>\n\t\t\t';
 _.each(ligne_item, function(cell_item){ ;
__p += '\n\t\t\t\t<td>' +
__e( cell_item ) +
'</td>\n\t\t\t';
 }) ;
__p += '\n\t\t</tr>\n\t\t';
 }) ;
__p += '\n\t</tbody>\n\t';
 } ;
__p += '\n</table>\n</div>\n\n';
 break; case "aide": ;
__p += '\n<ul class="list-group list-group-flush js-liste-aide" style="display:none;">\n';
 _.each(list,function(item){ ;
__p += '\n\t<li class="list-group-item list-group-item-info">' +
((__t = ( item )) == null ? '' : __t) +
'</li>\n';
 }) ;
__p += '\n</ul>\n\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["exercices/common/brique-latex-input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group row">\n\t<label for="exo-' +
__e( name ) +
'" class="col-sm-2 col-form-label">' +
__e( tag ) +
'</label>\n\t<div class="col-sm-10">\n\t\t<span class="js-mathquill" style="width:95%;"></span>\n\t\t<input type="hidden" id="exo-' +
__e( name ) +
'" name="' +
__e( name ) +
'" value="">\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/brique-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="card">\n\n';
 if (title) { ;
__p += '\n\t<div class="card-header">' +
__e( title ) +
'</div>\n';
 } ;
__p += '\n\n';
 if(needForm) { ;
__p += '\n\t<form>\n\t\t<div class="js-items" ></div>\n\t</form>\n';
 } else { ;
__p += '\n\t<div class="js-items"></div>\n';
 } ;
__p += '\n\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/color-choice-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="list-group">\n';
 _.each(list,function(item,index){ ;
__p += '\n\t<a href="#" class="list-group-item list-group-item-action" index=' +
__e( index ) +
' ><i class="fa fa-square fa-2x"></i> &nbsp; ' +
((__t = ( item.text )) == null ? '' : __t) +
'</a>\n';
 });
var stringDefault = _.map(list, function(item){ return -1 }).join(';');
;
__p += '\n<input type="hidden" name="' +
__e( name ) +
'" value="' +
__e( stringDefault ) +
'">\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/color-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="list-group">\n';
 _.each(list,function(item){ ;
__p += '\n\t';
 switch(item.type) { case "success" : ;
__p += '\n\t<li class="list-group-item list-group-item-success"><i class="fa fa-check-square fa-2x" style="color:' +
__e( item.color ) +
'"></i> &nbsp; ' +
((__t = ( item.text )) == null ? '' : __t);
 if(item.secondColor) { ;
__p += ' &nbsp; <i class="fa fa-square fa-2x" style="color:' +
__e( item.secondColor ) +
'"></i>';
 } ;
__p += '</li>\n\t';
 break; case "error": ;
__p += '\n\t<li class="list-group-item list-group-item-danger"><i class="fa fa-times-rectangle fa-2x" style="color:' +
__e( item.color ) +
'"></i> &nbsp; ' +
((__t = ( item.text )) == null ? '' : __t);
 if(item.secondColor) { ;
__p += ' &nbsp; <i class="fa fa-square fa-2x" style="color:' +
__e( item.secondColor ) +
'"></i>';
 } ;
__p += '</li>\n\t';
 break; default: ;
__p += '\n\t<li class="list-group-item list-group-item-primary"><i class="fa fa-square fa-2x" style="color:' +
__e( item.color ) +
'"></i> &nbsp; ' +
((__t = ( item.text )) == null ? '' : __t);
 if(item.secondColor) { ;
__p += ' &nbsp; <i class="fa fa-square fa-2x" style="color:' +
__e( item.secondColor ) +
'"></i>';
 } ;
__p += '</li>\n\t';
 } ;
__p += '\n';
 }) ;
__p += '\n</ul>\n';

}
return __p
};

this["JST"]["exercices/common/input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="form-group row">\n\t';
 if (typeof format == "undefined") { // format de base ;
__p += '\n\t<label class="col-sm-2 col-form-label">' +
__e( tag ) +
'</label>\n\t<div class="col-sm-10">\n\t\t<input type="text" class="form-control" id="exo-' +
__e( name ) +
'" name="' +
__e( name ) +
'" ';
 if (typeof description != "undefined") { ;
__p += ' placeholder="' +
__e( description ) +
'" ';
 } ;
__p += ' value="">\n\t</div>\n\t';
 } else {
		// format est un tableau d'objets { cols, name, class, text, latex }
		_.each(format, function(item){ ;
__p += '\n\t<div class="col-sm-' +
__e( item.cols ) +
' ' +
__e( item.class ) +
'">';

			if (item.name) {
				if (item.latex) { ;
__p += '\n\t\t<span class="js-mathquill" id="mq-exo-' +
__e( item.name ) +
'" style="width:100%;"></span>\n\t\t<input type="hidden" id="exo-' +
__e( item.name ) +
'" name="' +
__e( item.name ) +
'" value="" ';
 if(item.description) { ;
__p += ' placeholder="' +
__e( item.description ) +
'" ';
 } ;
__p += ' >\n\t\t\t\t';
 } else { ;
__p += '\n\t\t<input type="text" class="form-control" id="exo-' +
__e( item.name ) +
'" name="' +
__e( item.name ) +
'" value="">\n\t\t\t\t';
 }
			} else { ;
__p += '\n\t\t' +
((__t = ( item.text )) == null ? '' : __t) +
'\n\t\t\t';
 }
	;
__p += '</div>';

		});
	} ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/jsxgraph-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="' +
__e( divId ) +
'" class="jxgbox" style="width:100%; height:10px;"></div>\n';

}
return __p
};

this["JST"]["exercices/common/missing-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="card-body">\n\t<p class="card-text">Cettre brique n\'est pas définie.</p>\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/multi-input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="form-group row">\n\t<label class="col-sm-2 col-form-label">' +
__e( tag ) +
'</label>\n\t';
 _.each(format, function(item){ ;
__p += '\n\t<div class="col-sm-' +
__e( item.cols ) +
' ' +
__e( item.class ) +
'">';

		if (item.name) { ;
__p += '\n\t\t<input type="text" class="form-control" id="exo-' +
__e( item.name ) +
'" name="' +
__e( item.name ) +
'" value="">\n\t\t';
 } else { ;
__p += '\n\t\t<span>' +
__e( item.text ) +
'</span>\n\t\t';
 }
	;
__p += '</div>';

	}); ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["exercices/common/pied"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (finished) { ;
__p += '\n<div class="card text-white bg-success">\n<p class="card-text">L\'exercice est terminé. Votre note est : <b>' +
__e( note ) +
'/100</b>.</p>\n</div>\n';
 } else { ;
__p += '\n<div class="card text-white bg-danger">\n<p class="card-text">L\'exercice n\'est pas terminé.</p>\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["exercices/common/radio"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(radio,function(subItem,key){
	var radio_id = ""+Math.random()
;
__p += '\n<div class="form-check">\n\t<input class="form-check-input" type="radio" id="radio' +
__e( radio_id ) +
'" name="' +
__e( name ) +
'" value="' +
__e( key ) +
'" ';
 if (key==0){ ;
__p += 'checked';
 } ;
__p += ' >\n\t<label class="form-check-label" for="radio' +
__e( radio_id ) +
'">\n\t\t' +
__e( subItem ) +
'\n\t</label>\n</div>\n';
 }) ;
__p += '\n';

}
return __p
};

this["JST"]["exercices/common/validation-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="btn-group" role"group">\n';
 if (typeof clavier != "undefined") {
	_(clavier).each( function(subitem){
		switch(subitem) { case "aide" : ;
__p += '\n\t<button class="btn btn-info js-clavier" type="button" title="Aide" name="aide" ><i class="fa fa-question-circle-o"></i></button>\n\t\t';
 break; case "infini": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Infini" name="infini">$\\infty$</button>\n\t\t';
 break; case "sqrt": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Racine carrée" name="sqrt">$\\sqrt{x}$</button>\n\t\t';
 break; case "pow": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Puissance" name="pow">$x^y$</button>\n\t\t';
 break; case "pi": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Pi" name="pi">$\\pi$</button>\n\t\t';
 break; case "sqr": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Carré" name="sqr">$\\x^2$</button>\n\t\t';
 break; case "empty": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Ensemble vide" name="empty">$\\varnothing$</button>\n\t\t';
 break; case "union": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Union" name="union">$\\cup$</button>\n\t\t';
 break; case "intersection": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Intersection" name="intersection">$\\cap$</button>\n\t\t';
 break; case "reels": ;
__p += '\n\t<button class="btn btn-default js-clavier" type="button" title="Ensemble des réels" name="reels">$\\mathbb{R}$</button>\n\t\t';
 }
	})
} ;
__p += '\n\t<button type="submit" class="btn btn-default js-submit">Valider</button>\n</div>\n';

}
return __p
};

this["JST"]["exercices/list/exercice-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span> ' +
__e( title ) +
'</h5>\n<p class="list-group-item-text">' +
__e( description ) +
'</p>\n';

}
return __p
};

this["JST"]["exercices/list/exercice-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5>Aucun exercice à afficher</h5>\n';

}
return __p
};

this["JST"]["exercices/list/exercice-list-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<input type="text" class="form-control search-query js-filter-criterion" placeholder="Filtrer..." value="' +
__e( filterCriterion ) +
'">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary" type="submit"><i class="fa fa-search"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["exercices/show/answers-view-prof"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form>\n';
 _.each(answers, function(value, key){ ;
__p += '\n\t<div class="form-group row">\n\t\t<label for="aItem_' +
__e( key ) +
'" class="col-3 col-form-label">' +
__e( key ) +
'</label>\n\t\t<div class="col-8">\n\t\t\t<input type="text" class="form-control" id="aItem_' +
__e( key ) +
'" name="' +
__e( key ) +
'" value="' +
__e( value ) +
'">\n\t\t</div>\n\t</div>\n';
 }); ;
__p += '\n\t<button type="button" class="btn btn-danger js-cancel">Annuler</button> <button type="submit" class="btn btn-default js-submit">Valider</button>\n</form>\n';

}
return __p
};

this["JST"]["exercices/show/options-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="card-header text-white bg-warning"><h4>Options</h4></div>\n\n<div class="card-block">\n\t<form>\n';
 _.each(optionsItems, function(item, index){ ;
__p += '\n\t\t<div class="form-group row">\n\t\t\t<label for="optionItem_' +
__e( index ) +
'" class="col-3 col-form-label">' +
__e( item.tag ) +
'</label>\n\t\t\t<div class="col-8">\n\t\t\t\t<select class="form-control" id="optionItem_' +
__e( index ) +
'" name="' +
__e( item.key ) +
'">\n\t';
 _.each(item.options, function(itemChoice, indexChoice){ ;
__p += '\n\t\t\t\t\t<option value="' +
__e( indexChoice ) +
'" ';
 if(indexChoice==item.value) { ;
__p += 'selected';
 } ;
__p += ' >' +
__e( itemChoice ) +
'</option>\n\t';
 }); ;
__p += '\n\t\t\t\t</select>\n\t\t\t</div>\n\t\t</div>\n';
 }); ;
__p += '\n\t\t<button type="submit" class="btn btn-default js-submit">Valider</button>\n\t</form>\n</div>\n';

}
return __p
};

this["JST"]["exercices/show/show-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="card">\n<div class="card-header text-white bg-primary"><h3>' +
__e( title ) +
' ';
 if (showReinitButton){ ;
__p += '<button type="button" class="js-reinit btn btn-sm" title="Réinitialiser"><i class="fa fa-refresh"></i></button>';
 } ;
__p += ' ';
 if (!_.isEmpty(options) && showOptionsButton){ ;
__p += ' <button type="button" class="js-options btn btn-sm" title="Options"><i class="fa fa-cog"></i></button> ';
 } ;
__p += ' ';
 if (showAnswersButton){ ;
__p += '<button type="button" class="js-answers btn btn-sm" title="Réponses utilisateur"><i class="fa fa-question"></i></button>';
 } ;
__p += '</h3></div>\n</div>\n\n<div id="options"></div>\n\n<div id="collection"></div>\n\n<div id="exercice-pied"></div>\n';

}
return __p
};

this["JST"]["header/show/header-navbar"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<nav class="navbar navbar-dark bg-primary">\n\t<a class="navbar-brand js-home" href="#Home">Exercices de maths &nbsp; <span class="js-spinner"></span></a>\n\t<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">\n\t\t<span class="navbar-toggler-icon"></span>\n\t</button>\n\n\t<div class="collapse navbar-collapse" id="navbarSupportedContent">\n\t\t';
 if (isOff) { ;
__p += '\n\t\t\t<ul class="navbar-nav">\n\t\t\t\t<li class="nav-item"><a class="nav-link js-login" href="#login"><i class="fa fa-sign-in" aria-hidden="true"></i> Connexion</a></li>\n\t\t\t</ul>\n\t\t';
};
__p += '\n\t\t';
 if (isAdmin) { ;
__p += '\n\t\t\t<ul class="navbar-nav">\n\t\t\t\t<li class="nav-item"><a class="nav-link js-logout" href="#logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Déconnexion</a></li>\n\t\t\t\t<li class="nav-item dropdown">\n\t\t\t\t\t<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >\n\t\t\t\t\t' +
__e( nomComplet ) +
'\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class="dropdown-menu">\n\t\t\t\t\t\t<a class="dropdown-item js-users" href="#Comptes"><i class="fa fa-users" aria-hidden="true"></i> Voir les utilisateurs</a>\n\t\t\t\t\t\t<div class="dropdown-divider"></div>\n\t\t\t\t\t\t<a class="dropdown-item js-edit-me" href="#edit-me"><i class="fa fa-user" aria-hidden="true"></i> Mon compte</a>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t';
};
__p += '\n\t\t';
 if (isEleve) { ;
__p += '\n\t\t\t<ul class="navbar-nav">\n\t\t\t\t<li class="nav-item"></li>\n\t\t\t\t<li class="nav-item dropdown">\n\t\t\t\t\t<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >\n\t\t\t\t\t' +
__e( nomComplet ) +
'\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class="dropdown-menu">\n\t\t\t\t\t\t<a class="dropdown-item js-logout" href="#logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Déconnexion</a>\n\t\t\t\t\t\t<div class="dropdown-divider"></div>\n\t\t\t\t\t\t<a class="dropdown-item js-edit-me" href="#edit-me"><i class="fa fa-user" aria-hidden="true"></i> Mon compte</a>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t';
};
__p += '\n\t</div>\n</nav>\n';

}
return __p
};

this["JST"]["home/login/home-login"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="card">\n\t<div class="card-header">\n\t\tConnexion\n\t</div>\n\t<div class="card-body">\n\t\t<form>\n\t\t\t<div class="form-group row">\n\t\t\t\t<label for="user-identifiant" class="col-form-label col-sm-3">Email</label>\n\t\t\t\t<div class="col-sm-9">\n\t\t\t\t\t<input type="email" class="form-control" name="identifiant" id="user-identifiant" placeholder="Entrez un email" value="">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="form-group row">\n\t\t\t\t<label for="user-pwd" class="col-form-label col-sm-3">Mot de passe</label>\n\t\t\t\t<div class="col-sm-9">\n\t\t\t\t\t<input type="password" class="form-control" name="pwd" id="user-pwd" placeholder="Entrez un mot de passe">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<button type="submit" class="btn btn-primary js-submit">Valider</button>\n\t\t\t<button class="btn btn-warning js-forgotten">Mot de passe oublié</button>\n\t\t\t<div id="messages"></div>\n\t\t</form>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["home/show/devoirs-list-eleve-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="container">\n\t<div class="row">\n\t\t<div class="col">\n<h5 class="list-group-item-heading"><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span> ' +
__e( nomFiche ) +
'</h5>\n' +
__e( description ) +
'\n\t\t</div>\n\t\t<div class="col-3">\n';
 if (actif) { ;
__p += '\n\t<h3><span class="badge badge-success">Note : ' +
__e( note ) +
'</span></h3>\n';
 } else { ;
__p += '\n\t<h3><span class="badge badge-danger">Note : ' +
__e( note ) +
'</span></h3>\n';
 } ;
__p += '\n\t\t</div>\n\t</div>\n</div>\n\n';
 if (!actif) { ;
__p += '<small><i class="fa fa-exclamation-circle fa-lg"></i> Ce devoir est verrouillé. Vous pouvez continuer à faire des exercices mais ils ne seront pas enregistrés.</small>';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["home/show/devoirs-list-eleve-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5>Aucun devoir à afficher</h5>\n';

}
return __p
};

this["JST"]["home/show/eleve-view-layout"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h5>Vos devoirs</h5>\n<div id="devoirs-region"></div>\n<div id="unfinished-region"></div>\n';

}
return __p
};

this["JST"]["home/show/home-admin"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron">\n\t<h1>Bienvenue !</h1>\n\n\t<p>Vous êtes administrateur du site. Vous pouvez exécuter une des commandes suivantes :</p>\n\n\t<div class="list-group">\n\t<a type="button" class="list-group-item list-group-item-action disabled" href="#Connexions"><i class="fa fa-sign-in" aria-hidden="true"></i> Connexions</a>\n\n\t<a type="button" class="list-group-item list-group-item-action js-users" href="#users"><i class="fa fa-users" aria-hidden="true"></i> Voir les utilisateurs</a>\n\n\t<a type="button" class="list-group-item list-group-item-action js-classes" href="#classes"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Voir les classes</a>\n\n\t<a type="button" class="list-group-item list-group-item-action js-exercices" href="#exercices"><i class="fa fa-files-o" aria-hidden="true"></i> Voir les exercices</a>\n\n\t<a type="button" class="list-group-item list-group-item-action js-devoirs" href="#Devoirs"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Voir les devoirs</a>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["home/show/home-forgotten-key"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron">\n\t<h1>Bienvenue !</h1>\n\t<p>Vous êtes maintenant connecté(e).</p>\n\t<hr class="my-4">\n\t<p> <a class="btn btn-danger btn-lg js-reinit-mdp" href="#" role="button">Réinitialisez votre mot de passe !</a></p>\n</div>\n';

}
return __p
};

this["JST"]["home/show/home-off"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron">\n\t<h1>Bienvenue !</h1>\n\t<p>Ce site propose des exercices de mathématiques générés automatiquement afin de vous entraîner et de vous aider à progresser. <a class="js-login" href="#login">Connexion</a></p>\n\t<hr class="my-4">\n\t<p>Vous n\'avez pas encore de compte ? <a class="btn btn-primary btn-lg js-join" href="#rejoindre-une-classe" role="button">Inscrivez-vous !</a></p>\n</div>\n\n<div class="alert alert-info" role="alert">Il y a parfois des problème d\'actualisation de la page et la connexion est alors impossible. Veillez à bien réactualiser. Sur PC, appuyez <b>CTRL+F5</b> ou <b>\t&#x2318; + R</b> sur Apple</div>\n';

}
return __p
};

this["JST"]["home/show/home-prof"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron">\n\t<h1>Bienvenue !</h1>\n\n\t<p>Vous êtes <b>professeur</b>. Vous pouvez exécuter une des commandes suivantes :</p>\n\n\t<div class="list-group">\n\t\t<a type="button" class="list-group-item list-group-item-action js-users" href="#users"><i class="fa fa-users" aria-hidden="true"></i> Voir vos élèves</a>\n\n\t\t<a type="button" class="list-group-item list-group-item-action js-classes" href="#classes"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Voir vos classes</a>\n\n\t\t<a type="button" class="list-group-item list-group-item-action js-devoirs" href="#Devoirs"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Voir vos devoirs</a>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["home/show/not-found"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron">\n\t<h1>Erreur 404 !</h1>\n\t<p>Cette page n\'existe pas !</p>\n</div>\n';

}
return __p
};

this["JST"]["home/show/unfinished-message"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Il vous reste ' +
__e( number ) +
' exercice(s) à terminer.\n';

}
return __p
};

this["JST"]["home/signin/signin-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4>' +
__e( nom ) +
'</h4>\n<p>' +
__e( description ) +
'</p>\n';

}
return __p
};

this["JST"]["home/signin/signin-noview"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="alert alert-primary" role="alert">\nAucune classe à rejoindre\n</div>\n';

}
return __p
};

this["JST"]["home/signin/test-mdp-form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n\tDonnez le mot de passe pour entrer dans la classe.\n\t<div class="form-group">\n\t\t<label for="signin-mdp" class="control-label">Mot de passe :</label>\n\t\t<input class="form-control" id="signin-mdp" name="mdp" type="text" value="" placeHolder="Mot de passe"/>\n\t</div>\n\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["users/common/user-form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form>\n\t<div class="form-group">\n\t\t<label for="user-prenom" class="control-label">Prénom :</label>\n\t\t<input class="form-control" id="user-prenom" name="prenom" type="text" value="' +
__e( prenom ) +
'" placeHolder="Prénom"/>\n\t</div>\n\t<div class="form-group">\n\t\t<label for="user-nom" class="control-label">Nom :</label>\n\t\t<input class="form-control" id="user-nom" name="nom" type="text" value="' +
__e( nom ) +
'" placeHolder="Nom"/>\n\t</div>\n\n\t';
 if (rank!="Root"){ ;
__p += '\n\t<div class="form-group">\n\t\t<label for="user-email" class="control-label">@ :</label>\n\t\t<input class="form-control" id="user-email" name="email" type="text" value="' +
__e( email ) +
'" placeHolder="email"/>\n\t</div>\n\t';
 } ;
__p += '\n\t';
 if (showPWD){ ;
__p += '\n\t\t<div class="form-group">\n\t\t<label for="user-pwd" class="control-label">Mot de passe :</label>\n\t\t<input class="form-control" id="user-pwd" name="pwd" type="password" value="" placeHolder="Mot de passe"/>\n\t</div>\n\t';
};
__p += '\n\n\t';
 if (ranks!==false){;
__p += '\n\t\t';
if (ranks==1) {;
__p += '\n\t\t\t<input name="rank" type="hidden" value=""/>\n\t\t';
} else {;
__p += '\n\t<div class="form-group">\n\t\t<label for="user-rank">Rang :</label>\n\t\t<select class="form-control" id="user-rank" name="rank">\n\t\t\t<option value="Prof">Professeur</option>\n\t\t\t<option value="Admin">Administrateur</option>\n\t\t</select>\n\t</div>\n\t\t';
};
__p += '\n\t';
};
__p += '\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["users/edit/userpwd-form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n\t<h2>' +
__e( prenom ) +
' ' +
__e( nom ) +
'</h2>\n\t<div class="form-group">\n\t\t<label for="user-pwd" class="control-label">Mot de passe :</label>\n\t\t<input class="form-control" id="user-pwd" name="pwd" type="password" value="" placeHolder="Mot de passe"/>\n\t</div>\n\t<div class="form-group">\n\t\t<label for="user-pwdConfirm" class="control-label">Confirmation :</label>\n\t\t<input class="form-control" id="user-pwdConfirm" name="pwdConfirm" type="password" value="" placeHolder="Confirmation"/>\n\t</div>\n\t<button class="btn btn-success js-submit">Enregistrer</button>\n</form>\n';

}
return __p
};

this["JST"]["users/list/user-list-item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td><span class="badge badge-pill badge-primary">' +
__e( id ) +
'</span></td>\n<td>' +
__e( nom ) +
' ' +
__e( prenom ) +
'</td>\n<td><a href="mailto:' +
__e( email ) +
'"><i class="fa fa-envelope" aria-hidden="true"></i></a></td>\n<td>' +
__e( nomClasse ) +
'</td>\n<td>' +
__e( date ) +
'</td> <!-- à parser -->\n<td>' +
__e( rank ) +
'</td>\n<td align="right">\n\t<div class="btn-group" role="group">\n\t\t<!-- Bouton d\'édition -->\n\t\t<a href="#user:' +
__e( id ) +
'/edit" class="btn btn-secondary btn-sm js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i></a>\n\t\t<!-- Bouton de mot de passe -->\n\t\t<a href="#user:' +
__e( id ) +
'/password" class="btn btn-secondary btn-sm js-editPwd" role="button"><i class="fa fa-key" title="Modifier"></i></a>\t\t<!-- Bouton suppression -->\n\t\t<button type="button" class="btn btn-danger btn-sm js-delete"><i class="fa fa-trash" aria-hidden="true" title="Supprimer"></i></button>\n\t\t<!-- Bouton mdp oublié -->\n\t\t<button type="button" class="btn btn-secondary btn-sm js-forgotten" data-toggle="tooltip" data-placement="top" title="Mot de passe oublié"><i class="fa fa-envelope" aria-hidden="true"></i></span></button>\n\t</div>\n</td>\n';

}
return __p
};

this["JST"]["users/list/user-list-none"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td colspan="7">Aucun utilisateur à afficher.</td>\n';

}
return __p
};

this["JST"]["users/list/user-list-panel"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form id="filter-form" class="form-search form-inline" style="margin-bottom: 10px;">\n\t<div class="input-group">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary js-new" type="button"><i class="fa fa-user-plus" aria-hidden="true"></i></button>\n\t\t</span>\n\t\t<input type="text" class="form-control search-query js-filter-criterion" placeholder="Filtrer..." value="' +
__e( filterCriterion ) +
'">\n\t\t<span class="input-group-btn">\n\t\t\t<button class="btn btn-primary" type="submit"><i class="fa fa-search"></i></button>\n\t\t</span>\n\t</div>\n</form>\n';

}
return __p
};

this["JST"]["users/list/user-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\n\t<tr>\n\t\t<th><a href="" class="js-sort" name="id">#</a></th>\n\t\t<th><a href="" class="js-sort" name="nomComplet">Nom</a></th>\n\t\t<th><i class="fa fa-envelope"></i></th>\n\t\t<th><a href="" class="js-sort" name="nomClasse"><i class="fa fa-graduation-cap" aria-hidden="true"></a></th>\n\t\t<th><a href="" class="js-sort" name="date"><i class="fa fa-clock-o" aria-hidden="true"></i></a></th>\n\t\t<th><a href="" class="js-sort" name="rank">Rang</a></th>\n\t\t<!-- boutons verrou|modification|suppression -->\n\t\t<th width="160"></th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n';

}
return __p
};

this["JST"]["users/show/show-user"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1>' +
__e( prenom ) +
' ' +
__e( nom ) +
'</h1>\n\n<p><strong>email :</strong> ' +
__e( email ) +
'</p>\n<p><strong>Classe :</strong> ' +
__e( nomClasse ) +
'</p>\n<p><strong>Rang :</strong> ' +
__e( rank ) +
'</p>\n\n<div class="btn-group" role="group">\n<a href="#user:' +
__e( id ) +
'/edit" class="btn btn-success js-edit" role="button"><i class="fa fa-pencil" title="Modifier"></i> Modifier</a>\n<a href="#user:' +
__e( id ) +
'/password" class="btn btn-success js-editPwd" role="button"><i class="fa fa-key" title="Mot de passe"></i> Modifier le mot de passe</a>\n</div>\n';

}
return __p
};