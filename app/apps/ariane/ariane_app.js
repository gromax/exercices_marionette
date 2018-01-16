define(["app"], function(app){
	var API = {
		showAriane: function(){
			require(["apps/ariane/show/show_controller"], function(showController){
				showController.showAriane();
			});
		},

	};

	app.on("ariane:show", function(data){
		API.showAriane();
	});

});
