define(["marionette", "app", "jst"], function(Marionette, app, JST) {
  var Headers;
  Headers = Marionette.View.extend({
    template: window.JST["header/show/header-navbar"],
    triggers: {
      "click a.js-home": "home:show",
      "click a.js-edit-me": "home:editme",
      "click a.js-login": "home:login",
      "click a.js-logout": "home:logout",
      "click a.js-users": "users:list"
    },
    initialize: function(options) {
      var auth, ref, ref1, ref2, ref3, ref4;
      options = options != null ? options : {};
      auth = _.clone(app.Auth.attributes);
      this.isAdmin = (ref = auth.isAdmin) != null ? ref : false;
      this.isProf = (ref1 = auth.isProf) != null ? ref1 : false;
      this.isEleve = (ref2 = auth.isEleve) != null ? ref2 : false;
      this.isOff = (ref3 = auth.isOff) != null ? ref3 : false;
      return this.nomComplet = (ref4 = auth.nomComplet) != null ? ref4 : "Déconnecté";
    },
    serializeData: function() {
      return {
        isAdmin: this.isAdmin,
        isProf: this.isProf,
        isEleve: this.isEleve,
        isOff: this.isOff,
        nomComplet: this.nomComplet,
        version: app.version
      };
    },
    logChange: function() {
      this.initialize();
      return this.render();
    },
    onHomeShow: function(e) {
      return app.trigger("home:show");
    },
    onHomeEditme: function(e) {
      return app.trigger("user:show", app.Auth.get("id"));
    },
    onHomeLogin: function(e) {
      return app.trigger("home:login");
    },
    onHomeLogout: function(e) {
      return app.trigger("home:logout");
    },
    onUsersList: function(e) {
      return app.trigger("users:list");
    },
    spin: function(set_on) {
      if (set_on) {
        return $("span.js-spinner", this.$el).html("<i class='fa fa-spinner fa-spin'></i>");
      } else {
        return $("span.js-spinner", this.$el).html("");
      }
    }
  });
  return Headers;
});
