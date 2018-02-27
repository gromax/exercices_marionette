requirejs.config({
	baseUrl: "app",

	paths: {
		backbone: "../vendor/backbone/backbone",
		"backbone.syphon": "../vendor/backbone.syphon/lib/backbone.syphon",
		"backbone.radio": "../vendor/backbone.radio/build/backbone.radio",
		jquery: "../vendor/jquery/dist/jquery",
		"jquery-ui": "../vendor/jquery-ui/jquery-ui",
		json2: "../vendor/json2/json2",
		marionette: "../vendor/backbone.marionette/lib/backbone.marionette",
		spin: "../vendor/spin",
		"spin.jquery": "../vendor/spin.jquery",
		text: "../vendor/requirejs-text/text",
		tpl : "../vendor/requirejs-underscore-tpl/underscore-tpl",
		underscore: "../vendor/underscore/underscore",
		md5: "../vendor/md5/src/md5",
		popper:"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min",
		bootstrap:"../vendor/bootstrap/dist/js/bootstrap",
		jst:"../dist/templates.underscore",
		mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML",
		jsxgraph: "https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.6/jsxgraphcore",
	},

	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: ["jquery", "underscore", "json2"],
			exports: "Backbone"
		},
		"backbone.syphon": ["backbone"],
		"backbone.radio": ["backbone"],
		marionette: {
			deps: ["backbone"],
			exports: "Marionette"
		},
		popper:{
			exports: "popper.js"
		},
		bootstrap: ["jquery", "popper"],
		"jquery-ui": ["jquery"], // il faut bootstrap avant jquery-ui
		"spin.jquery": ["spin", "jquery"],
		tpl: ["text"],
		mathjax: {
			exports: "MathJax",
			init: function () {
				MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
				MathJax.Hub.Startup.onload();
				return MathJax;
			}
		}

	}
});


require(["popper"], function(p){
	window.Popper = p;
	require(["app"], function(app){
		app.start();
	});
});


