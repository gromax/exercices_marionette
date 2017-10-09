define(["app"], function(app){
	var API = {
		showHeader: function(){
			require(["apps/header/show/show_controller"], function(showController){
				showController.showHeader();
			});
		},

	};

	app.on("header:show", function(){
		API.showHeader();
	});

});
