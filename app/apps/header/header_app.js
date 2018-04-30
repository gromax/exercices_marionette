define(["app"], function(app) {
  var API;
  API = {
    showHeader: function() {
      return require(["apps/header/show/show_controller"], function(showController) {
        return showController.showHeader();
      });
    }
  };
  return app.on("header:show", function() {
    return API.showHeader();
  });
});
