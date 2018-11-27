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
		spin: "./utils/spin",
		"spin.jquery": "./utils/spin.jquery",
		underscore: "../vendor/underscore/underscore",
		md5: "../vendor/md5/src/md5",
		//popper:"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min",
		popper:"../vendor/popper.js/dist/umd/popper.min",
		bootstrap:"../vendor/bootstrap/dist/js/bootstrap",
		jst:"./templates.underscore",
		//mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML",
		//mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_SVG",
		mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG",
		jsxgraph: "https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.6/jsxgraphcore",
		mathquill: "../vendor/mathquill-0.10.1/mathquill.min",
		svg:"./utils/svg.min"
	},

	shim: {
		underscore: {
			exports: "_"
		},
		svg:{
			exports: "SVG"
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
		mathquill: {
			deps: ["jquery"],
			exports:"MQ",
			init: function(){
				window.MQ = window.MathQuill.getInterface(1);
			}
		},
		popper:{
			exports: "popper.js"
		},
		bootstrap: ["jquery", "popper"],
		"jquery-ui": ["jquery"], // il faut bootstrap avant jquery-ui
		"spin.jquery": ["spin", "jquery"],
		mathjax: {
			exports: "MathJax",
			init: function () {
				// jax semble inutile car écrasé par la config dans l'appel de mathjax
				MathJax.Hub.Config({
					jax:["output/SVG"],
					tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
					SVG:{ scale:120 },
					"fast-preview": {
						disabled:true
					}
				});
				MathJax.Hub.Startup.onload();
				return MathJax;
			}
		}

	}
});

// Il y a un problème : dans le js, il y a un require popper.js hors je je ne peux pas mettre popper.js dans le require_main,
// le js ne passe pas. Donc j'ai dû modifié le bootstrap.js pour mettre popper au lieu de popper.js

require(["popper"], function(p){
	window.Popper = p;
	require(["app"], function(app){
		app.start();
	});
});


