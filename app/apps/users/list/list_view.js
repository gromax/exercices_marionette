define(["jst","marionette"], function(JST,Marionette){
	var noUsersView = Marionette.View.extend({
		template:  window.JST["users/list/user-list-none"],
		tagName: "tr",
		className: "alert"
	});

	var User = Marionette.View.extend({
		tagName: "tr",
		template: window.JST["users/list/user-list-item"],
		triggers: {
			"click td a.js-edit": "user:edit",
			"click td a.js-editPwd": "user:editPwd",
			"click button.js-delete": "user:delete",
			"click": "user:show"
		},

		flash: function(cssClass){
			var $view = this.$el;
			$view.hide().toggleClass("table-"+cssClass).fadeIn(800, function(){
				setTimeout(function(){ $view.toggleClass("table-"+cssClass) }, 500);
			});
		},

		remove: function(){
			var self = this;
			this.$el.fadeOut(function(){
				Marionette.View.prototype.remove.call(self);
			});
		}

	});

	var Users = Marionette.CompositeView.extend({
		tagName: "table",
		className:"table table-hover",
		template: window.JST["users/list/user-list"],
		emptyView: noUsersView,
		childView: User,
		childViewContainer: "tbody"
	});

	return Users;
});
