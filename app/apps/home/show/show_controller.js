define(["app","apps/home/show/admin_view","apps/home/show/off_view"], function(app, AdminView, OffView){
	var Controller = {
		showHome: function(){
			var Auth = app.Auth;
			var rank = app.Auth.get('rank');
			switch (rank) {
				case "Root":
					var view = new AdminView();
					break;
				case "Admin":
					var view = new AdminView();
					break;
				default:
					var view = new OffView();
			}
			app.regions.getRegion('main').show(view);
		}
	};

	return Controller;
});
