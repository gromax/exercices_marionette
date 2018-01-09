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
		"tether.original":"https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
		//tether:"../vendor/tether/dist/js/tether.min",
		tether:"./tether.rustine",
		bootstrap:"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
		//bootstrap:"../vendor/bootstrap4/js/bootstrap.min",
		jst:"../dist/templates.underscore",
		mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML",
		BBcache: "../node_modules/backbone-fetch-cache/backbone.fetch-cache.min",
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
		bootstrap: ["tether","jquery"],
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

require(["app"], function(app){
	app.start();
});
