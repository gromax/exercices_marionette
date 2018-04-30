define(["marionette", "app", "apps/header/show/show_view"], function(Marionette, app, HeadersView) {
  var Controller;
  Controller = {
    showHeader: function() {
      var navbar;
      if (app.Auth) {
        navbar = new HeadersView();
        app.regions.getRegion('header').show(navbar);
        navbar.listenTo(app.Auth, "change", function() {
          return this.logChange();
        });
        return navbar.listenTo(app, "header:loading", navbar.spin);
      } else {
        return console.log("Erreur : Objet session non défini !");
      }
    }
  };
  return Controller;
});
