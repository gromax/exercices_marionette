define(["marionette", "app", "jst"], function(Marionette, app, JST) {
  var OffPanel;
  OffPanel = Marionette.View.extend({
    template: window.JST["home/show/home-off"],
    triggers: {
      "click a.js-login": "home:login"
    },
    onHomeLogin: function(e) {
      return app.trigger("home:login");
    },
    serializeData: function() {
      return {
        version: app.version
      };
    }
  });
  return OffPanel;
});
