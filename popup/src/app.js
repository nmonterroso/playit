define(['angular', 'underscore'], function(ng, _) {
	var modules = {
		'playit': [],
		'playit.directives': [],
		'playit.services': [],
		'playit.controllers': []
	};

	_.each(modules, function(deps, module) {
		ng.module(module, deps);
	});

	require([
		'controllers/__init',
		'services/__init',
	], function() {
		ng.element(document).ready(function() {
			ng.bootstrap(document, _.keys(modules))
		})
	});
});